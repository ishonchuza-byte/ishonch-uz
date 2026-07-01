const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings to LF
content = content.replace(/\r\n/g, '\n');

const targetStr = `                              <span>🌐 IP: <strong style={{color: "var(--ink)"}}>\${session.ip}</strong> - \${session.device}</span>
                              <span>\${new Date(session.timestamp).toLocaleString('uz-UZ')}</span>`;

const replacementStr = `                              <span>🌐 IP: <strong style={{color: "var(--ink)"}}>{session.ip}</strong> - {session.device}</span>
                              <span>{new Date(session.timestamp).toLocaleString('uz-UZ')}</span>`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacementStr);
  console.log("✓ Fixed literal dollar signs in app.jsx");
} else {
  console.log("⚠️ Target string not found. Trying trimmed version...");
  const normTarget = targetStr.trim();
  const normReplacement = replacementStr.trim();
  // Find and replace by split/join or custom match
  if (content.includes(normTarget)) {
    content = content.replace(normTarget, normReplacement);
    console.log("✓ Fixed literal dollar signs (trimmed)");
  } else {
    // Try matching lines individually
    content = content.replace(/\$\{session\.ip\}/g, '{session.ip}');
    content = content.replace(/\$\{session\.device\}/g, '{session.device}');
    content = content.replace(/\$\{new Date\(session\.timestamp\)\.toLocaleString\('uz-UZ'\)\}/g, "{new Date(session.timestamp).toLocaleString('uz-UZ')}");
    console.log("✓ Performed regex fallback replacements for dollar signs");
  }
}

// Save back with CRLF line endings
fs.writeFileSync(filePath, content.replace(/\n/g, '\r\n'), 'utf8');
console.log("App.jsx fixed successfully.");
