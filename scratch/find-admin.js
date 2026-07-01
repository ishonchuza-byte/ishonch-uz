const fs = require('fs');
const content = fs.readFileSync('app.jsx', 'utf8');

// Find all matches for components or routes containing 'Admin' or 'admin'
const lines = content.split('\n');
console.log('Total lines:', lines.length);

// Let's find matches and print line numbers and brief info
const matches = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('Admin') || line.includes('function Admin') || line.includes('const Admin')) {
    matches.push({ lineNum: i + 1, content: line.trim() });
  }
}
console.log('Matches:', matches.slice(0, 50));
