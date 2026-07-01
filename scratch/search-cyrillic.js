const fs = require('fs');
const content = fs.readFileSync('app.jsx', 'utf8');
const searchWords = ['Бошқарув панели', 'Бош саҳифа', 'Иқтибос', 'Муҳим мақолалар', 'Мақолалар', 'Янгиликлар', 'Журнал сонлари', 'Муаллифлар', 'Тўловлар'];
for (const word of searchWords) {
  const count = (content.match(new RegExp(word, 'g')) || []).length;
  console.log(`Word "${word}": ${count} matches`);
}
