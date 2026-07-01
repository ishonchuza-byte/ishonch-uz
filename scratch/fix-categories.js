const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings to LF
content = content.replace(/\r\n/g, '\n');

// 1. Fix changeLang page translation list
const targetChangeLang = `      const nextPages = [
        nextLang === "uz" ? "Bosh sahifa" : (nextLang === "uzk" ? "Бош саҳифа" : "Главная"),
        ...nextCategories,
        nextLang === "uz" ? "Aloqa" : (nextLang === "uzk" ? "Алоқа" : "Контакты")
      ];`;

const replacementChangeLang = `      const nextPages = [
        nextLang === "uz" ? "Bosh sahifa" : (nextLang === "uzk" ? "Бош саҳифа" : "Главная"),
        ...nextCategories,
        nextLang === "uz" ? "Jurnallar" : (nextLang === "uzk" ? "Журналлар" : "Журналы"),
        nextLang === "uz" ? "Aloqa" : (nextLang === "uzk" ? "Алоқа" : "Контакты")
      ];`;

if (content.includes(targetChangeLang)) {
  content = content.replace(targetChangeLang, replacementChangeLang);
  console.log("✓ Fixed changeLang page list to include Jurnallar");
} else {
  console.log("⚠️ Target changeLang pattern not found");
}

// 2. Enhance Category Dropdown in Editor
const targetEditorSelect = `                    <label>
                      Kategoriya
                      <select value={form.category} onChange={(e) => updateField("category", e.target.value)}>
                        {categories.map((cat) => <option key={cat}>{cat}</option>)}
                      </select>
                    </label>`;

const replacementEditorSelect = `                    <label>
                      Kategoriya
                      <select value={form.category} onChange={(e) => updateField("category", e.target.value)}>
                        {form.category && !categories.includes(form.category) && (
                          <option value={form.category}>{form.category} (Eski)</option>
                        )}
                        {categories.map((cat) => <option key={cat}>{cat}</option>)}
                      </select>
                    </label>`;

if (content.includes(targetEditorSelect)) {
  content = content.replace(targetEditorSelect, replacementEditorSelect);
  console.log("✓ Added legacy category fallback option in editor dropdown");
} else {
  console.log("⚠️ Target editor select dropdown pattern not found");
}

// Write back as CRLF
fs.writeFileSync(filePath, content.replace(/\n/g, '\r\n'), 'utf8');
console.log("App.jsx categories update complete.");
