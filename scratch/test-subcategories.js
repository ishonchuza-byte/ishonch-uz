const fs = require('fs');
const path = require('path');

// 1. Simulate parseCategoriesWithSubs from app.jsx
function parseCategoriesWithSubs(text) {
  const parts = [];
  let current = "";
  let inParens = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === "(") inParens = true;
    if (char === ")") inParens = false;
    if (char === "," && !inParens) {
      parts.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  if (current.trim()) {
    parts.push(current.trim());
  }

  const categories = [];
  const subcategories = {};

  parts.forEach(part => {
    const match = part.match(/^([^(]+)(?:\(([^)]+)\))?$/);
    if (!match) {
      const name = part.trim();
      if (name) {
        categories.push(name);
        subcategories[name] = [];
      }
      return;
    }
    const name = match[1].trim();
    if (!name) return;
    const subsStr = match[2];
    const subs = subsStr ? subsStr.split(",").map(s => s.trim()).filter(Boolean) : [];
    categories.push(name);
    subcategories[name] = subs;
  });

  return { categories, subcategories };
}

function runTest() {
  console.log("=== 1. Testing Parentheses Parser Logic ===");
  const testString = "Siyosat (Mahalliy, Xalqaro), Iqtisod (Moliya, Soliqlar), Texnologiya";
  const parsed = parseCategoriesWithSubs(testString);
  
  console.log("Parsed Categories:", parsed.categories);
  console.log("Parsed Subcategories:", parsed.subcategories);

  const expectedCats = ["Siyosat", "Iqtisod", "Texnologiya"];
  const expectedSubs = {
    "Siyosat": ["Mahalliy", "Xalqaro"],
    "Iqtisod": ["Moliya", "Soliqlar"],
    "Texnologiya": []
  };

  let parserSuccess = true;
  if (JSON.stringify(parsed.categories) !== JSON.stringify(expectedCats)) {
    console.error("Parser Error: Categories did not match!");
    parserSuccess = false;
  }
  if (JSON.stringify(parsed.subcategories) !== JSON.stringify(expectedSubs)) {
    console.error("Parser Error: Subcategories did not match!");
    parserSuccess = false;
  }

  if (parserSuccess) {
    console.log("Parser test: SUCCESS\n");
  } else {
    console.error("Parser test: FAILED\n");
    process.exit(1);
  }

  console.log("=== 2. Testing Subcategory Renaming & Story Update ===");
  const dbPath = path.join(__dirname, '..', 'data', 'db.json');
  if (!fs.existsSync(dbPath)) {
    console.error("Database file db.json not found!");
    process.exit(1);
  }

  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  // Ensure database has a story in 'Siyosat' category for testing
  db.stories = db.stories || {};
  db.stories.uz = db.stories.uz || [];
  
  // Add a test story
  const testStoryId = "sub-test-story-123";
  // Remove existing test story if any
  db.stories.uz = db.stories.uz.filter(s => s.id !== testStoryId);
  db.stories.uz.push({
    id: testStoryId,
    category: "Siyosat",
    subcategory: "Mahalliy",
    title: "Test Subcategory Renaming Story",
    status: "published"
  });

  const code = "uz";
  const oldCats = ["Siyosat", "Iqtisod", "Texnologiya"];
  const newCats = ["Siyosat", "Iqtisod", "Texnologiya"]; // categories unchanged, only subcategories renamed

  const oldSubMap = {
    "Siyosat": ["Mahalliy", "Xalqaro"],
    "Iqtisod": ["Moliya", "Soliqlar"]
  };

  const newSubMap = {
    "Siyosat": ["Mahalliy Yangi", "Xalqaro"],
    "Iqtisod": ["Moliya", "Soliqlar"]
  };

  const mapping = {}; // Category renaming mapping (empty because categories are same)

  newCats.forEach(catName => {
    const oldCatName = Object.keys(mapping).find(key => mapping[key] === catName) || catName;
    const oldSubs = oldSubMap[oldCatName] || [];
    const newSubs = newSubMap[catName] || [];

    const subRemoved = oldSubs.filter(s => !newSubs.includes(s));
    const subAdded = newSubs.filter(s => !oldSubs.includes(s));
    const subMapping = {};

    if (subRemoved.length > 0 && subAdded.length > 0) {
      const minSubLen = Math.min(oldSubs.length, newSubs.length);
      for (let i = 0; i < minSubLen; i++) {
        const oldVal = oldSubs[i];
        const newVal = newSubs[i];
        if (oldVal !== newVal && subRemoved.includes(oldVal) && subAdded.includes(newVal)) {
          subMapping[oldVal] = newVal;
          const remIdx = subRemoved.indexOf(oldVal);
          if (remIdx > -1) subRemoved.splice(remIdx, 1);
          const addIdx = subAdded.indexOf(newVal);
          if (addIdx > -1) subAdded.splice(addIdx, 1);
        }
      }

      if (subRemoved.length === 1 && subAdded.length === 1) {
        subMapping[subRemoved[0]] = subAdded[0];
      } else if (subRemoved.length > 0 && subRemoved.length === subAdded.length) {
        for (let i = 0; i < subRemoved.length; i++) {
          subMapping[subRemoved[i]] = subAdded[i];
        }
      }
    }

    if (Object.keys(subMapping).length > 0) {
      console.log(`Subcategory mapping for category ${catName}:`, subMapping);
      if (db.stories && db.stories[code]) {
        db.stories[code] = db.stories[code].map(story => {
          if (story.category === catName && story.subcategory && subMapping[story.subcategory]) {
            return { ...story, subcategory: subMapping[story.subcategory] };
          }
          return story;
        });
      }
    }
  });

  // Check if our test story's subcategory is updated
  const updatedStory = db.stories.uz.find(s => s.id === testStoryId);
  console.log("Updated Story category:", updatedStory.category);
  console.log("Updated Story subcategory:", updatedStory.subcategory);

  if (updatedStory && updatedStory.subcategory === "Mahalliy Yangi") {
    console.log("Subcategory Renaming Test: SUCCESS");
  } else {
    console.error("Subcategory Renaming Test: FAILED");
    process.exit(1);
  }
}

runTest();
