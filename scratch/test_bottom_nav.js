const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

const paths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
];

let chromePath = null;
for (const p of paths) {
  if (fs.existsSync(p)) {
    chromePath = p;
    break;
  }
}

if (!chromePath) {
  chromePath = 'chrome';
}

console.log('Using Chrome path:', chromePath);

// Start Chrome headlessly with remote debugging enabled and mobile viewport emulation
const chromeProcess = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9222',
  '--window-size=375,812', // standard mobile viewport (iPhone X size)
  '--user-agent="Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"',
  'http://localhost:5173/'
]);

chromeProcess.on('error', (err) => {
  console.error('Failed to start Chrome process:', err.message);
});

console.log('Waiting 3 seconds for Chrome to launch...');

setTimeout(() => {
  http.get('http://127.0.0.1:9222/json', (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      try {
        const targets = JSON.parse(body);
        const pageTarget = targets.find(t => t.type === 'page');
        if (!pageTarget) {
          console.error('No page target found.');
          chromeProcess.kill();
          process.exit(1);
        }
        
        console.log('Connecting to WebSocket debugger:', pageTarget.webSocketDebuggerUrl);
        const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
        
        ws.onopen = () => {
          console.log('Connected! Enabling Console and Runtime...');
          ws.send(JSON.stringify({ id: 1, method: 'Console.enable' }));
          ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
          
          setTimeout(() => {
            const expression = `
              (async () => {
                const getNavStatus = () => {
                  const nav = document.querySelector('.mobile-bottom-nav');
                  if (!nav) return 'Not in DOM';
                  const style = window.getComputedStyle(nav);
                  const rect = nav.getBoundingClientRect();
                  return {
                    display: style.display,
                    visibility: style.visibility,
                    opacity: style.opacity,
                    zIndex: style.zIndex,
                    bottom: style.bottom,
                    rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
                  };
                };

                console.log("TEST: Initial mobile nav status:", JSON.stringify(getNavStatus()));

                const hero = document.querySelector('.hero-featured');
                if (hero) {
                  console.log("TEST: Clicking hero to open article...");
                  hero.click();
                  
                  await new Promise(r => setTimeout(r, 1000));
                  console.log("TEST: Article opened. Mobile nav status:", JSON.stringify(getNavStatus()));
                  
                  // Let's check if the nav is overlapping with the article-page or is hidden/displaced
                  const nav = document.querySelector('.mobile-bottom-nav');
                  const article = document.querySelector('.article-page');
                  if (nav && article) {
                    const navRect = nav.getBoundingClientRect();
                    const articleRect = article.getBoundingClientRect();
                    console.log("TEST: Intersection check:", JSON.stringify({
                      navTop: navRect.top,
                      articleBottom: articleRect.bottom
                    }));
                  }
                } else {
                  console.error("TEST ERROR: .hero-featured not found");
                }
              })()
            `;
            ws.send(JSON.stringify({
              id: 10,
              method: 'Runtime.evaluate',
              params: {
                expression: expression,
                awaitPromise: true
              }
            }));
          }, 2000);
        };
        
        ws.onmessage = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.method === 'Console.messageAdded') {
            console.log(`[BROWSER CONSOLE] ${msg.params.message.text}`);
          }
          if (msg.method === 'Runtime.exceptionThrown') {
            console.error(`[BROWSER EXCEPTION] ${msg.params.exceptionDetails.text}`);
          }
        };
        
        setTimeout(() => {
          ws.close();
          chromeProcess.kill();
          process.exit(0);
        }, 8000);
        
      } catch (e) {
        console.error('Error:', e.message);
        chromeProcess.kill();
        process.exit(1);
      }
    });
  }).on('error', (err) => {
    console.error('Error fetching targets:', err.message);
    chromeProcess.kill();
    process.exit(1);
  });
}, 3000);
