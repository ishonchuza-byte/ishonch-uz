const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const targetRouting = `  // URL pathname routing: /news/ID or /news/slug or /admin
  useEffect(() => {
    function onPopState() {
      const pathname = window.location.pathname;
      if (pathname.startsWith('/news/')) {
        const storyPath = pathname.replace('/news/', '');
        const story = stories.find(s => s.slug === storyPath || s.id === storyPath);
        if (story) {
          setActiveStory(story);
          window.scrollTo({ top: 0, behavior: "auto" });
        }
      } else if (pathname === '/admin' || window.location.hash === '#admin') {
        setPage("admin");
        setActiveStory(null);
        setActiveAuthor(null);
        setActiveTag(null);
      } else if (pathname === '/' || pathname === '') {
        setActiveStory(null);
      }
    }
    window.addEventListener('popstate', onPopState);
    onPopState(); // initial check
    return () => window.removeEventListener('popstate', onPopState);
  }, [stories]);`;

const replacementRouting = `  // URL pathname routing: /news/ID or /news/slug or /admin (with multi-language lookup)
  useEffect(() => {
    function onPopState() {
      const pathname = window.location.pathname;
      if (pathname.startsWith('/news/')) {
        const storyPath = pathname.replace('/news/', '');
        let foundStory = null;
        let foundLang = null;
        
        for (const l of ['uz', 'ru', 'uzk']) {
          const list = allStories[l] || [];
          const match = list.find(s => s.slug === storyPath || s.id === storyPath);
          if (match) {
            foundStory = match;
            foundLang = l;
            break;
          }
        }
        
        if (foundStory) {
          if (foundLang && foundLang !== lang) {
            setLang(foundLang);
            localStorage.setItem("yk-lang", foundLang);
          }
          setActiveStory(foundStory);
          window.scrollTo({ top: 0, behavior: "auto" });
        }
      } else if (pathname === '/admin' || window.location.hash === '#admin') {
        setPage("admin");
        setActiveStory(null);
        setActiveAuthor(null);
        setActiveTag(null);
      } else if (pathname === '/' || pathname === '') {
        setActiveStory(null);
      }
    }
    window.addEventListener('popstate', onPopState);
    onPopState(); // initial check
    return () => window.removeEventListener('popstate', onPopState);
  }, [allStories, lang]);`;

// Helper to normalize line endings for replacement match
function replaceNormalize(source, target, replacement) {
  const normSource = source.replace(/\r\n/g, '\n');
  const normTarget = target.replace(/\r\n/g, '\n');
  const normReplacement = replacement.replace(/\r\n/g, '\n');
  
  if (normSource.includes(normTarget)) {
    const isCRLF = source.includes('\r\n');
    let finalReplacement = normReplacement;
    
    const index = normSource.indexOf(normTarget);
    const before = normSource.substring(0, index);
    const after = normSource.substring(index + normTarget.length);
    let result = before + normReplacement + after;
    if (isCRLF) {
      result = result.replace(/\n/g, '\r\n');
    }
    return result;
  }
  return null;
}

const result = replaceNormalize(content, targetRouting, replacementRouting);
if (result) {
  content = result;
  console.log("Success: Replaced routing logic with multi-language lookup");
} else {
  console.error("Error: Could not find target routing logic");
}

// 2. Make comments and reactions state safe from corrupted values
const targetCommentsInit = 'const [comments, setComments] = useState(() => JSON.parse(localStorage.getItem("yk-comments-" + story.id) || "[]"));';
const replacementCommentsInit = `const [comments, setComments] = useState(() => {
    try {
      const saved = localStorage.getItem("yk-comments-" + story.id);
      return saved ? JSON.parse(saved) || [] : [];
    } catch (e) {
      return [];
    }
  });`;

if (content.includes(targetCommentsInit)) {
  content = content.replace(targetCommentsInit, replacementCommentsInit);
  console.log("Success: Secured comments state initialization");
} else {
  console.error("Error: Could not find targetCommentsInit");
}

const targetReactionsInit = 'const [reactions, setReactions] = useState(() => JSON.parse(localStorage.getItem("yk-reactions") || "{}"));';
const replacementReactionsInit = `const [reactions, setReactions] = useState(() => {
    try {
      const saved = localStorage.getItem("yk-reactions");
      return saved ? JSON.parse(saved) || {} : {};
    } catch (e) {
      return {};
    }
  });`;

if (content.includes(targetReactionsInit)) {
  content = content.replace(targetReactionsInit, replacementReactionsInit);
  console.log("Success: Secured reactions state initialization");
} else {
  console.error("Error: Could not find targetReactionsInit");
}

// Safe check for reactions lookup
const targetReactionBtn = 'const storyReactions = reactions[story.id] || {};';
const replacementReactionBtn = 'const storyReactions = (reactions || {})[story.id] || {};';

if (content.includes(targetReactionBtn)) {
  content = content.replace(targetReactionBtn, replacementReactionBtn);
  console.log("Success: Secured reactions lookup");
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("File app.jsx written successfully.");
