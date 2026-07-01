function App() {
  const [lang, setLang] = useState("uz");
  const [page, setPage] = useState(
    window.location.hash === "#admin" || window.location.pathname === "/admin" || window.location.pathname === "/admin/" ? "admin" : "Bosh sahifa"
  );
  const fallbackStories = useMemo(() => withIds(storyData), []);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [activeStory, setActiveStory] = useState(null);
  const [allStories, setAllStories] = useState(fallbackStories);
  const [serverMessage, setServerMessage] = useState("");
  const [siteConfig, setSiteConfig] = useState(DEFAULT_SITE_CONFIG);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("yk-dark") === "1");
  const [savedIds, setSavedIds] = useState(() => JSON.parse(localStorage.getItem("yk-saved") || "[]"));
  const [scrollVisible, setScrollVisible] = useState(false);
  const [pinnedHeroId, setPinnedHeroId] = useState(() => localStorage.getItem("yk-hero") || "");
  const [pinnedSideIds, setPinnedSideIds] = useState(() => JSON.parse(localStorage.getItem("yk-sides") || "[]"));
  const [copiedShare, setCopiedShare] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeAuthor, setActiveAuthor] = useState(null);
  const [activeTag, setActiveTag] = useState(null);
  const [reactions, setReactions] = useState(() => {
    try {
      const saved = localStorage.getItem("yk-reactions");
      return saved ? JSON.parse(saved) || {} : {};
    } catch (e) {
      return {};
    }
  });
  const [ads, setAds] = useState(() => JSON.parse(localStorage.getItem("yk-ads") || "[]"));
  const [menuOpen, setMenuOpen] = useState(false);

  const langLabels = {
    uz: "O'zbekcha",
    uzk: "Ўзбекча",
    ru: "Русский"
  };

  const cycleLang = () => {
    if (lang === "uz") changeLang("ru");
    else if (lang === "ru") changeLang("uzk");
    else changeLang("uz");
  };


  useEffect(() => {
    localStorage.setItem("yk-ads", JSON.stringify(ads));
  }, [ads]);

  useEffect(() => {
    localStorage.setItem("yk-reactions", JSON.stringify(reactions));
  }, [reactions]);

  function addReaction(storyId, emoji) {
    setReactions(prev => {
      const cur = prev[storyId] || {};
      const myPrev = cur._mine;
      if (myPrev === emoji) return prev;
      const updated = { ...cur };
      if (myPrev) updated[myPrev] = Math.max(0, (updated[myPrev] || 1) - 1);
      updated[emoji] = (updated[emoji] || 0) + 1;
      updated._mine = emoji;
      return { ...prev, [storyId]: updated };
    });
  }

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("yk-dark", darkMode ? "1" : "0");
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("yk-saved", JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    if (pinnedHeroId) localStorage.setItem("yk-hero", pinnedHeroId);
    else localStorage.removeItem("yk-hero");
  }, [pinnedHeroId]);

  useEffect(() => {
    localStorage.setItem("yk-sides", JSON.stringify(pinnedSideIds));
  }, [pinnedSideIds]);

  useEffect(() => {
    function onScroll() {
      setScrollVisible(window.scrollY > 400);
      // Glassmorphism header scrolled class
      const header = document.querySelector(".header");
      if (header) header.classList.toggle("scrolled", window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll fade-in animation (IntersectionObserver)
  useEffect(() => {
    const els = document.querySelectorAll(".fade-in-up");
    if (!els.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch("/api/config");
        const data = await res.json();
        if (data.config) {
          setSiteConfig(data.config);
          if (data.config.brandColor) {
            document.documentElement.style.setProperty("--brand", data.config.brandColor);
          }
          if (data.config.pinnedHeroId !== undefined) {
            setPinnedHeroId(data.config.pinnedHeroId);
          }
          if (data.config.pinnedSideIds !== undefined) {
            setPinnedSideIds(data.config.pinnedSideIds);
          }
          if (data.config.ads !== undefined) {
            setAds(data.config.ads);
          }
        }
      } catch (e) {}
    }
    loadConfig();
  }, []);

  // Keyboard shortcuts: / → search, ESC → close story
  useEffect(() => {
    function onKey(e) {
      if (e.key === "/" && !["INPUT","TEXTAREA"].includes(document.activeElement.tagName)) {
        e.preventDefault();
        document.querySelector(".search")?.focus();
      }
      if (e.key === "Escape" && activeStory) {
        closeStory();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeStory]);

  function toggleSave(id) {
    setSavedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function handleView(storyId) {
    setAllStories(prev => ({
      ...prev,
      uz: prev.uz.map(s => s.id === storyId ? { ...s, views: (s.views || 0) + 1 } : s),
      ru: prev.ru.map(s => s.id === storyId ? { ...s, views: (s.views || 0) + 1 } : s),
    }));
  }

  function openStory(story) {
    setActiveStory(story);
    const urlPath = story.slug ? `/news/${story.slug}` : `/news/${story.id}`;
    window.history.pushState({ storyId: story.id }, '', urlPath);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function closeStory() {
    setActiveStory(null);
    if (window.location.pathname.startsWith('/news/')) {
      window.history.pushState(null, '', '/');
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const t = copy[lang] || copy.uz;
  const dataLang = lang;
  const now = new Date().toISOString();
  const rawStories = (allStories[dataLang] || []).filter((story) => {
    if (story.status !== "published") return false;
    // Rejalashtirish sanasi o'tganmi yoki yo'qmi
    if (story.publishAt && story.publishAt > now) return false;
    return true;
  });

  // Krill tilda ko'rsatishda matnni avtomatik o'girish
  const stories = rawStories.map(story => {
    if (dataLang !== "uzk") return story;
    return {
      ...story,
      title: convertText(story.title, true),
      summary: convertText(story.summary, true),
      body: convertText(story.body, true),
      category: cyrCategoryLabels[story.category] || convertText(story.category, true),
      author: convertText(story.author, true)
    };
  });

  // URL pathname routing: /news/ID or /news/slug or /admin (with multi-language lookup)
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
  }, [allStories, lang]);
  const adminStories = allStories[dataLang] || [];
  const pages = useMemo(() => {
    if (lang === "uz") return ["Bosh sahifa", ...(siteConfig.categoriesUz || ["Siyosat", "Iqtisod", "Texnologiya", "Sport", "Madaniyat"]), "Aloqa"];
    if (lang === "uzk") return ["Бош саҳифа", ...(siteConfig.categoriesUzk || ["Сиёсат", "Иқтисод", "Технология", "Спорт", "Маданият"]), "Алоқа"];
    return ["Главная", ...(siteConfig.categoriesRu || ["Политика", "Экономика", "Технологии", "Спорт", "Культура"]), "Контакты"];
  }, [lang, siteConfig]);

  const activeContacts = useMemo(() => {
    const list = lang === "ru" ? siteConfig.contactRu : siteConfig.contactUz;
    if (!list || list.length === 0) {
      return lang === "ru" ? copy.ru.contact : copy.uz.contact;
    }
    return list.map(c => [c.title, c.value]);
  }, [lang, siteConfig]);

  const selectedCategory = useMemo(() => {
    const isHomeOrContact = ["Bosh sahifa", "Бош саҳифа", "Главная", "Aloqa", "Алоқа", "Контакты"].includes(page);
    return isHomeOrContact ? null : page;
  }, [page]);

  function changeLang(nextLang) {
    try {
      const currentIndex = Math.max(0, pages.indexOf(page));
      const nextCategories = nextLang === "uz" ? (siteConfig.categoriesUz || []) : (nextLang === "uzk" ? (siteConfig.categoriesUzk || []) : (nextLang === "ru" ? (siteConfig.categoriesRu || []) : []));
      const nextPages = [
        nextLang === "uz" ? "Bosh sahifa" : (nextLang === "uzk" ? "Бош саҳифа" : "Главная"),
        ...nextCategories,
        nextLang === "uz" ? "Aloqa" : (nextLang === "uzk" ? "Алоқа" : "Контакты")
      ];
      setLang(nextLang);
      setPage(nextPages[currentIndex] || nextPages[0]);
      setFilter("all");
      setQuery("");
      closeStory();
    } catch(e) {
      console.error("changeLang error:", e);
    }
  }

  const categories = useMemo(() => [t.all, ...new Set(stories.map((story) => story.category))], [stories, t.all]);

  const visibleStories = stories.filter((story) => {
    const matchesPage = !selectedCategory || story.category === selectedCategory;
    const matchesFilter = filter === "all" || story.category === filter || filter === t.all;
    const text = `${story.title} ${story.summary} ${story.category}`.toLowerCase();
    return matchesPage && matchesFilter && text.includes(query.toLowerCase());
  });

  const pinnedStory = pinnedHeroId ? stories.find(s => s.id === pinnedHeroId) : null;
  const hero = pinnedStory || stories[2] || stories[0] || adminStories[0] || fallbackStory;
  const pinnedSideStories = pinnedSideIds.map(id => stories.find(s => s.id === id)).filter(Boolean);
  const sideStories = pinnedSideStories.length
    ? pinnedSideStories.slice(0, 3)
    : stories.filter(s => s.id !== hero.id).slice(0, 3);

  useEffect(() => {
    refreshPublicStories();
  }, []);

  async function fetchJsonResource(path) {
    const response = await fetch(path, { cache: "no-store" });
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) throw new Error("JSON javob kelmadi");
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "API javob bermadi");
    return data;
  }

  function applyPublicStories(publicStories) {
    const uzStories = Array.isArray(publicStories?.uz) && publicStories.uz.length ? publicStories.uz : fallbackStories.uz;
    const ruStories = Array.isArray(publicStories?.ru) && publicStories.ru.length ? publicStories.ru : fallbackStories.ru;
    const uzkStories = Array.isArray(publicStories?.uzk) && publicStories.uzk.length ? publicStories.uzk : uzStories;
    setAllStories(prev => ({
      ...prev,
      uz: uzStories,
      ru: ruStories,
      uzk: uzkStories,
    }));
  }

  async function refreshPublicStories() {
    setLoading(true);
    try {
      const data = await fetchJsonResource("/api/stories");
      applyPublicStories(data.stories);
      setServerMessage("");
    } catch (error) {
      try {
        const data = await fetchJsonResource("/stories.json");
        applyPublicStories(data.stories);
        setServerMessage("");
      } catch (staticError) {
        applyPublicStories(fallbackStories);
        const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);
        setServerMessage(isLocal ? "Server API bilan aloqa bo'lmadi, demo maqolalar ko'rsatilmoqda." : "");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <WeatherBar lang={lang} />
      {siteConfig.bannerActive && siteConfig.bannerText && (
        <div className="announcement-banner">
          <span className="announcement-text">📢 {siteConfig.bannerText}</span>
        </div>
      )}
      <header className="header">
        <div className="nav-inner">
          <button className="brand nav-link" onClick={() => { setPage(pages[0]); closeStory(); window.scrollTo({ top: 0, behavior: "smooth" }); }} aria-label="Ishonch.uz">
            <Logo height={36} logoUrl={siteConfig.logoUrl} siteName={siteConfig.siteName} />
          </button>
          <nav className="nav-links" aria-label="Main navigation">
            {pages.map((item) => (
              <button
                key={item}
                className={`nav-link ${page === item ? "active" : ""}`}
                onClick={() => {
                  setPage(item);
                  setFilter("all");
                  closeStory();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                {item}
              </button>
            ))}
          </nav>
          <div className="actions">
            <div className="search-wrap">
              <input
                className="search-input"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.search}
                aria-label={t.search}
              />
            </div>
            
            <button className="lang-selector-btn" onClick={cycleLang} aria-label="Language selector">
              🌐 {langLabels[lang]}
            </button>

            {savedIds.length > 0 && (
              <button
                className={`nav-link bookmark-btn ${page === "__saved__" ? "active" : ""}`}
                style={{fontSize:18, padding:"4px 8px", position:"relative"}}
                title={lang !== "ru" ? "Saqlangan" : "Сохранённые"}
                onClick={() => { setPage("__saved__"); closeStory(); window.scrollTo({top:0,behavior:"smooth"}); }}
              >🔖 <span style={{fontSize:12,fontWeight:800}}>{savedIds.length}</span></button>
            )}

            <button className="menu-toggle-btn" onClick={() => setMenuOpen(true)} aria-label="Menu toggle">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      {/* Slide-out Menu Drawer */}
      {menuOpen && <div className="drawer-backdrop" onClick={() => setMenuOpen(false)} />}
      <div className={`drawer ${menuOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <Logo height={32} logoUrl={siteConfig.logoUrl} siteName={siteConfig.siteName} />
          <button className="drawer-close-btn" onClick={() => setMenuOpen(false)}>✕</button>
        </div>
        <div className="drawer-content">
          <nav className="drawer-nav">
            {pages.map((item) => (
              <button
                key={item}
                className={`drawer-nav-link ${page === item ? "active" : ""}`}
                onClick={() => {
                  setPage(item);
                  setFilter("all");
                  closeStory();
                  setMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                {item}
              </button>
            ))}
          </nav>
          
          <div className="drawer-divider" />
          
          <div className="drawer-section">
            <h4>{lang !== "ru" ? "Sozlamalar" : "Настройки"}</h4>
            <div className="drawer-setting-row">
              <span>{lang !== "ru" ? "Tungi rejim" : "Темная тема"}</span>
              <button
                className="drawer-setting-btn"
                onClick={() => setDarkMode(d => !d)}
              >
                {darkMode ? (lang !== "ru" ? "🌙 Yoqilgan" : "🌙 Включено") : (lang !== "ru" ? "☀️ O'chirilgan" : "☀️ Выключено")}
              </button>
            </div>
          </div>
          
          <div className="drawer-divider" />
          
          <div className="drawer-section">
            <h4>{lang !== "ru" ? "Bog'lanish" : "Контакты"}</h4>
            <p style={{fontSize: 14, color: "var(--muted)", lineHeight: 1.5, margin: "8px 0 0"}}>
              <strong>{activeContacts[0]?.[0] || ""}:</strong> {activeContacts[0]?.[1] || ""}<br/>
              <strong>{activeContacts[1]?.[0] || ""}:</strong> {activeContacts[1]?.[1] || ""}
            </p>
          </div>
        </div>
      </div>
      {serverMessage && page !== "admin" && <div className="api-banner">{serverMessage}</div>}

      {activeStory ? (
        <ArticlePage
          t={t} story={activeStory} stories={stories}
          savedIds={savedIds} onToggleSave={toggleSave}
          copiedShare={copiedShare} setCopiedShare={setCopiedShare}
          onClose={closeStory}
          onOpen={openStory}
          onView={handleView}
          reactions={reactions} addReaction={addReaction}
          onAuthorClick={(author) => { setActiveAuthor(author); closeStory(); window.scrollTo({top:0,behavior:"smooth"}); }}
          onTagClick={(tag) => { setActiveTag(tag); closeStory(); window.scrollTo({top:0,behavior:"smooth"}); }}
        />
      ) : activeAuthor ? (
        <AuthorPage
          author={activeAuthor} stories={stories} lang={lang}
          onOpen={openStory}
          onBack={() => setActiveAuthor(null)}
          savedIds={savedIds} onToggleSave={toggleSave}
        />
      ) : activeTag ? (
        <TagPage
          tag={activeTag} stories={stories} lang={lang}
          onOpen={openStory}
          onBack={() => setActiveTag(null)}
          savedIds={savedIds} onToggleSave={toggleSave}
        />
      ) : (
        <>
          {page !== "admin" && page !== "__saved__" && <Hero t={t} hero={hero} sideStories={sideStories.filter(Boolean)} openStory={openStory} pinnedHeroId={pinnedHeroId} />}
          {page !== "admin" && page !== "__saved__" && <AdBanner ads={ads} position="top" />}

          {page === "admin" ? (
            <AdminPanel
              lang={lang}
              setLang={setLang}
              allStories={allStories}
              stories={adminStories}
              setAllStories={setAllStories}
              refreshPublicStories={refreshPublicStories}
              siteConfig={siteConfig}
              setSiteConfig={setSiteConfig}
              pinnedHeroId={pinnedHeroId}
              setPinnedHeroId={setPinnedHeroId}
              pinnedSideIds={pinnedSideIds}
              setPinnedSideIds={setPinnedSideIds}
              ads={ads}
              setAds={setAds}
            />
          ) : page === "__saved__" ? (
            <main className="section saved-page">
              <div className="section-inner">
                <div className="section-head">
                  <div>
                    <h2 className="section-title">🔖 {lang !== "ru" ? "Saqlangan maqolalar" : "Сохранённые статьи"}</h2>
                    <p className="saved-count">{savedIds.length} ta maqola saqlangan</p>
                  </div>
                  {savedIds.length > 0 && (
                    <button className="adm-btn ghost" style={{fontSize:12}} onClick={() => setSavedIds([])}>
                      {lang !== "ru" ? "Hammasini o'chirish" : "Очистить всё"}
                    </button>
                  )}
                </div>
                {savedIds.length === 0 ? (
                  <div className="saved-empty">
                    <span>🔖</span>
                    <p>{lang !== "ru" ? "Hozircha hech narsa saqlanmagan" : "Ничего не сохранено"}</p>
                    <small>{lang !== "ru" ? "Maqolalardagi ★ tugmasini bosing" : "Нажмите ★ в статье"}</small>
                  </div>
                ) : (
                  <div className="layout">
                    <div className="stories-grid">
                      {stories.filter(s => savedIds.includes(s.id)).map(story => (
                        <StoryCard key={story.id} story={story} savedIds={savedIds} onToggleSave={toggleSave}
                          onOpen={() => openStory(story)} />
                      ))}
                    </div>
                    <Sidebar t={t} stories={stories} onOpen={openStory} />
                  </div>
                )}
              </div>
            </main>
          ) : page === pages[pages.length - 1] ? (
            <ContactPage t={t} page={page} />
          ) : (
            <main className={`section ${page === pages[0] ? "home-section" : "category-section"}`}>
              <div className="section-inner">
                {page !== pages[0] && (
                  <div className="category-masthead">
                    <span>{t.portal}</span>
                    <h1>{page}</h1>
                    <p>{t.pageNotes[page]}</p>
                  </div>
                )}
                <div className="section-head">
                  <div>
                    <h2 className="section-title">{page === pages[0] ? t.latest : page}</h2>
                    <p className="section-note">{page === pages[0] ? t.latestNote : t.pageNotes[page]}</p>
                  </div>
                  <div className="page-tools">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        className={`chip ${(filter === cat || (filter === "all" && cat === t.all)) ? "active" : ""}`}
                        onClick={() => setFilter(cat === t.all ? "all" : cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="layout">
                  <div>
                    <AdBanner ads={ads} position="inline" />
                    <div className="stories-grid">
                      {loading
                        ? Array.from({length: 6}).map((_, i) => <SkeletonCard key={i} />)
                        : visibleStories.length ? (page === pages[0] ? visibleStories.slice(0, 8) : visibleStories).map((story, index) => (
                          <StoryCard key={story.id} story={story} featured={page !== pages[0] && index === 0}
                            savedIds={savedIds} onToggleSave={toggleSave}
                            onOpen={openStory} />
                        )) : <div className="empty-state">Bu bo'limda hozircha maqola yo'q.</div>}
                    </div>
                    {page === pages[0] && visibleStories.length > 8 && (
                      <div style={{textAlign:"center", marginTop:24}}>
                        <button className="load-more-btn" onClick={() => setFilter("all") & setPage && window.scrollTo({top:0,behavior:"smooth"})}>
                          {lang !== "ru" ? `Ko'proq ko'rish (${visibleStories.length - 8} ta qoldi)` : `Показать ещё (осталось ${visibleStories.length - 8})`}
                        </button>
                      </div>
                    )}
                  </div>
                  <Sidebar t={t} stories={stories} onOpen={openStory} />
                </div>
              </div>
            </main>
          )}

          {page !== "admin" && <AdBanner ads={ads} position="bottom" />}
          {page !== "admin" && page !== pages[pages.length - 1] && <BreakingBanner lang={lang} stories={stories} onOpen={openStory} />}
          {page !== "admin" && page !== pages[pages.length - 1] && <MediaSection lang={lang} items={mediaItems[lang] || mediaItems.uz} />}
          {page !== "admin" && <Special t={t} siteConfig={siteConfig} />}
        </>
      )}

      <Footer t={t} pages={pages} setPage={(p) => { setPage(p); closeStory(); window.scrollTo({ top: 0, behavior: "smooth" }); }} openAdmin={() => { setPage("admin"); closeStory(); }} siteConfig={siteConfig} lang={lang} />

      <button
        className={`scroll-top-btn ${scrollVisible ? "visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        title="Yuqoriga"
      >↑</button>

      {/* 📱 Mobile bottom navigation */}
      <nav className="mobile-bottom-nav">
        <button className={`mob-nav-btn ${page === pages[0] && !activeStory ? "active" : ""}`}
          onClick={() => { setPage(pages[0]); closeStory(); setActiveAuthor(null); setActiveTag(null); window.scrollTo({top:0,behavior:"smooth"}); }}>
          <span>🏠</span><span>{t.close === "Yopish" ? "Bosh" : "Главная"}</span>
        </button>
        <button className={`mob-nav-btn ${query ? "active" : ""}`}
          onClick={() => document.querySelector(".search")?.focus()}>
          <span>🔍</span><span>{t.close === "Yopish" ? "Qidirish" : "Поиск"}</span>
        </button>
        <button className={`mob-nav-btn ${page === "__saved__" ? "active" : ""}`}
          onClick={() => { setPage("__saved__"); closeStory(); window.scrollTo({top:0,behavior:"smooth"}); }}>
          <span>🔖</span><span>{t.close === "Yopish" ? "Saqlangan" : "Сохранённые"}</span>
          {savedIds.length > 0 && <span className="mob-nav-badge">{savedIds.length}</span>}
        </button>
        <button className={`mob-nav-btn ${page === "admin" ? "active" : ""}`}
          onClick={() => { setPage("admin"); closeStory(); window.scrollTo({top:0,behavior:"smooth"}); }}>
          <span>⚙️</span><span>Admin</span>
        </button>
      </nav>
    </div>