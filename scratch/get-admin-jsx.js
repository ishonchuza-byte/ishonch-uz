const fs = require('fs');
const content = fs.readFileSync('app.jsx', 'utf8');
const lines = content.split('\n');
const start = 2990;
const end = 4800;
fs.writeFileSync('scratch/admin_view.js', lines.slice(start, end).join('\n'));
console.log('Done!');
