const fs = require('fs');
const content = fs.readFileSync('app.jsx', 'utf8');
const lines = content.split('\n');

const components = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.startsWith('function ') || line.startsWith('const ') || line.startsWith('class ')) {
    if (line.includes('(') || line.includes('=')) {
      components.push({ lineNum: i + 1, content: line.trim() });
    }
  }
}
console.log('Definitions in app.jsx:');
console.log(components);
