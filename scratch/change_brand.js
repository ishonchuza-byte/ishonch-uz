const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

// 1. Modify styles.css (Colors)
function updateStyles() {
  const filePath = path.join(projectRoot, 'styles.css');
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace Hex Colors
  content = content.replace(/#c31932/g, '#0e5ff2'); // --brand in light, --brand-dark in dark
  content = content.replace(/#8f1022/g, '#0a46b5'); // --brand-dark in light
  content = content.replace(/#e63950/g, '#38bdf8'); // --brand in dark
  content = content.replace(/#0f1623/g, '#0a1128'); // --paper in dark
  content = content.replace(/#182030/g, '#111d42'); // --surface in dark

  // Replace RGBA Colors (195, 25, 50) -> (14, 95, 242)
  content = content.replace(/rgba\(195,\s*25,\s*50,/g, 'rgba(14, 95, 242,');
  content = content.replace(/rgba\(195,25,50,/g, 'rgba(14,95,242,');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('styles.css color replacement successful.');
}

// 2. Modify app.jsx (Branding & Logo)
function updateApp() {
  const filePath = path.join(projectRoot, 'app.jsx');
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace Brand Name "Yangi Kun" -> "Ishonch.uz"
  content = content.replace(/Yangi Kun/g, 'Ishonch.uz');
  content = content.replace(/yangikun\.uz/g, 'ishonch.uz');
  content = content.replace(/yangikun/g, 'ishonch_uz'); // telegram/instagram usernames

  // Replace brand-mark (YK) with the actual logo image
  // Public navbar brand mark
  const publicBrandTarget = `<span className="brand-mark">YK</span>\n            <span>\n              <span className="brand-name">Ishonch.uz</span>`;
  const publicBrandReplacement = `<img src="/uploads/logo.png" alt="Ishonch.uz Logo" style={{ height: "42px", borderRadius: "8px", objectFit: "contain", marginRight: "6px" }} />\n            <span>\n              <span className="brand-name">Ishonch.uz</span>`;
  
  if (content.includes(publicBrandTarget)) {
    content = content.replace(publicBrandTarget, publicBrandReplacement);
  } else {
    // Fallback: direct replace of span
    content = content.replace(/<span className="brand-mark">YK<\/span>/, `<img src="/uploads/logo.png" alt="Ishonch.uz Logo" style={{ height: "42px", borderRadius: "8px", objectFit: "contain" }} />`);
  }

  // Admin login brand logo (line 2615)
  content = content.replace(
    `<div className="admin-login-logo">\n            <span className="brand-mark">YK</span>`,
    `<div className="admin-login-logo">\n            <img src="/uploads/logo.png" alt="Ishonch.uz Logo" style={{ height: "42px", borderRadius: "8px", objectFit: "contain" }} />`
  );

  // Admin sidebar logo (line 2649)
  content = content.replace(
    `<div className="adm-sidebar-logo">\n          <span className="brand-mark">YK</span>`,
    `<div className="adm-sidebar-logo">\n          <img src="/uploads/logo.png" alt="Ishonch.uz Logo" style={{ height: "36px", borderRadius: "6px", objectFit: "contain" }} />`
  );

  // Footer logo (line 3797)
  content = content.replace(
    `<span className="brand-mark">YK</span>\n            <strong style={{ fontSize: "22px", color: "#fff" }}>Ishonch.uz</strong>`,
    `<img src="/uploads/logo.png" alt="Ishonch.uz Logo" style={{ height: "42px", borderRadius: "8px", objectFit: "contain" }} />\n            <strong style={{ fontSize: "22px", color: "#fff" }}>Ishonch.uz</strong>`
  );

  // Replace default site config defaults
  content = content.replace(/logoUrl: "",/g, 'logoUrl: "/uploads/logo.png",');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('app.jsx brand and logo replacement successful.');
}

// 3. Modify data/db.json and stories.json
function updateDatabases() {
  const files = [
    path.join(projectRoot, 'data/db.json'),
    path.join(projectRoot, 'stories.json')
  ];

  files.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(/Yangi Kun/g, 'Ishonch.uz');
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Database updated successfully: ${filePath}`);
    }
  });
}

updateStyles();
updateApp();
updateDatabases();
console.log('Brand transformation complete.');
