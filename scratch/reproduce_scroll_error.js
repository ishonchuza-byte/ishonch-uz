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

const chromeProcess = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9222',
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
          console.error('No page target found. Targets:', targets);
          chromeProcess.kill();
          process.exit(1);
        }
        
        console.log('Connecting to WebSocket debugger:', pageTarget.webSocketDebuggerUrl);
        const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
        
        ws.onopen = () => {
          console.log('Connected! Enabling Console and Runtime...');
          ws.send(JSON.stringify({ id: 1, method: 'Console.enable' }));
          ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
          
          // Execute browser scroll automation
          setTimeout(() => {
            const expression = `
              (async () => {
                console.log("REPRO: Inside browser context");
                const hero = document.querySelector('.hero-featured');
                if (!hero) {
                  console.error("REPRO ERROR: .hero-featured not found in DOM!");
                  return;
                }
                console.log("REPRO: Clicking hero card to open article...");
                hero.click();
                
                await new Promise(r => setTimeout(r, 1000));
                console.log("REPRO: Starting scroll increments...");
                for (let i = 0; i < 15; i++) {
                  window.scrollBy(0, 150);
                  await new Promise(r => setTimeout(r, 100));
                }
                console.log("REPRO: Scroll automation complete.");
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
          }, 1500);
        };
        
        ws.onmessage = (event) => {
          const msg = JSON.parse(event.data);
          
          if (msg.method === 'Console.messageAdded') {
            const { text, level, url, line } = msg.params.message;
            console.log(`[BROWSER CONSOLE - ${level.toUpperCase()}] ${text} (at ${url}:${line})`);
          }
          
          if (msg.method === 'Runtime.exceptionThrown') {
            const details = msg.params.exceptionDetails;
            const description = details.exception ? details.exception.description : details.text;
            console.error(`[BROWSER EXCEPTION] ${description}`);
          }
        };
        
        ws.onerror = (err) => {
          console.error('WebSocket error:', err.message || err);
        };
        
        // Wait 10 seconds to capture all logs and errors
        setTimeout(() => {
          console.log('Closing browser debugger...');
          ws.close();
          chromeProcess.kill();
          process.exit(0);
        }, 10000);
        
      } catch (e) {
        console.error('Failed to parse debug targets:', e.message);
        chromeProcess.kill();
        process.exit(1);
      }
    });
  }).on('error', (err) => {
    console.error('Failed to connect to Chrome remote debug port:', err.message);
    chromeProcess.kill();
    process.exit(1);
  });
}, 3000);
