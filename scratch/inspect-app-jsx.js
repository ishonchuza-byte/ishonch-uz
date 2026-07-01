const fs = require('fs');
const content = fs.readFileSync('app.jsx', 'utf8');
const lines = content.split('\n');

// We know App starts at line 804. Let's look at lines 804 to 1430.
// Let's write a small script to find any routing logic or 'setPage' or rendering inside App.
const appPart = lines.slice(803, 1430).join('\n');
fs.writeFileSync('scratch/app_part.js', appPart);
console.log('App part written to scratch/app_part.js');
