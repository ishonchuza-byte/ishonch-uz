const fs = require('fs');

const appPath = 'app.jsx';
let content = fs.readFileSync(appPath, 'utf8');

// --- 1. Swap Sidebar ---
const sidebarStart = 'function Sidebar({ t, stories, onOpen }) {';
const sidebarEnd = 'function useCountUp(target, duration = 1500) {';
const sidebarIdx = content.indexOf(sidebarStart);
const sidebarEndIdx = content.indexOf(sidebarEnd);

if (sidebarIdx === -1 || sidebarEndIdx === -1) {
  console.error('Sidebar tokens not found!');
  process.exit(1);
}

const newSidebar = `function Sidebar({ t, stories, onOpen }) {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);
  const [donorName, setDonorName] = React.useState("");
  const [donorAmount, setDonorAmount] = React.useState("");
  const [donationSuccess, setDonationSuccess] = React.useState(false);

  async function handleSubscribe(e) {
    e.preventDefault();
    if (!email.includes("@")) return;
    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        setSubscribed(true);
        setEmail("");
        setTimeout(() => setSubscribed(false), 4000);
      }
    } catch(err) {
      console.error(err);
    }
  }

  async function handleDonate(e) {
    e.preventDefault();
    const amount = Number(donorAmount);
    if (amount <= 0) return;
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: donorName.trim() || "Anonim",
          amount: amount,
          currency: "UZS",
          description: t.close === "Yopish" ? "Saytni qo'llab-quvvatlash" : "Поддержка сайта",
          status: "success"
        })
      });
      if (res.ok) {
        setDonationSuccess(true);
        setDonorName("");
        setDonorAmount("");
        setTimeout(() => setDonationSuccess(false), 5000);
      }
    } catch(err) {
      console.error(err);
    }
  }

  return (
    <aside className="sidebar">
      <div className="panel">
        <h3>{t.popular}</h3>
        {stories.slice(0, 5).map((story, index) => (
          <button className="trend" key={story.id} onClick={() => onOpen && onOpen(story)} style={{ display: "grid", gridTemplateColumns: "28px 1fr", gap: "12px", width: "100%", border: 0, background: "transparent", textAlign: "left", cursor: "pointer", padding: "12px 0", borderTop: index === 0 ? 0 : "1px solid var(--line)" }}>
            <span className="trend-num">{index + 1}</span>
            <span>
              <strong style={{ display: "block", lineHeight: "1.28", color: "var(--ink)" }}>{story.title}</strong>
              <small style={{ color: "var(--muted)" }}>{story.category}</small>
            </span>
          </button>
        ))}
      </div>
      
      <div className="panel newsletter">
        <h3>{t.newsletterTitle}</h3>
        <p>{t.newsletterText}</p>
        {subscribed ? (
          <p style={{ color: "#4ade80", fontWeight: 700, margin: "8px 0 0" }}>✓ Muvaffaqiyatli obuna bo'ldingiz!</p>
        ) : (
          <form onSubmit={handleSubscribe}>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder={t.email} type="email" />
            <button className="primary" type="submit" style={{ width: "100%", marginTop: "2px" }}>{t.subscribe}</button>
          </form>
        )}
      </div>

      <div className="panel donation-panel" style={{
        background: "linear-gradient(135deg, rgba(14, 95, 242, 0.05) 0%, rgba(195, 25, 50, 0.05) 100%)",
        border: "1px solid var(--line)",
        padding: "16px",
        borderRadius: "8px"
      }}>
        <h3 style={{marginTop: 0, marginBottom: "8px", fontSize: "16px", color: "var(--ink)"}}>
          {t.close === "Yopish" ? "Loyiha xayriyasi" : "Поддержка проекта"}
        </h3>
        <p style={{fontSize: "12.5px", color: "var(--muted)", margin: "0 0 12px 0", lineHeight: "1.4"}}>
          {t.close === "Yopish" 
            ? "Mustaqil jurnalistikamiz rivojiga o'z hissangizni qo'shing." 
            : "Внесите свой вклад в развитие независимой журналистики."}
        </p>
        {donationSuccess ? (
          <div style={{color: "#16a34a", fontWeight: "600", fontSize: "13px", padding: "10px", background: "rgba(22, 163, 74, 0.1)", borderRadius: "4px"}}>
            {t.close === "Yopish" ? "✓ Katta rahmat! To'lov qabul qilindi." : "✓ Спасибо! Платеж принят."}
          </div>
        ) : (
          <form onSubmit={handleDonate} style={{display: "flex", flexDirection: "column", gap: "8px"}}>
            <input type="text" placeholder={t.close === "Yopish" ? "Ismingiz" : "Ваше имя"} value={donorName} onChange={e => setDonorName(e.target.value)} style={{fontSize: "13px", padding:"6px"}} />
            <input type="number" placeholder={t.close === "Yopish" ? "Miqdor (UZS)" : "Сумма (UZS)"} value={donorAmount} onChange={e => setDonorAmount(e.target.value)} required style={{fontSize: "13px", padding:"6px"}} />
            <button className="primary" type="submit" style={{width: "100%", background: "var(--brand)", border:"none", borderRadius:"4px", color:"white", padding:"8px", cursor:"pointer", fontWeight:"bold"}}>
              💳 {t.close === "Yopish" ? "Simulyator to'lov" : "Оплатить (Симуляция)"}
            </button>
          </form>
        )}
      </div>

      <div className="panel ai-recommend-panel">
        <div className="ai-panel-head">
          <span className="ai-badge">AI</span>
          <h3>{t.close === "Yopish" ? "Siz uchun tavsiyalar" : "Рекомендации для вас"}</h3>
        </div>
        <p className="ai-panel-sub">{t.close === "Yopish" ? "O'qish tarixingiz asosida" : "На основе истории чтения"}</p>
        {(() => {
          const historyIds = JSON.parse(localStorage.getItem("yk-history") || "[]").map(h => h.id);
          const readCats = JSON.parse(localStorage.getItem("yk-history") || "[]").map(h => h.category);
          const topCat = readCats.length ? readCats.sort((a,b) => readCats.filter(c=>c===b).length - readCats.filter(c=>c===a).length)[0] : null;
          const recommended = topCat
            ? stories.filter(s => s.category === topCat && !historyIds.includes(s.id)).slice(0, 4)
            : stories.filter(s => (s.views||0) > 0).sort((a,b)=>(b.views||0)-(a.views||0)).slice(0,4);
          const fallback = stories.slice(0,4);
          const list = recommended.length ? recommended : fallback;
          return list.map((s, i) => (
            <button key={s.id} className="ai-rec-item" onClick={() => onOpen && onOpen(s)}
              style={{borderTop: i === 0 ? 0 : "1px solid var(--line)"}}>
              <img src={s.image} alt="" loading="lazy" />
              <div>
                <span className="ai-rec-cat">{s.category}</span>
                <p>{s.title}</p>
              </div>
            </button>
          ));
        })()}
      </div>
    </aside>
  );
}

`;

