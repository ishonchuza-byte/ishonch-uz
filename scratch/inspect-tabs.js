const fs = require('fs');
const content = fs.readFileSync('app.jsx', 'utf8');
const lines = content.split('\n');

const activeTabLines = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('activeTab ===') || line.includes('activeTab ====')) {
    activeTabLines.push({ lineNum: i + 1, content: line.trim() });
  }
}
console.log('Active tab conditions:');
console.log(activeTabLines);
