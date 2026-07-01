const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize everything to LF to prevent line ending issues
content = content.replace(/\r\n/g, '\n');

// 1. Fix the broken editor toolbar group
const brokenToolbar = `          {/* Qo'shish */}
              onChange={e => { uploadAndInsert(e.target.files?.[0]); e.target.value=""; }}
            />
          </div>`;

const correctToolbar = `          {/* Qo'shish */}
          <div className="rich-toolbar-group">
            <button type="button" title="Havola qo'shish" className="rich-tool-btn" onMouseDown={e=>{e.preventDefault();insertLink();}}>🔗</button>
            <button
              type="button"
              title="Rasm yuklash (kompyuterdan)"
              className="rich-tool-btn rich-tool-img \${uploading ? 'uploading' : ''}"
              onMouseDown={e=>{ e.preventDefault(); fileInputRef.current?.click(); }}
            >\${uploading ? '⏳' : '🖼'}</button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{display:"none"}}
              onChange={e => { uploadAndInsert(e.target.files?.[0]); e.target.value=""; }}
            />
          </div>`;

const normBrokenToolbar = brokenToolbar.replace(/\r\n/g, '\n').trim();

// Try finding it by trim or partial match
let index = content.indexOf(normBrokenToolbar);
if (index === -1) {
  // Try matching just the lines
  const targetPattern = `onChange={e => { uploadAndInsert(e.target.files?.[0]); e.target.value=""; }}\n            />\n          </div>`;
  const replacementPattern = `<div className="rich-toolbar-group">
            <button type="button" title="Havola qo'shish" className="rich-tool-btn" onMouseDown={e=>{e.preventDefault();insertLink();}}>🔗</button>
            <button
              type="button"
              title="Rasm yuklash (kompyuterdan)"
              className={\`rich-tool-btn rich-tool-img \${uploading ? "uploading" : ""}\`}
              onMouseDown={e=>{ e.preventDefault(); fileInputRef.current?.click(); }}
            >{uploading ? "⏳" : "🖼"}</button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{display:"none"}}
              onChange={e => { uploadAndInsert(e.target.files?.[0]); e.target.value=""; }}
            />
          </div>`;
  if (content.includes(targetPattern)) {
    content = content.replace(targetPattern, replacementPattern);
    console.log("✓ Fixed editor toolbar group via targetPattern");
  } else {
    console.log("⚠️ Editor toolbar pattern not found");
  }
} else {
  content = content.replace(normBrokenToolbar, correctToolbar);
  console.log("✓ Fixed editor toolbar group via normBrokenToolbar");
}

// Write back as CRLF (Windows standard)
fs.writeFileSync(filePath, content.replace(/\n/g, '\r\n'), 'utf8');
console.log("App.jsx fixed successfully.");
