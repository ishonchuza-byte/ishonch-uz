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

// Read stories from stories.json
const storiesData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'stories.json'), 'utf8'));
const uzStories = storiesData.stories.uz || [];
console.log(`Loaded ${uzStories.length} Uzbek stories to test.`);

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
        
        let exceptions = [];
        let storyResults = [];
        
        ws.onopen = () => {
          ws.send(JSON.stringify({ id: 1, method: 'Console.enable' }));
          ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
          ws.send(JSON.stringify({ id: 3, method: 'Page.enable' }));
          
          runTests();
        };
        
        ws.onmessage = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.method === 'Runtime.exceptionThrown') {
            const details = msg.params.exceptionDetails;
            const description = details.exception ? details.exception.description : details.text;
            exceptions.push(description);
          }
        };
        
        async function runTests() {
          for (const s of uzStories) {
            exceptions = [];
            const url = `http://localhost:5173/news/${s.slug || s.id}`;
            console.log(`Testing story: ${s.title} (${url})`);
            
            // Navigate
            ws.send(JSON.stringify({
              id: 100,
              method: 'Page.navigate',
              params: { url: url }
            }));
            
            await new Promise(r => setTimeout(r, 5000));
            
            // Check DOM structure
            const checkExpression = `
              (() => {
                const article = document.querySelector('.article-page');
                const comments = document.querySelector('.comments-section');
                const footer = document.querySelector('.footer');
                const bodyText = document.querySelector('.article-body-text');
                return {
                  articleExists: !!article,
                  commentsExists: !!comments,
                  footerExists: !!footer,
                  bodyExists: !!bodyText,
                  bodyTextLength: bodyText ? bodyText.innerText.length : 0
                };
              })()
            `;
            
            const resultPromise = new Promise((resolve) => {
              const cmdId = Math.floor(Math.random() * 10000) + 200;
              const listener = (event) => {
                const msg = JSON.parse(event.data);
                if (msg.id === cmdId) {
                  ws.removeEventListener('message', listener);
                  resolve(msg.result.result.value);
                }
              };
              ws.addEventListener('message', listener);
              ws.send(JSON.stringify({
                id: cmdId,
                method: 'Runtime.evaluate',
                params: { expression: checkExpression, returnByValue: true }
              }));
            });
            
            const domStatus = await resultPromise;
            
            storyResults.push({
              title: s.title,
              url: url,
              exceptions: [...exceptions],
              dom: domStatus
            });
          }
          
          console.log('\n=== TEST RESULTS ===');
          console.log(JSON.stringify(storyResults, null, 2));
          
          ws.close();
          chromeProcess.kill();
          process.exit(0);
        }
        
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
