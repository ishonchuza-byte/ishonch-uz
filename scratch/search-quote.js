const fs = require('fs');
const content = fs.readFileSync('app.jsx', 'utf8');
const regex = /quote|iqtibos|citation|citation/gi;
let match;
const matches = [];
while ((match = regex.exec(content)) !== null) {
  matches.push({ index: match.index, text: content.substring(match.index - 50, match.index + 50) });
}
console.log('Matches:', matches);
