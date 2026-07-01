const fs = require('fs');
const path = require('path');

// Simulate the logic we added to server.js
function runTest() {
  console.log("Starting Category Renaming Test...");

  // Load a copy of db.json
  const dbPath = path.join(__dirname, '..', 'data', 'db.json');
  if (!fs.existsSync(dbPath)) {
    console.error("Database file db.json not found!");
    process.exit(1);
  }

  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  // Let's check initial state
  const oldCategoriesUz = db.config?.categoriesUz || ["Siyosat", "Iqtisod", "Texnologiya", "Sport", "Madaniyat", "Tahlil"];
  const oldCategoriesRu = db.config?.categoriesRu || ["Политика", "Экономика", "Технологии", "Спорт", "Культура", "Аналитика"];
  const oldCategoriesUzk = db.config?.categoriesUzk || ["Сиёсат", "Иқтисод", "Технология", "Спорт", "Маданият", "Таҳлил"];

  console.log("Current Categories (Latin):", oldCategoriesUz);
  
  // Let's count how many stories are in 'Siyosat'
  const countSiyosatBefore = (db.stories?.uz || []).filter(s => s.category === 'Siyosat').length;
  console.log(`Stories in 'Siyosat' category before rename: ${countSiyosatBefore}`);

  if (countSiyosatBefore === 0) {
    console.log("Warning: No stories in 'Siyosat' to rename. We will add a temporary one.");
    db.stories = db.stories || {};
    db.stories.uz = db.stories.uz || [];
    db.stories.uz.push({
      id: "temp-test-story-id-siyosat",
      category: "Siyosat",
      title: "Test Siyosat",
      status: "published"
    });
  }

  // Define new categories (simulating renaming 'Siyosat' to 'Siyosat Yangi')
  const newCategoriesUz = ["Siyosat Yangi", "Iqtisod", "Texnologiya", "Sport", "Madaniyat", "Tahlil"];
  const newCategoriesRu = oldCategoriesRu;
  const newCategoriesUzk = oldCategoriesUzk;

  const langs = [
    { code: "uz", oldCats: oldCategoriesUz, newCats: newCategoriesUz },
    { code: "ru", oldCats: oldCategoriesRu, newCats: newCategoriesRu },
    { code: "uzk", oldCats: oldCategoriesUzk, newCats: newCategoriesUzk }
  ];

  langs.forEach(({ code, oldCats, newCats }) => {
    if (!newCats || !Array.isArray(newCats)) return;

    const removed = oldCats.filter(c => !newCats.includes(c));
    const added = newCats.filter(c => !oldCats.includes(c));
    const mapping = {};

    if (removed.length > 0 && added.length > 0) {
      const minLen = Math.min(oldCats.length, newCats.length);
      for (let i = 0; i < minLen; i++) {
        const oldVal = oldCats[i];
        const newVal = newCats[i];
        if (oldVal !== newVal && removed.includes(oldVal) && added.includes(newVal)) {
          mapping[oldVal] = newVal;
          const remIdx = removed.indexOf(oldVal);
          if (remIdx > -1) removed.splice(remIdx, 1);
          const addIdx = added.indexOf(newVal);
          if (addIdx > -1) added.splice(addIdx, 1);
        }
      }

      if (removed.length === 1 && added.length === 1) {
        mapping[removed[0]] = added[0];
      } else if (removed.length > 0 && removed.length === added.length) {
        for (let i = 0; i < removed.length; i++) {
          mapping[removed[i]] = added[i];
        }
      }
    }

    if (Object.keys(mapping).length > 0) {
      console.log(`Mapping for lang ${code}:`, mapping);
      if (db.stories && db.stories[code]) {
        db.stories[code] = db.stories[code].map(story => {
          if (story.category && mapping[story.category]) {
            return { ...story, category: mapping[story.category] };
          }
          return story;
        });
      }
    }
  });

  // Verify 'Siyosat' stories have been renamed to 'Siyosat Yangi'
  const countSiyosatAfter = (db.stories?.uz || []).filter(s => s.category === 'Siyosat').length;
  const countSiyosatYangiAfter = (db.stories?.uz || []).filter(s => s.category === 'Siyosat Yangi').length;

  console.log(`Stories in 'Siyosat' after rename: ${countSiyosatAfter}`);
  console.log(`Stories in 'Siyosat Yangi' after rename: ${countSiyosatYangiAfter}`);

  if (countSiyosatAfter === 0 && countSiyosatYangiAfter > 0) {
    console.log("SUCCESS: Category renaming logic works perfectly!");
  } else {
    console.error("FAILURE: Category renaming logic did not work!");
    process.exit(1);
  }
}

runTest();
