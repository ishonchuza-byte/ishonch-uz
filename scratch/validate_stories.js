const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'stories.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const langs = ['uz', 'ru', 'uzk'];
for (const lang of langs) {
  const list = data.stories[lang] || [];
  console.log(`Lang: ${lang}, count: ${list.length}`);
  for (const [idx, s] of list.entries()) {
    const missing = [];
    if (!s.id) missing.push('id');
    if (!s.title) missing.push('title');
    if (!s.category) missing.push('category');
    if (!s.body) missing.push('body');
    if (missing.length) {
      console.log(`  Index ${idx} is missing: ${missing.join(', ')}`, s);
    }
  }
}
