const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings for comparison
const originalContent = content.replace(/\r\n/g, '\n');

const target1 = `        <div className="author-page-header">
          <div className="author-page-avatar">{initials}</div>
          <div>
            <h1 className="author-page-name">{author}</h1>
  );
}`;

const replacement1 = `        <div className="author-page-header">
          <div className="author-page-avatar">{initials}</div>
          <div>
            <h1 className="author-page-name">{author}</h1>
            <p className="author-page-count">{authorStories.length} {isUz ? "ta maqola" : "материалов"}</p>
          </div>
        </div>
        <div className="stories-grid" style={{marginTop:32}}>
          {authorStories.length === 0 ? (
            <p style={{color:"var(--muted)"}}>{isUz ? "Maqolalar topilmadi" : "Материалы не найдены"}</p>
          ) : authorStories.map(story => (
            <StoryCard key={story.id} story={story} savedIds={savedIds} onToggleSave={onToggleSave}
              onOpen={() => onOpen(story)} />
          ))}
        </div>
      </div>
    </main>
  );
}`;

const target2 = `          <div className="article-page-content">
            <div className="article-author-row">
                  ))}
                </ol>
              </nav>
            )}`;

const replacement2 = `          <div className="article-page-content">
            <div className="article-author-row">
              <button className="article-avatar author-btn" onClick={() => onAuthorClick && onAuthorClick(story.author || "Ishonch.uz tahririyati")}>{initials}</button>
              <div>
                <button className="author-name-btn" onClick={() => onAuthorClick && onAuthorClick(story.author || "Ishonch.uz tahririyati")}>{story.author || "Ishonch.uz tahririyati"}</button>
                <span style={{display:"flex",gap:10,alignItems:"center",fontSize:13,color:"var(--muted)"}}>
                  {story.read}
                  {readTime && <span style={{display:"flex",alignItems:"center",gap:4}}>⏱ {readTime}</span>}
                </span>
              </div>
            </div>

            {tags.length > 0 && (
              <div className="article-tags">
                {tags.map(tag => <button key={tag} className="article-tag tag-btn" onClick={() => onTagClick && onTagClick(tag)}>#{tag}</button>)}
              </div>
            )}

            {headings.length > 1 && (
              <nav className="toc-box">
                <strong className="toc-title">{isUz ? "📋 Mundarija" : "📋 Содержание"}</strong>
                <ol className="toc-list">
                  {headings.map((h, i) => (
                    <li key={i}><a href={\`#heading-\${i}\`} className="toc-link">{h}</a></li>
                  ))}
                </ol>
              </nav>
            )}`;

let fixedContent = originalContent;

if (fixedContent.includes(target1)) {
  fixedContent = fixedContent.replace(target1, replacement1);
  console.log("Success: Restored AuthorPage component structure");
} else {
  console.error("Error: Could not find target1 (AuthorPage corruption)");
}

if (fixedContent.includes(target2)) {
  fixedContent = fixedContent.replace(target2, replacement2);
  console.log("Success: Restored ArticlePage component structure");
} else {
  console.error("Error: Could not find target2 (ArticlePage corruption)");
}

// Write back with original line endings format
if (content.includes('\r\n')) {
  fixedContent = fixedContent.replace(/\n/g, '\r\n');
}

fs.writeFileSync(filePath, fixedContent, 'utf8');
console.log("Repair completed.");