content = content.substring(0, sidebarIdx) + newSidebar + '\n\n' + content.substring(sidebarEndIdx);

// --- 2. Swap ContactPage and Add JournalPage ---
const contactStart = 'function ContactPage({ t, page }) {';
const contactEnd = 'function SkeletonCard() {';
const contactIdx = content.indexOf(contactStart);
const contactEndIdx = content.indexOf(contactEnd);

if (contactIdx === -1 || contactEndIdx === -1) {
  console.error('ContactPage tokens not found!');
  process.exit(1);
}

const newPagesComponents = `function JournalPage({ t, lang }) {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(false);
  const isUz = t.close === "Yopish";

  useEffect(() => {
    setLoading(true);
    fetch("/api/public/journals")
      .then(res => res.json())
      .then(data => setJournals(data.journals || []))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="section">
      <div className="section-inner">
        <div className="section-head">
          <div>
            <h2 className="section-title">
              {isUz ? "Gazeta va Jurnallar" : "Газеты и журналы"}
            </h2>
            <p className="section-note">
              {isUz ? "Ishonch.uz nashr etgan jurnallar va gazetalarning PDF sonlarini yuklab oling." : "Скачайте PDF-выпуски журналов и газет, опубликованных Ishonch.uz."}
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{textAlign:"center", padding:"40px", color:"var(--muted)"}}>Yuklanmoqda...</div>
        ) : (
          <div className="journals-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "24px",
            marginTop: "24px"
          }}>
            {journals.map(j => (
              <div key={j.id} style={{
                background: "var(--surface)",
                border: "1px solid var(--line)",
                borderRadius: "8px",
                padding: "16px",
                textAlign: "center",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}>
                <div style={{
                  width: "140px",
                  height: "200px",
                  background: "var(--bg)",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  marginBottom: "12px",
                  border: "1px solid var(--line)"
                }}>
                  {j.coverUrl ? (
                    <img src={j.coverUrl} alt="" style={{width:"100%", height:"100%", objectFit:"cover"}} />
                  ) : (
                    <span style={{fontSize: "64px"}}>📰</span>
                  )}
                </div>
                <h3 style={{fontSize: "14px", margin: "0 0 6px 0", color: "var(--ink)", fontWeight: "700"}}>{j.title}</h3>
                <small style={{display:"block", color:"var(--muted)", marginBottom:"12px"}}>{j.publishDate}</small>
                <a href={j.pdfUrl} download target="_blank" style={{
                  display: "inline-block",
                  padding: "8px 12px",
                  background: "var(--brand)",
                  color: "white",
                  borderRadius: "4px",
                  fontWeight: "700",
                  textDecoration: "none",
                  fontSize: "12.5px",
                  width: "100%",
                  marginTop: "auto"
                }}>
                  ⬇ {isUz ? "PDF yuklab olish" : "Скачать PDF"}
                </a>
              </div>
            ))}
            {journals.length === 0 && (
              <div style={{gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "var(--muted)"}}>
                {isUz ? "Hozircha yuklangan jurnallar mavjud emas." : "Журналы пока не загружены."}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function ContactPage({ t, page }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loadingForm, setLoadingForm] = useState(false);

  const isUz = t.close === "Yopish";

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !message) {
      setError(isUz ? "Ism va xabar kiritilishi shart" : "Имя и сообщение обязательны");
      return;
    }
    setLoadingForm(true);
    setError("");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message })
      });
      if (res.ok) {
        setSent(true);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        const d = await res.json();
        setError(d.error || "Xatolik");
      }
    } catch(err) {
      setError("Aloqa xatosi");
    } finally {
      setLoadingForm(false);
    }
  }

  return (
    <main className="section">
      <div className="section-inner">
        <div className="section-head">
          <div>
            <h2 className="section-title">{page}</h2>
            <p className="section-note">{t.pageNotes[page]}</p>
          </div>
        </div>
        
        <div className="contact-grid" style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginTop: "20px"}}>
          <div style={{display:"flex", flexDirection:"column", gap:"15px"}}>
            {t.contact.map(([title, text]) => (
              <div className="contact-card" key={title} style={{padding: "16px", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "8px"}}>
                <strong>{title}</strong>
                <p style={{margin: "8px 0 0 0", color: "var(--muted)", fontSize: "14px"}}>{text}</p>
              </div>
            ))}
          </div>

          <div className="contact-form-wrap" style={{padding: "24px", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "8px"}}>
            <h3 style={{marginBottom: "16px", color: "var(--ink)", marginTop: 0}}>
              {isUz ? "Tahririyatga xabar yuborish" : "Отправить сообщение"}
            </h3>
            {sent ? (
              <div style={{color: "#16a34a", fontWeight: "600", padding: "16px", background: "rgba(22, 163, 74, 0.1)", borderRadius: "6px"}}>
                {isUz ? "✓ Xabaringiz yuborildi! Tez orada ko'rib chiqamiz." : "✓ Сообщение отправлено! Мы скоро ответим."}
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: "12px"}}>
                {error && <div style={{color: "var(--brand)", fontSize: "13px"}}>⚠️ {error}</div>}
                <div style={{display: "flex", flexDirection: "column", gap: "4px"}}>
                  <span style={{fontSize: "13px", fontWeight: "500", color: "var(--ink)"}}>{isUz ? "Ismingiz *" : "Имя *"}</span>
                  <input value={name} onChange={e => setName(e.target.value)} required style={{padding:"8px", borderRadius:"4px", border:"1px solid var(--line)", background:"var(--bg)", color:"var(--ink)"}} />
                </div>
                <div style={{display: "flex", flexDirection: "column", gap: "4px"}}>
                  <span style={{fontSize: "13px", fontWeight: "500", color: "var(--ink)"}}>{isUz ? "Email manzilingiz" : "Email"}</span>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{padding:"8px", borderRadius:"4px", border:"1px solid var(--line)", background:"var(--bg)", color:"var(--ink)"}} />
                </div>
                <div style={{display: "flex", flexDirection: "column", gap: "4px"}}>
                  <span style={{fontSize: "13px", fontWeight: "500", color: "var(--ink)"}}>{isUz ? "Mavzu" : "Тема"}</span>
                  <input value={subject} onChange={e => setSubject(e.target.value)} style={{padding:"8px", borderRadius:"4px", border:"1px solid var(--line)", background:"var(--bg)", color:"var(--ink)"}} />
                </div>
                <div style={{display: "flex", flexDirection: "column", gap: "4px"}}>
                  <span style={{fontSize: "13px", fontWeight: "500", color: "var(--ink)"}}>{isUz ? "Xabar matni *" : "Текст сообщения *"}</span>
                  <textarea rows="4" value={message} onChange={e => setMessage(e.target.value)} required style={{padding:"8px", borderRadius:"4px", border:"1px solid var(--line)", background:"var(--bg)", color:"var(--ink)"}} />
                </div>
                <button type="submit" disabled={loadingForm} style={{
                  padding: "10px 16px",
                  background: "var(--brand)",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontWeight: "700",
                  cursor: "pointer",
                  marginTop: "8px"
                }}>
                  {loadingForm ? "..." : (isUz ? "Yuborish" : "Отправить")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

`;

