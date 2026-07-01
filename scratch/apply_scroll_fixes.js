const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add isEntering state
const targetState = '  const [commentSent, setCommentSent] = useState(false);';
const replacementState = '  const [commentSent, setCommentSent] = useState(false);\r\n  const [isEntering, setIsEntering] = useState(true);';

if (content.includes(targetState)) {
  content = content.replace(targetState, replacementState);
  console.log("Success: Added isEntering state");
} else {
  // Try with LF only
  const targetStateLF = '  const [commentSent, setCommentSent] = useState(false);\n';
  const replacementStateLF = '  const [commentSent, setCommentSent] = useState(false);\n  const [isEntering, setIsEntering] = useState(true);\n';
  if (content.includes(targetStateLF)) {
    content = content.replace(targetStateLF, replacementStateLF);
    console.log("Success: Added isEntering state (LF)");
  } else {
    console.error("Error: Could not find targetState");
  }
}

// 2. Replace touch navigation logic
const targetTouch = `  // Swipe navigation
  const storyIndex = stories.findIndex(s => s.id === story.id);
  const prevStory = storyIndex > 0 ? stories[storyIndex - 1] : null;
  const nextStory = storyIndex < stories.length - 1 ? stories[storyIndex + 1] : null;
  const touchRef = useRef(null);
  useEffect(() => {
    function onTouchStart(e) { touchRef.current = e.touches[0].clientX; }
    function onTouchEnd(e) {
      if (touchRef.current === null) return;
      const diff = touchRef.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 60) {
        if (diff > 0 && nextStory) { onOpen(nextStory); window.scrollTo({top:0,behavior:"instant"}); }
        if (diff < 0 && prevStory) { onOpen(prevStory); window.scrollTo({top:0,behavior:"instant"}); }
      }
      touchRef.current = null;
    }
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => { document.removeEventListener("touchstart", onTouchStart); document.removeEventListener("touchend", onTouchEnd); };
  }, [nextStory, prevStory]);`;

const replacementTouch = `  // Swipe navigation (ignoring vertical scrolling)
  const storyIndex = stories.findIndex(s => s.id === story.id);
  const prevStory = storyIndex > 0 ? stories[storyIndex - 1] : null;
  const nextStory = storyIndex < stories.length - 1 ? stories[storyIndex + 1] : null;
  const touchStartRef = useRef(null);
  useEffect(() => {
    function onTouchStart(e) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    }
    function onTouchEnd(e) {
      if (!touchStartRef.current) return;
      const diffX = touchStartRef.current.x - e.changedTouches[0].clientX;
      const diffY = touchStartRef.current.y - e.changedTouches[0].clientY;
      if (Math.abs(diffX) > 80 && Math.abs(diffX) > Math.abs(diffY) * 1.8) {
        if (diffX > 0 && nextStory) { onOpen(nextStory); window.scrollTo({top:0,behavior:"auto"}); }
        if (diffX < 0 && prevStory) { onOpen(prevStory); window.scrollTo({top:0,behavior:"auto"}); }
      }
      touchStartRef.current = null;
    }
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [nextStory, prevStory]);`;

// Helper to normalize line endings for replacement match
function replaceNormalize(source, target, replacement) {
  const normSource = source.replace(/\r\n/g, '\n');
  const normTarget = target.replace(/\r\n/g, '\n');
  const normReplacement = replacement.replace(/\r\n/g, '\n');
  
  if (normSource.includes(normTarget)) {
    const isCRLF = source.includes('\r\n');
    let finalReplacement = normReplacement;
    if (isCRLF) {
      finalReplacement = finalReplacement.replace(/\n/g, '\r\n');
    }
    
    // We do the replace on normalized LF and then convert back if needed, or find index in normSource
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

const touchResult = replaceNormalize(content, targetTouch, replacementTouch);
if (touchResult) {
  content = touchResult;
  console.log("Success: Replaced touch navigation logic");
} else {
  console.error("Error: Could not replace touch navigation logic");
}

// 3. Replace onScroll clamped logic
const targetScroll = `  useEffect(() => {
    function onScroll() {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setReadProgress(total > 0 ? Math.min(100, Math.round((scrolled / total) * 100)) : 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);`;

const replacementScroll = `  useEffect(() => {
    function onScroll() {
      const el = document.documentElement;
      const scrolled = el.scrollTop || (document.body ? document.body.scrollTop : 0);
      const total = el.scrollHeight - el.clientHeight;
      const pct = total > 0 ? Math.round((scrolled / total) * 100) : 0;
      setReadProgress(Math.max(0, Math.min(100, pct)));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);`;

const scrollResult = replaceNormalize(content, targetScroll, replacementScroll);
if (scrollResult) {
  content = scrollResult;
  console.log("Success: Replaced scroll progress logic");
} else {
  console.error("Error: Could not replace scroll progress logic");
}

// 4. Modify article-page wrapper div
const targetWrapper = '  return (\r\n    <div className="article-page">';
const replacementWrapper = '  return (\r\n    <div className={`article-page ${isEntering ? "entering" : ""}`} onAnimationEnd={() => setIsEntering(false)}>';

if (content.includes(targetWrapper)) {
  content = content.replace(targetWrapper, replacementWrapper);
  console.log("Success: Modified article-page wrapper div (CRLF)");
} else {
  const targetWrapperLF = '  return (\n    <div className="article-page">';
  const replacementWrapperLF = '  return (\n    <div className={`article-page ${isEntering ? "entering" : ""}`} onAnimationEnd={() => setIsEntering(false)}>';
  if (content.includes(targetWrapperLF)) {
    content = content.replace(targetWrapperLF, replacementWrapperLF);
    console.log("Success: Modified article-page wrapper div (LF)");
  } else {
    console.error("Error: Could not find article-page wrapper div");
  }
}

// 5. Make comment-avatar safe
const targetCommentAvatar = '<div className="comment-avatar">{c.name[0].toUpperCase()}</div>';
const replacementCommentAvatar = '<div className="comment-avatar">{(c.name || "?")[0].toUpperCase()}</div>';

if (content.includes(targetCommentAvatar)) {
  content = content.replace(targetCommentAvatar, replacementCommentAvatar);
  console.log("Success: Made comment-avatar initial safe");
} else {
  console.error("Error: Could not find targetCommentAvatar");
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("File app.jsx written successfully.");
