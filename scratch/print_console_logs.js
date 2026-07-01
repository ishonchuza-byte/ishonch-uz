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

const targetUrl = process.argv[2] || 'http://localhost:5173/news/1564ac87-eb78-4e20-ae60-03e5223e3eb3';
console.log('Testing URL:', targetUrl);

const chromeProcess = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9222',
  '--window-size=1280,1024',
  'http://localhost:5173/'
]);

chromeProcess.on('error', (err) => {
  console.error('Failed to start Chrome:', err.message);
});

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
        
        const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
        let consoleLogs = [];
        
        ws.onopen = () => {
          ws.send(JSON.stringify({ id: 1, method: 'Console.enable' }));
          ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
          ws.send(JSON.stringify({ id: 3, method: 'Page.enable' }));
          
          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 100,
              method: 'Page.navigate',
              params: { url: targetUrl }
            }));
          }, 500);
        };
        
        ws.onmessage = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.method === 'Runtime.consoleAPICalled') {
            const args = msg.params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' ');
            consoleLogs.push(`[Console] ${msg.params.type}: ${args}`);
          }
          if (msg.method === 'Runtime.exceptionThrown') {
            const details = msg.params.exceptionDetails;
            const desc = details.exception ? details.exception.description : details.text;
            consoleLogs.push(`[Exception] ${desc}`);
          }
        };
        
        setTimeout(async () => {
          console.log('--- CONSOLE LOGS ---');
          console.log(consoleLogs.join('\n'));
          ws.close();
          chromeProcess.kill();
          process.exit(0);
        }, 5000);
        
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
