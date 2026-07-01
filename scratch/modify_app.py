import re

app_path = 'app.jsx'

with open(app_path, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add videosList state and fetchVideos callback to App()
state_target = 'const [stats, setStats] = useState(null);'
state_replacement = """const [stats, setStats] = useState(null);
  const [videosList, setVideosList] = useState([]);"""

if state_target in code:
    code = code.replace(state_target, state_replacement)
    print("Added videosList state inside App()")
else:
    print("Warning: stats state target not found in app.jsx")

fetch_stats_target = """  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/visitor/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Stats fetch failed", err);
    }
  }, []);"""

fetch_videos_callback = """  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/visitor/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Stats fetch failed", err);
    }
  }, []);

  const fetchVideos = useCallback(async () => {
    try {
      const res = await fetch("/api/public/videos");
      const data = await res.json();
      if (data.videos) {
        setVideosList(data.videos);
      }
    } catch (err) {
      console.error("Videos fetch failed", err);
    }
  }, []);"""

if fetch_stats_target in code:
    code = code.replace(fetch_stats_target, fetch_videos_callback)
    print("Added fetchVideos callback inside App()")
else:
    print("Warning: fetchStats callback target not found in app.jsx")

ping_effect_target = """  // Send ping on page mount and periodically every 10 seconds
  useEffect(() => {
    sendPing(true); // initial visit action
    fetchStats();   // initial load of stats"""

ping_effect_replacement = """  // Send ping on page mount and periodically every 10 seconds
  useEffect(() => {
    sendPing(true); // initial visit action
    fetchStats();   // initial load of stats
    fetchVideos();  // initial load of videos"""

if ping_effect_target in code:
    code = code.replace(ping_effect_target, ping_effect_replacement)
    print("Added fetchVideos call to mount useEffect in App()")
else:
    print("Warning: mount useEffect target not found in app.jsx")

# 2. Add public videos fetch to the quotes fetch useEffect
quotes_effect_target = """  useEffect(() => {
    fetch("/api/public/quotes")
      .then(res => res.json())
      .then(data => {
        if (data.quotes && data.quotes.length) {
          setActiveQuote(data.quotes[0]);
        }
      })
      .catch(() => null);
  }, []);"""

quotes_effect_replacement = """  useEffect(() => {
    fetch("/api/public/quotes")
      .then(res => res.json())
      .then(data => {
        if (data.quotes && data.quotes.length) {
          setActiveQuote(data.quotes[0]);
        }
      })
      .catch(() => null);

    fetch("/api/public/videos")
      .then(res => res.json())
      .then(data => {
        if (data.videos) {
          setVideosList(data.videos);
        }
      })
      .catch(() => null);
  }, []);"""

if quotes_effect_target in code:
    code = code.replace(quotes_effect_target, quotes_effect_replacement)
    print("Added public videos fetch to quotes useEffect in App()")
else:
    print("Warning: quotes useEffect target not found in app.jsx")

# 3. Add dynamicMediaItems useMemo inside App()
selected_cat_target = '  const selectedCategory = useMemo(() => {'
selected_cat_replacement = """  const dynamicMediaItems = useMemo(() => {
    const currentLangVideos = videosList.filter(v => v.lang === lang);
    if (currentLangVideos.length > 0) {
      return currentLangVideos.map(v => [v.type || "video", v.title, v.meta, v.image, v.url]);
    }
    return mediaItems[lang] || mediaItems.uz;
  }, [videosList, lang]);

  const selectedCategory = useMemo(() => {"""

if selected_cat_target in code:
    code = code.replace(selected_cat_target, selected_cat_replacement)
    print("Added dynamicMediaItems useMemo in App()")
else:
    print("Warning: selectedCategory target not found in app.jsx")

# 4. Update the MediaSection items prop inside App render
media_section_prop_target = '<MediaSection lang={lang} items={mediaItems[lang] || mediaItems.uz} />'
media_section_prop_replacement = '<MediaSection lang={lang} items={dynamicMediaItems} />'

if media_section_prop_target in code:
    code = code.replace(media_section_prop_target, media_section_prop_replacement)
    print("Updated MediaSection items prop to dynamicMediaItems in App()")
else:
    print("Warning: MediaSection tag not found in app.jsx")

# 5. Add VideoPage rendering in App routing
routing_target = """          ) : (page === "Jurnallar" || page === "Журналлар" || page === "Журналы") ? (
            <JournalPage t={t} lang={lang} />
          ) : ("""

routing_replacement = """          ) : (page === "Jurnallar" || page === "Журналлар" || page === "Журналы") ? (
            <JournalPage t={t} lang={lang} />
          ) : (page === "Video" || page === "Видео") ? (
            <VideoPage lang={lang} items={dynamicMediaItems} />
          ) : ("""

if routing_target in code:
    code = code.replace(routing_target, routing_replacement)
    print("Added VideoPage route matching in App()")
else:
    print("Warning: Jurnallar route target not found in app.jsx")

# 6. Pass refreshPublicVideos prop to AdminPanel inside App
admin_panel_target = """            <AdminPanel
              lang={lang}
              setLang={setLang}
              allStories={allStories}
              stories={adminStories}
              setAllStories={setAllStories}
              refreshPublicStories={refreshPublicStories}
              siteConfig={siteConfig}"""

admin_panel_replacement = """            <AdminPanel
              lang={lang}
              setLang={setLang}
              allStories={allStories}
              stories={adminStories}
              setAllStories={setAllStories}
              refreshPublicStories={refreshPublicStories}
              siteConfig={siteConfig}
              refreshPublicVideos={fetchVideos}"""

if admin_panel_target in code:
    code = code.replace(admin_panel_target, admin_panel_replacement)
    print("Passed refreshPublicVideos prop to AdminPanel in App()")
else:
    print("Warning: AdminPanel render target not found in app.jsx")

# 7. Add refreshPublicVideos parameter to AdminPanel function header
admin_func_target = 'function AdminPanel({ lang, setLang, allStories, stories, setAllStories, refreshPublicStories, siteConfig, setSiteConfig, pinnedHeroId, setPinnedHeroId, pinnedSideIds, setPinnedSideIds, ads, setAds }) {'
admin_func_replacement = 'function AdminPanel({ lang, setLang, allStories, stories, setAllStories, refreshPublicStories, siteConfig, setSiteConfig, pinnedHeroId, setPinnedHeroId, pinnedSideIds, setPinnedSideIds, ads, setAds, refreshPublicVideos }) {'

if admin_func_target in code:
    code = code.replace(admin_func_target, admin_func_replacement)
    print("Added refreshPublicVideos parameter to AdminPanel function header")
else:
    print("Warning: AdminPanel function signature target not found in app.jsx")

# 8. Add states to AdminPanel
admin_states_target = """  // --- 🆕 NEW COLLECTIONS STATES ---
  const [quotes, setQuotes] = useState([]);"""

admin_states_replacement = """  // --- 🆕 NEW COLLECTIONS STATES ---
  const [quotes, setQuotes] = useState([]);
  const [videosAdminList, setVideosAdminList] = useState([]);
  const EMPTY_VIDEO = { type: "video", title: "", meta: "", image: "", url: "", lang: "uz" };
  const [videoForm, setVideoForm] = useState(EMPTY_VIDEO);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const videoThumbnailRef = useRef(null);"""

if admin_states_target in code:
    code = code.replace(admin_states_target, admin_states_replacement)
    print("Added video states inside AdminPanel")
else:
    print("Warning: admin states target not found in app.jsx")

# 9. Fetch videos inside loadAllAdminCollections()
load_collections_target = '      const qData = await api("/api/admin/quotes"); setQuotes(qData.quotes || []);'
load_collections_replacement = """      const qData = await api("/api/admin/quotes"); setQuotes(qData.quotes || []);
      const vData = await api("/api/admin/videos"); setVideosAdminList(vData.videos || []);"""

if load_collections_target in code:
    code = code.replace(load_collections_target, load_collections_replacement)
    print("Added api/admin/videos fetch inside loadAllAdminCollections()")
else:
    print("Warning: loadAllAdminCollections target not found in app.jsx")

# 10. Add Video CRUD operations inside AdminPanel
crud_target = """  // --- 🆕 NEW CRUD OPERATIONS ---
  // Quotes CRUD"""

crud_replacement = """  // --- 🆕 NEW CRUD OPERATIONS ---
  // Videos CRUD
  async function saveVideo(e) {
    e.preventDefault();
    if (!videoForm.title.trim()) return notify("Video sarlavhasi shart", "error");
    try {
      if (editingVideoId) {
        await api(`/api/admin/videos/${editingVideoId}`, { method: "PUT", body: JSON.stringify(videoForm) });
        notify("✓ Video yangilandi", "success");
      } else {
        await api("/api/admin/videos", { method: "POST", body: JSON.stringify(videoForm) });
        notify("✓ Yangi video qo'shildi", "success");
      }
      setVideoForm(EMPTY_VIDEO);
      setEditingVideoId(null);
      loadAllAdminCollections();
      if (refreshPublicVideos) refreshPublicVideos();
    } catch (e) { notify(e.message, "error"); }
  }

  async function deleteVideo(id) {
    if (!confirm("Ushbu videoni o'chirasizmi?")) return;
    try {
      await api(`/api/admin/videos/${id}`, { method: "DELETE" });
      notify("✓ O'chirildi", "success");
      loadAllAdminCollections();
      if (refreshPublicVideos) refreshPublicVideos();
    } catch (e) { notify(e.message, "error"); }
  }

  async function uploadVideoThumbnail(file) {
    if (!file) return;
    try {
      notify("⏳ Rasm yuklanmoqda...", "info");
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const res = await fetch("/api/admin/upload", {
            method: "POST",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dataUrl: reader.result }),
          });
          const data = await res.json();
          if (data.url) {
            setVideoForm(prev => ({ ...prev, image: data.url }));
            await loadMedia();
            notify("✓ Rasm yuklandi.", "success");
          } else {
            notify(data.error || "Xatolik", "error");
          }
        } catch { notify("Yuklashda xatolik", "error"); }
      };
      reader.readAsDataURL(file);
    } catch { notify("Xatolik", "error"); }
  }

  // Quotes CRUD"""

if crud_target in code:
    code = code.replace(crud_target, crud_replacement)
    print("Added saveVideo/deleteVideo/uploadVideoThumbnail helpers inside AdminPanel")
else:
    print("Warning: Quotes CRUD target not found in app.jsx")

# 11. Add videos translations to menuLabels
menu_labels_uz_target = """      subscribers: "Obunachilar",
      newsletter: "Ommaviy xat",
      payments: "Xayriya va to'lovlar","""

menu_labels_uz_replacement = """      subscribers: "Obunachilar",
      newsletter: "Ommaviy xat",
      payments: "Xayriya va to'lovlar",
      videos: "Video gallereyasi","""

if menu_labels_uz_target in code:
    code = code.replace(menu_labels_uz_target, menu_labels_uz_replacement)
    print("Added videos translation to menuLabels.uz")
else:
    print("Warning: menuLabels.uz target not found in app.jsx")

menu_labels_uzk_target = """      subscribers: "Обуначилар",
      newsletter: "Оммавий хат",
      payments: "Хайрия ва тўловлар","""

menu_labels_uzk_replacement = """      subscribers: "Обуначилар",
      newsletter: "Оммавий хат",
      payments: "Хайрия ва тўловлар",
      videos: "Видео галереяси","""

if menu_labels_uzk_target in code:
    code = code.replace(menu_labels_uzk_target, menu_labels_uzk_replacement)
    print("Added videos translation to menuLabels.uzk")
else:
    print("Warning: menuLabels.uzk target not found in app.jsx")

menu_labels_ru_target = """      subscribers: "Подписчики",
      newsletter: "Рассылка писем",
      payments: "Пожертвования и платежи","""

menu_labels_ru_replacement = """      subscribers: "Подписчики",
      newsletter: "Рассылка писем",
      payments: "Пожертвования и платежи",
      videos: "Видеогалерея","""

if menu_labels_ru_target in code:
    code = code.replace(menu_labels_ru_target, menu_labels_ru_replacement)
    print("Added videos translation to menuLabels.ru")
else:
    print("Warning: menuLabels.ru target not found in app.jsx")

# 12. Add videos icon to menuIcons
menu_icons_target = """    payments: "💳",
    settings: "⚙️"
  };"""

menu_icons_replacement = """    payments: "💳",
    videos: "🎥",
    settings: "⚙️"
  };"""

if menu_icons_target in code:
    code = code.replace(menu_icons_target, menu_icons_replacement)
    print("Added video icon to menuIcons in AdminPanel")
else:
    print("Warning: menuIcons target not found in app.jsx")

# 13. Add count badge for videos tab in AdminPanel nav
nav_badge_target = """              {tabKey === "subscribers" && subscribers.length > 0 && <span className="adm-nav-count">{subscribers.length}</span>}"""
nav_badge_replacement = """              {tabKey === "subscribers" && subscribers.length > 0 && <span className="adm-nav-count">{subscribers.length}</span>}
              {tabKey === "videos" && videosAdminList.length > 0 && <span className="adm-nav-count">{videosAdminList.length}</span>}"""

if nav_badge_target in code:
    code = code.replace(nav_badge_target, nav_badge_replacement)
    print("Added videos tab count badge inside AdminPanel nav menu")
else:
    print("Warning: AdminPanel subscribers badge target not found in app.jsx")

# 14. Add Videos tab panel UI inside AdminPanel
tab_panel_target = """        {/* --- ✍️ TAB: AUTHORS --- */}
        {activeTab === "authors" && ("""

tab_panel_replacement = """        {/* --- 🎥 TAB: VIDEOS --- */}
        {activeTab === "videos" && (
          <div className="adm-dash-grid" style={{gridTemplateColumns: "1fr 2fr"}}>
            <div className="adm-dash-section">
              <h3>{editingVideoId ? "Videoni tahrirlash" : "Yangi video qo'shish"}</h3>
              <form onSubmit={saveVideo} className="adm-form">
                <label>
                  Sarlavha
                  <input value={videoForm.title} onChange={e => setVideoForm({...videoForm, title: e.target.value})} placeholder="Masalan: Dunyoda nechta AES bor..." required />
                </label>
                <label>
                  Til
                  <select value={videoForm.lang} onChange={e => setVideoForm({...videoForm, lang: e.target.value})} required>
                    <option value="uz">O'zbekcha (Lotin)</option>
                    <option value="uzk">Ўзбекча (Кирилл)</option>
                    <option value="ru">Русский</option>
                  </select>
                </label>
                <label>
                  Rukn / Kategoriya va Vaqt (Meta)
                  <input value={videoForm.meta} onChange={e => setVideoForm({...videoForm, meta: e.target.value})} placeholder="Masalan: Jahon | 09:38" required />
                </label>
                <label>
                  Muqova rasm URL manzili
                  <div style={{display: "flex", gap: "10px"}}>
                    <input style={{flex: 1}} value={videoForm.image} onChange={e => setVideoForm({...videoForm, image: e.target.value})} placeholder="https://..." required />
                    <button className="adm-btn primary" type="button" onClick={() => videoThumbnailRef.current?.click()}>📁 Yuklash</button>
                    <input type="file" accept="image/*" ref={videoThumbnailRef} style={{display: "none"}} onChange={e => { if (e.target.files?.[0]) uploadVideoThumbnail(e.target.files[0]) }} />
                  </div>
                </label>
                <label>
                  Video manzili (YouTube yoki Fayl)
                  <input value={videoForm.url} onChange={e => setVideoForm({...videoForm, url: e.target.value})} placeholder="Masalan: https://www.youtube.com/watch?v=..." required />
                </label>
                <div style={{display: "flex", gap: "10px", marginTop: "10px"}}>
                  <button className="adm-btn primary" type="submit">{editingVideoId ? "Saqlash" : "Qo'shish"}</button>
                  {editingVideoId && (
                    <button className="adm-btn ghost" type="button" onClick={() => { setEditingVideoId(null); setVideoForm(EMPTY_VIDEO); }}>Bekor qilish</button>
                  )}
                </div>
              </form>
            </div>

            <div className="adm-dash-section">
              <h3>Yuklangan videolar ({videosAdminList.length} ta)</h3>
              <table className="adm-table" style={{width: "100%"}}>
                <thead>
                  <tr>
                    <th>Rasm</th>
                    <th>Sarlavha</th>
                    <th>Til</th>
                    <th>Meta</th>
                    <th>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {videosAdminList.map(v => (
                    <tr key={v.id}>
                      <td>
                        {v.image ? (
                          <img src={v.image} alt="" style={{width: "60px", height: "40px", objectFit: "cover", borderRadius: "4px"}} />
                        ) : (
                          <span>🎥</span>
                        )}
                      </td>
                      <td>
                        <strong>{v.title}</strong>
                        <div style={{fontSize: "11px", color: "var(--muted)"}}>
                          <a href={v.url} target="_blank" rel="noopener noreferrer">Videoni ko'rish</a>
                        </div>
                      </td>
                      <td>
                        <span className="badge" style={{textTransform: "uppercase"}}>{v.lang}</span>
                      </td>
                      <td>{v.meta}</td>
                      <td>
                        <button className="adm-btn ghost" onClick={() => { setEditingVideoId(v.id); setVideoForm(v); }} style={{padding: "4px 8px", marginRight: "4px"}}>✏️</button>
                        <button className="adm-btn danger" onClick={() => deleteVideo(v.id)} style={{padding: "4px 8px"}}>✕</button>
                      </td>
                    </tr>
                  ))}
                  {videosAdminList.length === 0 && (
                    <tr><td colSpan="5" style={{textAlign:"center", color:"var(--muted)"}}>Hozircha videolar yuklanmagan</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- ✍️ TAB: AUTHORS --- */}
        {activeTab === "authors" && ("""

if tab_panel_target in code:
    code = code.replace(tab_panel_target, tab_panel_replacement)
    print("Added Videos tab UI layout inside AdminPanel")
else:
    print("Warning: AdminPanel authors tab target not found in app.jsx")

# 15. Make MediaSection play button open video link
play_btn_target = '<button className="media-play-btn">{isUz ? "Tomosha qilish →" : "Смотреть →"}</button>'
play_btn_replacement = '<button className="media-play-btn" onClick={() => window.open(featured[4] || "https://youtube.com", "_blank")}>{isUz ? "Tomosha qilish →" : "Смоtreet ->"}</button>'

# Wait, we can use simple ASCII labels for watchLabel in python print
if play_btn_target in code:
    code = code.replace(play_btn_target, play_btn_replacement)
    print("Added play button link click handler to MediaSection featured block")
else:
    print("Warning: MediaSection play button target not found in app.jsx")

# 16. Make MediaSection list items open video link
list_item_target = """              {rest.map(([t, itemTitle, meta, image]) => (
                <article className="media-list-item" key={itemTitle}>
                  <button>"""

list_item_replacement = """              {rest.map(([t, itemTitle, meta, image, url]) => (
                <article className="media-list-item" key={itemTitle}>
                  <button onClick={() => window.open(url || "https://youtube.com", "_blank")}>"""

if list_item_target in code:
    code = code.replace(list_item_target, list_item_replacement)
    print("Added item link click handler to MediaSection rest items list")
else:
    print("Warning: MediaSection rest items list target not found in app.jsx")

# 17. Append the VideoPage component function definition before final ReactDOM.render call
video_page_component = """
function VideoPage({ lang, items = [] }) {
  const isUz = lang !== "ru";
  const featured = items[0];
  const rest = items.slice(1);

  if (!items.length) {
    return (
      <main className="section">
        <div className="section-inner" style={{textAlign: "center", padding: "80px 20px"}}>
          <span>🎥</span>
          <h2 style={{marginTop: "16px"}}>{isUz ? "Hozircha videolar yo'q" : "Видео пока отсутствуют"}</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="section-inner">
        <div className="category-masthead">
          <span>{isUz ? "Yangiliklar portali" : "Портал новостей"}</span>
          <h1>{isUz ? "Video gallereyasi" : "Видеогалерея"}</h1>
          <p>{isUz ? "Kunning eng muhim videolari va sharhlari" : "Самые важные видео дня и видеообзоры"}</p>
        </div>

        <div style={{display: "flex", flexDirection: "column", gap: "32px", marginTop: "32px"}}>
          {/* Main featured video */}
          <article className="media-featured" style={{cursor: "pointer", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "12px", overflow: "hidden", display: "grid", gridTemplateColumns: "3fr 2fr"}} onClick={() => window.open(featured[4] || "https://youtube.com", "_blank")}>
            <div className="media-featured-thumb" style={{position: "relative", paddingTop: "56.25%", height: 0, overflow: "hidden"}}>
              <img src={featured[3]} alt="" style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover"}} />
              <div className="media-featured-overlay" style={{position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)"}} />
              <span className="media-featured-icon video" style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "64px", height: "64px", background: "var(--brand)", color: "#fff", display: "grid", placeItems: "center", borderRadius: "50%", fontSize: "24px", fontWeight: "bold"}}>▶</span>
              <div className="media-featured-meta" style={{position: "absolute", bottom: "16px", left: "16px", display: "flex", gap: "10px", alignItems: "center"}}>
                <span className="media-type-badge video" style={{background: "#ff3b30", color: "#fff", padding: "2px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: 700}}>{isUz ? "Video" : "Видео"}</span>
                <span style={{color: "#fff", fontSize: "13px"}}>{featured[2]}</span>
              </div>
            </div>
            <div className="media-featured-body" style={{padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
              <strong style={{fontSize: "22px", lineHeight: "1.4", color: "var(--ink)", display: "block"}}>{featured[1]}</strong>
              <button className="media-play-btn" style={{alignSelf: "flex-start", background: "var(--brand)", color: "#fff", border: 0, padding: "10px 20px", borderRadius: "8px", fontWeight: 700, cursor: "pointer"}}>{isUz ? "Tomosha qilish →" : "Смотреть →"}</button>
            </div>
          </article>

          {/* Rest of the videos grid */}
          <div className="media-v2-grid" style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px"}}>
            {rest.map(([t, itemTitle, meta, image, url]) => (
              <article className="media-list-item" key={itemTitle} style={{background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column"}} onClick={() => window.open(url || "https://youtube.com", "_blank")}>
                <div style={{position: "relative", paddingTop: "56.25%", overflow: "hidden"}}>
                  <img src={image} alt="" style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover"}} />
                  <span style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "44px", height: "44px", background: "var(--brand)", color: "#fff", display: "grid", placeItems: "center", borderRadius: "50%", fontSize: "16px"}}>▶</span>
                </div>
                <div style={{padding: "16px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                  <strong style={{fontSize: "15px", lineHeight: "1.4", color: "var(--ink)", display: "block", marginBottom: "8px", fontWeight: 700}}>{itemTitle}</strong>
                  <small style={{fontSize: "12px", color: "var(--muted)"}}>{meta}</small>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
"""

eof_target = 'ReactDOM.createRoot(document.getElementById("root")).render(<App />);'
eof_replacement = video_page_component + "\n" + eof_target

if eof_target in code:
    code = code.replace(eof_target, eof_replacement)
    print("Appended VideoPage component at the bottom of app.jsx")
else:
    print("Warning: eof target not found in app.jsx")

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(code)
print("Finished modifying app.jsx")