content = content.substring(0, contactIdx) + newPagesComponents + '\n\n' + content.substring(contactEndIdx);

// --- 3. Swap comments state inside ArticlePage ---
const commentStateStart = 'const [comments, setComments] = useState(() => {';
const commentStateEnd = 'const [commentName, setCommentName] = useState("");';
const commentStateIdx = content.indexOf(commentStateStart);
const commentStateEndIdx = content.indexOf(commentStateEnd);

if (commentStateIdx === -1 || commentStateEndIdx === -1) {
  console.error('Comments state tokens not found!');
  process.exit(1);
}

const newCommentsState = `const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  async function loadApprovedComments() {
    setLoadingComments(true);
    try {
      const res = await fetch(\`/api/public/comments?storyId=\${story.id}\`);
      const data = await res.json();
      setComments(data.comments || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingComments(false);
    }
  }

  useEffect(() => {
    loadApprovedComments();
  }, [story.id]);`;

content = content.substring(0, commentStateIdx) + newCommentsState + '\n  ' + content.substring(commentStateEndIdx);

// --- 4. Swap submitComment function inside ArticlePage ---
const submitStart = 'function submitComment(e) {';
const submitEnd = 'return (\n    <div className={`article-page';
// Windows CRLF match support:
const submitEndCRLF = 'return (\r\n    <div className={`article-page';

