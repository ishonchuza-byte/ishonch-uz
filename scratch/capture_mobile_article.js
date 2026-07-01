const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

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

// Start Chrome headlessly with remote debugging enabled and mobile viewport
const chromeProcess = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9222',
  '--window-size=375,812',
  '--user-agent="Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"',
  'http://localhost:5173/'
]);

chromeProcess.on('error', (err) => {
  console.error('Failed to start Chrome:', err.message);
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
          console.log('Connected! Enabling Console, Runtime, and Page...');
          ws.send(JSON.stringify({ id: 1, method: 'Console.enable' }));
          ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
          ws.send(JSON.stringify({ id: 3, method: 'Page.enable' }));
          
          // Wait for page load and click article
          setTimeout(() => {
            const expression = `
              (async () => {
                const hero = document.querySelector('.hero-featured');
                if (hero) {
                  hero.click();
                  await new Promise(r => setTimeout(r, 1200));
                  return "Clicked and waited";
                }
                return "Hero not found";
              })()
            `;
            ws.send(JSON.stringify({
              id: 10,
              method: 'Runtime.evaluate',
              params: { expression, awaitPromise: true }
            }));
          }, 1500);
        };
        
        ws.onmessage = (event) => {
          const msg = JSON.parse(event.data);
          
          // If the click automation completed, take a screenshot
          if (msg.id === 10) {
            console.log('Automation result:', msg.result.value);
            console.log('Taking screenshot...');
            ws.send(JSON.stringify({
              id: 20,
              method: 'Page.captureScreenshot',
              params: {
                format: 'png',
                captureBeyondViewport: false
              }
            }));
          }
          
          // Process the screenshot response
          if (msg.id === 20) {
            if (msg.error) {
              console.error('Screenshot error:', msg.error);
            } else if (msg.result && msg.result.data) {
              const screenshotPath = path.join('C:', 'Users', 'Xp11', '.gemini', 'antigravity', 'brain', 'd4445686-a820-4f5a-8d94-cd4d350be8a9', 'mobile_article_screenshot.png');
              fs.writeFileSync(screenshotPath, Buffer.from(msg.result.data, 'base64'));
              console.log('Screenshot saved successfully to:', screenshotPath);
            }
            ws.close();
            chromeProcess.kill();
            process.exit(0);
          }
        };
        
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
