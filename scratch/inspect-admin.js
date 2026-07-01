const fs = require('fs');
const content = fs.readFileSync('app.jsx', 'utf8');
const lines = content.split('\n');

// Get lines from 2330 to 3000
const adminPart = lines.slice(2329, 3100).join('\n');
fs.writeFileSync('scratch/admin_part.js', adminPart);
console.log('Written scratch/admin_part.js');