const submitIdx = content.indexOf(submitStart);
let submitEndIdx = content.indexOf(submitEnd);
if (submitEndIdx === -1) {
  submitEndIdx = content.indexOf(submitEndCRLF);
}

if (submitIdx === -1 || submitEndIdx === -1) {
  console.error('submitComment tokens not found!');
  process.exit(1);
}

const newSubmitComment = `async function submitComment(e) {
    e.preventDefault();
    if (!commentText.trim()) return;
    const payload = {
      storyId: story.id,
      name: commentName.trim() || (isUz ? "Mehmon" : "Гость"),
      text: commentText.trim()
    };
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setCommentText("");
        setCommentName("");
        setCommentSent(true);
        setTimeout(() => setCommentSent(false), 3000);
        alert(isUz ? "✓ Izohingiz yuborildi. Moderator tasdiqlaganidan so'ng saytda ko'rinadi." : "✓ Ваш комментарий отправлен. Он появится после модерации.");
      }
    } catch (err) {
      alert("Xatolik yuz berdi");
    }
  }`;

content = content.substring(0, submitIdx) + newSubmitComment + '\n\n  ' + content.substring(submitEndIdx);

// --- 5. Update pages array inside App() ---
const pagesStart = 'const pages = useMemo(() => {';
const pagesEnd = '}, [lang, siteConfig]);';
const pagesIdx = content.indexOf(pagesStart);
const pagesEndIdx = content.indexOf(pagesEnd, pagesIdx);

if (pagesIdx === -1 || pagesEndIdx === -1) {
  console.error('pages list tokens not found!');
  process.exit(1);
}

