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

const chromeProcess = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9222',
  '--window-size=375,812',
  '--user-agent="Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"',
  'http://localhost:5173/'
]);

setTimeout(() => {
  http.get('http://127.0.0.1:9222/json', (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      try {
        const targets = JSON.parse(body);
        const pageTarget = targets.find(t => t.type === 'page');
        const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
        
        ws.onopen = () => {
          ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));
          ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
          
          setTimeout(() => {
            const expression = `
              (async () => {
                const hero = document.querySelector('.hero-featured');
                if (hero) {
                  hero.click();
                  await new Promise(r => setTimeout(r, 1200));
                  // Scroll down a bit
                  window.scrollTo(0, 450);
                  await new Promise(r => setTimeout(r, 500));
                  return "Scrolled";
                }
                return "Not found";
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
          if (msg.id === 10) {
            ws.send(JSON.stringify({
              id: 20,
              method: 'Page.captureScreenshot',
              params: { format: 'png', captureBeyondViewport: false }
            }));
          }
          if (msg.id === 20) {
            const screenshotPath = path.join('C:', 'Users', 'Xp11', '.gemini', 'antigravity', 'brain', 'd4445686-a820-4f5a-8d94-cd4d350be8a9', 'mobile_article_scrolled.png');
            fs.writeFileSync(screenshotPath, Buffer.from(msg.result.data, 'base64'));
            console.log('Saved scrolled screenshot');
            ws.close();
            chromeProcess.kill();
            process.exit(0);
          }
        };
      } catch (e) {
        chromeProcess.kill();
        process.exit(1);
      }
    });
  });
}, 3000);
