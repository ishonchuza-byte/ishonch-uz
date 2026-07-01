const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

console.log('fetch("/api/stories") or similar:');
lines.forEach((line, index) => {
  if (line.includes('/api/stories')) {
    console.log(`Line ${index + 1}: ${line.trim()}`);
  }
});
