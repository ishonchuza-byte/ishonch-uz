const fs = require('fs');
const content = fs.readFileSync('app.jsx', 'utf8');

// Let's search for "checkSession" and print the surrounding lines
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('async function checkSession()')) {
    console.log('Found checkSession at line:', i + 1);
    console.log(lines.slice(i, i + 15).join('\n'));
  }
}
