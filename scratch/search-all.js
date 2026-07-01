const fs = require('fs');
const path = require('path');

function walk(dir, results = []) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== '.netlify') {
        walk(filePath, results);
      }
    } else {
      results.push(filePath);
    }
  });
  return results;
}

const allFiles = walk('.');
console.log('Total files to search:', allFiles.length);

const searchWords = ['Бошқарув панели', 'Бош саҳифа', 'Иқтибос', 'Муҳим мақолалар', 'Мақолалар', 'Янгиликлар', 'Журнал сонлари', 'Муаллифлар', 'Тўловлар'];

for (const file of allFiles) {
  if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.html') || file.endsWith('.json') || file.endsWith('.css')) {
    const content = fs.readFileSync(file, 'utf8');
    for (const word of searchWords) {
      if (content.includes(word)) {
        console.log(`Found "${word}" in file: ${file}`);
      }
    }
  }
}
