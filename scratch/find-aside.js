const fs = require('fs');
const content = fs.readFileSync('app.jsx', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('<aside className="adm-sidebar">') || line.includes('className="adm-nav"')) {
    console.log(`Line ${i + 1}: ${line.trim()}`);
  }
}
