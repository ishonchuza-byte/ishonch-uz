const fs = require('fs');

console.log('=== SEARCHING scroll in app.jsx ===');
const appContent = fs.readFileSync('app.jsx', 'utf8');
const appLines = appContent.split('\n');
appLines.forEach((line, idx) => {
  if (line.toLowerCase().includes('scroll')) {
    console.log(`app.jsx:${idx + 1}: ${line.trim()}`);
  }
});