const newPagesDefinition = `const pages = useMemo(() => {
    if (lang === "uz") return ["Bosh sahifa", ...(siteConfig.categoriesUz || ["Siyosat", "Iqtisod", "Texnologiya", "Sport", "Madaniyat"]), "Jurnallar", "Aloqa"];
    if (lang === "uzk") return ["Бош саҳифа", ...(siteConfig.categoriesUzk || ["Сиёсат", "Иқтисод", "Технология", "Спорт", "Маданият"]), "Журналлар", "Алоқа"];
    return ["Главная", ...(siteConfig.categoriesRu || ["Политика", "Экономика", "Технологии", "Спорт", "Культура"]), "Журналы", "Контакты"];
  }, [lang, siteConfig]);`;

content = content.substring(0, pagesIdx) + newPagesDefinition + content.substring(pagesEndIdx + pagesEnd.length);

// --- 6. Update App switching block ---
const switchStart = 'page === pages[pages.length - 1] ? (';
const switchEnd = ': (';
const switchIdx = content.indexOf(switchStart);
const switchEndIdx = content.indexOf(switchEnd, switchIdx);

if (switchIdx === -1 || switchEndIdx === -1) {
  console.error('switching block tokens not found!');
  process.exit(1);
}

const newSwitchPart = `page === pages[pages.length - 1] ? (
            <ContactPage t={t} page={page} />
          ) : (page === "Jurnallar" || page === "Журналлар" || page === "Журналы") ? (
            <JournalPage t={t} lang={lang} />
          ) : (`;

content = content.substring(0, switchIdx) + newSwitchPart + content.substring(switchEndIdx + switchEnd.length);

// --- 7. Add activeQuote states to App() ---
const menuOpenStart = 'const [menuOpen, setMenuOpen] = useState(false);';
const menuOpenIdx = content.indexOf(menuOpenStart);

if (menuOpenIdx === -1) {
  console.error('menuOpen state not found!');
  process.exit(1);
}

const newStates = `const [menuOpen, setMenuOpen] = useState(false);
  const [activeQuote, setActiveQuote] = useState(null);

  useEffect(() => {
    fetch("/api/public/quotes")
      .then(res => res.json())
      .then(data => {
        if (data.quotes && data.quotes.length) {
          setActiveQuote(data.quotes[0]);
        }
      })
      .catch(() => null);
  }, []);`;

content = content.substring(0, menuOpenIdx) + newStates + content.substring(menuOpenIdx + menuOpenStart.length);

// --- 8. Render activeQuote widget in home section ---
const layoutStart = '<div className="layout">\n                  <div>\n                    <AdBanner ads={ads} position="inline" />';
const layoutStartCRLF = '<div className="layout">\r\n                  <div>\r\n                    <AdBanner ads={ads} position="inline" />';

let layoutIdx = content.indexOf(layoutStart);
let lengthToSkip = layoutStart.length;

if (layoutIdx === -1) {
  layoutIdx = content.indexOf(layoutStartCRLF);
  lengthToSkip = layoutStartCRLF.length;
}

if (layoutIdx === -1) {
  console.error('layout starts not found!');
  process.exit(1);
}

const newQuoteRenderBlock = `<div className="layout">
                  <div>
                    <AdBanner ads={ads} position="inline" />
                    {page === pages[0] && activeQuote && (
                      <div className="quote-of-the-day-widget" style={{
                        background: "var(--surface)",
                        borderLeft: "4px solid var(--brand)",
                        padding: "16px 20px",
                        borderRadius: "8px",
                        marginBottom: "24px",
                        boxShadow: "var(--shadow-sm)"
                      }}>
                        <span style={{fontSize: "24px", color: "var(--brand)", display: "block", marginBottom: "4px", lineHeight: "1"}}>❝</span>
                        <p style={{fontStyle: "italic", fontSize: "15px", margin: "0 0 6px 0", color: "var(--ink)", lineHeight: "1.5"}}>
                          {lang === "uzk" ? convertText(activeQuote.text, true) : activeQuote.text}
                        </p>
                        <small style={{fontWeight: 700, color: "var(--muted)"}}>
                          — {lang === "uzk" ? convertText(activeQuote.author, true) : activeQuote.author}
                        </small>
                      </div>
                    )}`;

content = content.substring(0, layoutIdx) + newQuoteRenderBlock + content.substring(layoutIdx + lengthToSkip);

fs.writeFileSync(appPath, content, 'utf8');
console.log('Successfully completed public site integrations in app.jsx!');
