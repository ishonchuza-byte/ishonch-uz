const fs = require('fs');
const content = fs.readFileSync('styles.css', 'utf8');

// Find some sidebar classes or admin panel classes
const lines = content.split('\n');
const matches = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('adm-sidebar') || line.includes('adm-nav') || line.includes('adm-wrap')) {
    matches.push({ lineNum: i + 1, content: line.trim() });
  }
}
console.log('Style matches:', matches.slice(0, 30));
