const fs = require('fs');

const appPath = 'app.jsx';
const newAdminPath = 'scratch/new_admin.js';

let appContent = fs.readFileSync(appPath, 'utf8');
const newAdminContent = fs.readFileSync(newAdminPath, 'utf8');

// Find the start line of AdminPanel
const startToken = 'function AdminPanel({ lang, setLang, allStories, stories, setAllStories, refreshPublicStories, siteConfig, setSiteConfig, pinnedHeroId, setPinnedHeroId, pinnedSideIds, setPinnedSideIds, ads, setAds }) {';
const startIndex = appContent.indexOf(startToken);

if (startIndex === -1) {
  console.error('Could not find AdminPanel start token!');
  process.exit(1);
}

// Find the start line of AdBanner
const endToken = 'function AdBanner({ ads, position }) {';
const endIndex = appContent.indexOf(endToken);

if (endIndex === -1) {
  console.error('Could not find AdBanner end token!');
  process.exit(1);
}

// The new content will replace from startIndex to endIndex
const beforePart = appContent.substring(0, startIndex);
const afterPart = appContent.substring(endIndex);

const updatedContent = beforePart + newAdminContent + '\n\n' + afterPart;

fs.writeFileSync(appPath, updatedContent, 'utf8');
console.log('Successfully swapped AdminPanel component in app.jsx!');
