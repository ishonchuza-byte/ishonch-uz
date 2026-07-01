function AdminPanel({ lang, setLang, allStories, stories, setAllStories, refreshPublicStories, siteConfig, setSiteConfig, pinnedHeroId, setPinnedHeroId, pinnedSideIds, setPinnedSideIds, ads, setAds }) {
  const adminLang = lang === "uzk" ? "uz" : lang;
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("info");
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("stats");
  const [form, setForm] = useState({ ...emptyStory, category: lang !== "ru" ? "Siyosat" : "Политика" });
  
  // 🔄 Undo/Redo history
  const [formHistory, setFormHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const maxHistory = 20;

  // 📱 Bulk actions
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaFilter, setMediaFilter] = useState("all");
  const [mediaUploading, setMediaUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState("");
  const mediaFileRef = useRef(null);
  const importFileRef = useRef(null);
  const [formErrors, setFormErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const EMPTY_AD = { id: "", title: "", subtitle: "", image: "", link: "", position: "top", active: true };
  const [adForm, setAdForm] = useState(EMPTY_AD);
  const [editingAdId, setEditingAdId] = useState(null);
  
  // 🖼️ Cropper and Ad Stats States
  const [cropSrc, setCropSrc] = useState(null);
  const [cropSliders, setCropSliders] = useState({ x: 0, y: 0, scale: 100 });
  const cropCanvasRef = useRef(null);

  // --- 🆕 NEW COLLECTIONS STATES ---
  const [quotes, setQuotes] = useState([]);
  const [journals, setJournals] = useState([]);
  const [messagesList, setMessagesList] = useState([]);
  const [comments, setComments] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [pagesList, setPagesList] = useState([]);
  const [newsletterHistory, setNewsletterHistory] = useState([]);

  // --- 🆕 FORMS STATES FOR NEW TABS ---
  const EMPTY_QUOTE = { text: "", author: "", status: "active" };
  const [quoteForm, setQuoteForm] = useState(EMPTY_QUOTE);
  const [editingQuoteId, setEditingQuoteId] = useState(null);

  const EMPTY_JOURNAL = { title: "", coverUrl: "", pdfUrl: "", publishDate: new Date().toISOString().split("T")[0] };
  const [journalForm, setJournalForm] = useState(EMPTY_JOURNAL);
  const [editingJournalId, setEditingJournalId] = useState(null);

  const EMPTY_AUTHOR = { name: "", bio: "", avatar: "", role: "", status: "active" };
  const [authorForm, setAuthorForm] = useState(EMPTY_AUTHOR);
  const [editingAuthorId, setEditingAuthorId] = useState(null);

  const EMPTY_PAGE = { title: "", slug: "", body: "", status: "published" };
  const [pageForm, setPageForm] = useState(EMPTY_PAGE);
  const [editingPageId, setEditingPageId] = useState(null);

  const EMPTY_NEWSLETTER = { subject: "", body: "" };
  const [newsletterForm, setNewsletterForm] = useState(EMPTY_NEWSLETTER);

  // Home configuration page states
  const [homeConfig, setHomeConfig] = useState({
    siteName: "",
    logoUrl: "",
    descriptionUz: "",
    descriptionRu: "",
    descriptionUzk: "",
    brandColor: "",
    bannerText: "",
    bannerActive: false
  });

  // Transliterator Cyrillic Map
  function generateSlug(title) {
    const cyrMap = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'j', 'з': 'z',
      'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
      'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'x', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sh',
      'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya', 'ў': 'o', 'қ': 'q', 'ғ': 'g', 'ҳ': 'h'
    };
    let text = (title || "").toLowerCase().trim();
    let transliterated = "";
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      transliterated += cyrMap[char] !== undefined ? cyrMap[char] : char;
    }
    return transliterated
      .replace(/[ʻ'ʽ]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // --- 🆕 LOAD COLLECTIONS ---
  async function loadAllAdminCollections() {
    try {
      const qData = await api("/api/admin/quotes"); setQuotes(qData.quotes || []);
      const jData = await api("/api/admin/journals"); setJournals(jData.journals || []);
      const mData = await api("/api/admin/messages"); setMessagesList(mData.messages || []);
      const cData = await api("/api/admin/comments"); setComments(cData.comments || []);
      const aData = await api("/api/admin/authors"); setAuthors(aData.authors || []);
      const sData = await api("/api/admin/subscribers"); setSubscribers(sData.subscribers || []);
      const pData = await api("/api/admin/payments"); setPayments(pData.payments || []);
      const pgData = await api("/api/admin/pages"); setPagesList(pgData.pages || []);
      
      const nlRes = await fetch("/api/admin/newsletter/history"); 
      const nlData = await nlRes.json();
      setNewsletterHistory(nlData.sentNewsletters || []);
    } catch (e) {
      console.error("Collections loading failed:", e);
    }
  }

  // Cropper effect
  useEffect(() => {
    if (!cropSrc) return;
    const canvas = cropCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = cropSrc;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const canvasRatio = 16 / 9;
      const imgRatio = img.width / img.height;
      let sWidth = img.width;
      let sHeight = img.height;
      if (imgRatio > canvasRatio) {
        sWidth = img.height * canvasRatio;
      } else {
        sHeight = img.width / canvasRatio;
      }
      const scaleFactor = 100 / cropSliders.scale;
      const cropW = sWidth * scaleFactor;
      const cropH = sHeight * scaleFactor;
      const maxDeltaX = (img.width - cropW) / 2;
      const maxDeltaY = (img.height - cropH) / 2;
      const offsetX = (cropSliders.x / 50) * maxDeltaX;
      const offsetY = (cropSliders.y / 50) * maxDeltaY;
      const sx = Math.max(0, Math.min(img.width - cropW, (img.width - cropW) / 2 + offsetX));
      const sy = Math.max(0, Math.min(img.height - cropH, (img.height - cropH) / 2 + offsetY));
      ctx.drawImage(img, sx, sy, cropW, cropH, 0, 0, canvas.width, canvas.height);
    };
  }, [cropSrc, cropSliders]);

  async function handleCropUpload() {
    const canvas = cropCanvasRef.current;
    if (!canvas) return;
    const croppedDataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setCropSrc(null);
    setMediaUploading(true);
    notify("⏳ Rasm yuklanmoqda...", "info");
    try {
      const data = await api("/api/admin/upload", {
        method: "POST",
        body: JSON.stringify({ dataUrl: croppedDataUrl }),
      });
      updateField("image", data.url);
      notify("✓ Rasm muvaffaqiyatli qirqildi va yuklandi.", "success");
    } catch (error) {
      notify("Xatolik: " + error.message, "error");
    }
    setMediaUploading(false);
  }

  // Auto-save draft
  useEffect(() => {
    if (activeTab !== "editor" || !form.title) return;
    const interval = setInterval(() => {
      const draftKey = `yk-draft-${editingId || 'new'}`;
      localStorage.setItem(draftKey, JSON.stringify({
        form,
        savedAt: new Date().toISOString(),
        lang
      }));
      notify("💾 Qoralama saqlandi", "info", 1500);
    }, 30000);
    return () => clearInterval(interval);
  }, [activeTab, form, editingId, lang]);

  // Restore draft
  useEffect(() => {
    if (activeTab === "editor" && !editingId) {
      const draft = localStorage.getItem('yk-draft-new');
      if (draft) {
        const { form: savedForm, savedAt } = JSON.parse(draft);
        const minutesAgo = Math.floor((Date.now() - new Date(savedAt).getTime()) / 60000);
        if (minutesAgo < 60 && window.confirm(`💾 ${minutesAgo} daqiqa oldingi qoralama topildi. Tiklashni xohlaysizmi?`)) {
          setForm(savedForm);
        }
      }
    }
  }, [activeTab, editingId]);

  const categories = useMemo(() => {
    if (lang === "uz") return siteConfig.categoriesUz || ["Siyosat", "Iqtisod", "Texnologiya", "Sport", "Madaniyat", "Tahlil"];
    if (lang === "uzk") return siteConfig.categoriesUzk || ["Сиёсат", "Иқтисод", "Технология", "Спорт", "Маданият", "Таҳлил"];
    return siteConfig.categoriesRu || ["Политика", "Экономика", "Технологии", "Спорт", "Культура", "Аналитика"];
  }, [lang, siteConfig]);

  // Initialize Home settings form
  useEffect(() => {
    if (siteConfig) {
      setHomeConfig({
        siteName: siteConfig.siteName || "Ishonch.uz",
        logoUrl: siteConfig.logoUrl || "/uploads/logo.svg",
        descriptionUz: siteConfig.descriptionUz || "",
        descriptionRu: siteConfig.descriptionRu || "",
        descriptionUzk: siteConfig.descriptionUzk || "",
        brandColor: siteConfig.brandColor || "#c31932",
        bannerText: siteConfig.bannerText || "",
        bannerActive: siteConfig.bannerActive || false
      });
    }
  }, [siteConfig]);

  async function loadMedia() {
    try {
      const res = await fetch("/api/admin/media", { credentials: "same-origin" });
      const data = await res.json();
      setMediaFiles(data.media || []);
    } catch {}
  }

  async function uploadMediaFile(file) {
    if (!file) return;
    setMediaUploading(true);
    try {
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
          if (data.url) { await loadMedia(); notify("✓ Fayl yuklandi.", "success"); }
          else notify(data.error || "Xatolik", "error");
        } catch { notify("Yuklashda xatolik", "error"); }
          setMediaUploading(false);
      };
      reader.readAsDataURL(file);
    } catch { setMediaUploading(false); }
  }

  async function deleteMedia(name) {
    if (!confirm(`"${name}" ni o'chirasizmi?`)) return;
    try {
      await fetch(`/api/admin/media/${name}`, { method: "DELETE", credentials: "same-origin" });
      await loadMedia();
      notify("✓ O'chirildi.", "success");
    } catch { notify("Xatolik", "error"); }
  }

  async function saveConfig(updatedConfig = siteConfig) {
    try {
      notify("⏳ Sozlamalar saqlanmoqda...", "info");
      const configToSave = {
        pinnedHeroId,
        pinnedSideIds,
        ads,
        ...updatedConfig
      };
      const data = await api("/api/admin/config", {
        method: "PUT",
        body: JSON.stringify({ config: configToSave })
      });
      setSiteConfig(configToSave);
      notify("✓ Barcha sozlamalar muvaffaqiyatli saqlandi!", "success");
    } catch (e) {
      notify("Sozlamalarni saqlashda xatolik: " + e.message, "error");
    }
  }

  function copyUrl(url) {
    navigator.clipboard.writeText(window.location.origin + url).then(() => {
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(""), 2000);
    });
  }

  function handleSelectHero(storyId) {
    setPinnedHeroId(storyId);
    saveConfig({ ...siteConfig, pinnedHeroId: storyId });
  }

  function handleSelectSide(newList) {
    setPinnedSideIds(newList);
    saveConfig({ ...siteConfig, pinnedSideIds: newList });
  }

  function handleUpdateAds(newList) {
    setAds(newList);
    saveConfig({ ...siteConfig, ads: newList });
  }

  function notify(text, type = "info", timeout = 4000) {
    setMessage(text);
    setMsgType(type);
    setTimeout(() => setMessage(""), timeout);
    if ("Notification" in window && Notification.permission === "granted" && document.hidden) {
      new Notification("Ishonch.uz Admin", {
        body: text,
        icon: "📰",
        tag: type,
      });
    }
  }

  function requestNotificationPermission() {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }

  const [adStats, setAdStats] = useState({});
  async function loadAdStats() {
    try {
      const data = await api("/api/admin/ads/stats");
      setAdStats(data.adStats || {});
    } catch (e) {}
  }

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (loggedIn) {
      loadMedia();
      loadAdStats();
      loadAllAdminCollections();
    }
  }, [loggedIn, activeTab]);

  useEffect(() => {
    setForm((current) => ({ ...current, category: categories.includes(current.category) ? current.category : categories[0] }));
  }, [lang]);

  async function api(path, options = {}) {
    const response = await fetch(path, {
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options,
    });
    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const data = isJson ? await response.json().catch(() => ({})) : {};
    if (!isJson) throw new Error("Server API mavjud emas");
    if (!response.ok) throw new Error(data.error || "Server xatosi");
    return data;
  }

  function loadUzkStories() {
    return JSON.parse(localStorage.getItem("yk-uzk-stories") || "[]");
  }

  function saveUzkStories(list) {
    localStorage.setItem("yk-uzk-stories", JSON.stringify(list));
  }

  async function loadAdminStories() {
    const data = await api("/api/admin/stories");
    setAllStories(prev => ({ ...prev, ...data.stories, uzk: loadUzkStories() }));
  }

  async function checkSession() {
    try {
      const data = await api("/api/admin/session");
      setLoggedIn(data.authenticated);
      if (data.authenticated) await loadAdminStories();
    } catch (error) {
      setLoggedIn(false);
    } else {
      setLoading(false);
    }
  }

  async function login(event) {
    event.preventDefault();
    try {
      await api("/api/admin/login", { method: "POST", body: JSON.stringify({ password }) });
      setLoggedIn(true);
      notify("Admin panelga xush kelibsiz! ", "success");
      setPassword("");
      requestNotificationPermission();
      await loadAdminStories();
    } catch (error) {
      const staticMessage = "Netlify static hostingda admin panel saqlash funksiyalari ishlamaydi. Admin uchun Node server yoki serverless backend kerak.";
      notify(error.message === "Server API mavjud emas" || error.message.includes("Netlify static hostingda") ? staticMessage : `${error.message}. Standart parol: ${DEFAULT_PASSWORD}`, "error");
    }
  }

  async function logout() {
    await api("/api/admin/logout", { method: "POST", body: "{}" }).catch(() => null);
    setLoggedIn(false);
    await refreshPublicStories();
    notify("Tizimdan chiqildi.", "info");
  }

  function validateForm(f) {
    const errs = {};
    if (!f.title.trim()) errs.title = "Sarlavha kiritish shart!";
    else if (f.title.trim().length < 5) errs.title = "Sarlavha kamida 5 belgi bo'lsin";
    if (!f.summary.trim()) errs.summary = "Qisqa mazmun kiritish shart!";
    else if (f.summary.trim().length < 10) errs.summary = "Mazmun kamida 10 belgi bo'lsin";
    if (!f.body.trim() || f.body === "<p></p>" || f.body === "<p><br></p>") errs.body = "Maqola matni kiritish shart!";
    return errs;
  }

  function updateField(field, value) {
    setIsDirty(true);
    setForm((current) => {
      const newForm = { ...current, [field]: value };
      if (field === 'title' && !current.slug) {
        newForm.slug = generateSlug(value);
      }
      if (formErrors[field]) {
        const errs = validateForm(newForm);
        setFormErrors(prev => ({ ...prev, [field]: errs[field] || null }));
      }
      setFormHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(newForm);
        if (newHistory.length > maxHistory) newHistory.shift();
        return newHistory;
      });
      setHistoryIndex(prev => Math.min(prev + 1, maxHistory - 1));
      return newForm;
    });
  }

  function undo() {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      setHistoryIndex(newIdx);
      setForm(formHistory[newIdx]);
      notify("↩️ Bekor qilindi", "info", 1000);
    }
  }
  function redo() {
    if (historyIndex < formHistory.length - 1) {
      const newIdx = historyIndex + 1;
      setHistoryIndex(newIdx);
      setForm(formHistory[newIdx]);
      notify("↪️ Qayta qilindi", "info", 1000);
    }
  }

  // Keyboard shortcuts + beforeunload
  useEffect(() => {
    function onKey(e) {
      if (!loggedIn) return;
      const inInput = ["INPUT","TEXTAREA","SELECT"].includes(e.target.tagName) || e.target.isContentEditable;
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (activeTab === "editor") document.getElementById("story-form")?.requestSubmit();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        if (isDirty && !window.confirm("O'zgarishlar saqlanmagan. Yangi maqolaga o'tishni xohlaysizmi?")) return;
        resetForm(); setActiveTab("editor");
      }
      if (activeTab !== "editor" || inInput) return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        e.shiftKey ? redo() : undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    }
    function onBeforeUnload(e) {
      if (isDirty && activeTab === "editor") {
        e.preventDefault();
        e.returnValue = "O'zgarishlar saqlanmagan. Sahifadan chiqishni xohlaysizmi?";
      }
    }
    window.addEventListener('keydown', onKey);
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [activeTab, historyIndex, formHistory, isDirty, loggedIn]);

  function handleImageFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCropSrc(reader.result);
      setCropSliders({ x: 0, y: 0, scale: 100 });
    };
    reader.readAsDataURL(file);
  }

  function resetForm() {
    setEditingId(null);
    setForm({ ...emptyStory, category: categories[0], image: images.newsroom });
    setFormErrors({});
    setIsDirty(false);
  }

  function duplicateStory(story) {
    const dupl = { ...story, id: undefined, title: story.title + " (nusxa)", status: "draft" };
    setForm(dupl);
    setEditingId(null);
    setActiveTab("editor");
    setIsDirty(true);
    notify("📋 Maqola nusxalandi — tahrirlash rejimi", "info");
  }

  function exportStories(format) {
    if (format === "json") {
      const blob = new Blob([JSON.stringify(stories, null, 2)], { type: "application/json" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
      a.download = `ishonch_uz-${lang}-${new Date().toISOString().slice(0,10)}.json`; a.click();
    } else {
      const cols = ["id","title","category","status","author","views","time"];
      const rows = stories.map(s => cols.map(c => `"${String(s[c]||"").replace(/"/g,'""')}"`).join(","));
      const csv = [cols.join(","), ...rows].join("\n");
      const blob = new Blob(["\uFEFF"+csv], { type: "text/csv;charset=utf-8" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
      a.download = `ishonch_uz-${lang}-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    }
    notify(`✓ ${format.toUpperCase()} sifatida yuklandi`, "success");
  }

  async function saveStory(event) {
    event.preventDefault();
    const errs = validateForm(form);
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      notify("⚠️ Iltimos, xatolarni to'g'irlang", "error");
      const firstErr = Object.keys(errs)[0];
      document.querySelector(`[data-field="${firstErr}"]`)?.scrollIntoView({ behavior:"smooth", block:"center" });
      return;
    }
    setFormErrors({});

    const payload = {
      ...form,
      title: form.title.trim(),
      summary: form.summary.trim(),
      body: form.body.trim(),
      author: form.author.trim() || "Ishonch.uz tahririyati",
      time: form.time.trim() || "Hozir",
      read: form.read.trim() || "3 daqiqa",
      image: form.image || images.newsroom,
      script: lang === "uzk" ? "cyrillic" : (form.script || "latin"),
    };

    try {
      const data = editingId
        ? await api(`/api/admin/stories/${adminLang}/${editingId}`, { method: "PUT", body: JSON.stringify({ story: payload }) })
        : await api("/api/admin/stories", { method: "POST", body: JSON.stringify({ lang: adminLang, story: payload }) });
      const newUzk = lang === "uzk" ? (data.stories?.uz || []) : (allStories.uzk || []);
      saveUzkStories(newUzk);
      setAllStories(prev => ({
        ...prev,
        ...data.stories,
        uzk: newUzk,
      }));
      if (form.isHero) {
        const savedId = editingId || (data.stories?.[adminLang]?.[0]?.id);
        if (savedId) setPinnedHeroId(savedId);
      }
      resetForm();
      setActiveTab("list");
      localStorage.removeItem(`yk-draft-${editingId || 'new'}`);
      notify(editingId ? "✓ Maqola yangilandi." : "✓ Yangi maqola qo'shildi.", "success");
    } catch (error) {
      notify(error.message, "error");
    }
  }

  function editStory(story) {
    setEditingId(story.id);
    setForm({ ...emptyStory, ...story });
    setActiveTab("editor");
    notify("Tahrirlash rejimi yoqildi.", "info");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteStory(id) {
    if (!confirm("Maqolani o'chirishni tasdiqlaysizmi?")) return;
    try {
      const data = await api(`/api/admin/stories/${adminLang}/${id}`, { method: "DELETE" });
      const newUzk = lang === "uzk" ? (data.stories?.uz || []) : (allStories.uzk || []);
      saveUzkStories(newUzk);
      setAllStories(prev => ({ ...prev, ...data.stories, uzk: newUzk }));
      if (editingId === id) resetForm();
      notify("Maqola o'chirildi.", "info");
    } catch (error) {
      notify(error.message, "error");
    }
  }

  async function changeStatus(story, status) {
    try {
      const data = await api(`/api/admin/stories/${adminLang}/${story.id}`, {
        method: "PUT",
        body: JSON.stringify({ story: { ...story, status } }),
      });
      const newUzk = lang === "uzk" ? (data.stories?.uz || []) : (allStories.uzk || []);
      saveUzkStories(newUzk);
      setAllStories(prev => ({ ...prev, ...data.stories, uzk: newUzk }));
      notify(status === "published" ? "✓ Maqola chop etildi." : "Qoralamaga o'tkazildi.", "success");
    } catch (error) {
      notify(error.message, "error");
    }
  }

  async function changePassword(event) {
    event.preventDefault();
    if (newPassword.trim().length < 6) {
      notify("Parol kamida 6 ta belgidan iborat bo'lsin.", "error");
      return;
    }
    try {
      await api("/api/admin/password", { method: "POST", body: JSON.stringify({ password: newPassword.trim() }) });
      setNewPassword("");
      notify("✓ Parol yangilandi.", "success");
    } catch (error) {
      notify(error.message, "error");
    }
  }

  async function resetContent() {
    if (!confirm("Demo maqolalar tiklanadi. Davom etamizmi?")) return;
    try {
      const data = await api("/api/admin/reset", { method: "POST", body: "{}" });
      setAllStories(prev => ({ ...prev, ...data.stories, uzk: data.stories.uz || prev.uzk || [] }));
      resetForm();
      notify("✓ Demo maqolalar tiklandi.", "success");
    } catch (error) {
      notify(error.message, "error");
    }
  }

  // --- 🆕 NEW CRUD OPERATIONS ---
  // Quotes CRUD
  async function saveQuote(e) {
    e.preventDefault();
    if (!quoteForm.text.trim()) return notify("Iqtibos matni shart", "error");
    try {
      if (editingQuoteId) {
        await api(`/api/admin/quotes/${editingQuoteId}`, { method: "PUT", body: JSON.stringify(quoteForm) });
        notify("✓ Iqtibos yangilandi", "success");
      } else {
        await api("/api/admin/quotes", { method: "POST", body: JSON.stringify(quoteForm) });
        notify("✓ Yangi iqtibos qo'shildi", "success");
      }
      setQuoteForm(EMPTY_QUOTE);
      setEditingQuoteId(null);
      loadAllAdminCollections();
    } catch (e) { notify(e.message, "error"); }
  }

  async function deleteQuote(id) {
    if (!confirm("Ushbu iqtibosni o'chirasizmi?")) return;
    try {
      await api(`/api/admin/quotes/${id}`, { method: "DELETE" });
      notify("✓ O'chirildi", "success");
      loadAllAdminCollections();
    } catch (e) { notify(e.message, "error"); }
  }

  // Journals CRUD
  async function saveJournal(e) {
    e.preventDefault();
    if (!journalForm.title.trim()) return notify("Jurnal nomi shart", "error");
    try {
      if (editingJournalId) {
        await api(`/api/admin/journals/${editingJournalId}`, { method: "PUT", body: JSON.stringify(journalForm) });
        notify("✓ Jurnal yangilandi", "success");
      } else {
        await api("/api/admin/journals", { method: "POST", body: JSON.stringify(journalForm) });
        notify("✓ Yangi jurnal qo'shildi", "success");
      }
      setJournalForm(EMPTY_JOURNAL);
      setEditingJournalId(null);
      loadAllAdminCollections();
    } catch (e) { notify(e.message, "error"); }
  }

  async function deleteJournal(id) {
    if (!confirm("Ushbu jurnal sonini o'chirasizmi?")) return;
    try {
      await api(`/api/admin/journals/${id}`, { method: "DELETE" });
      notify("✓ Jurnal o'chirildi", "success");
      loadAllAdminCollections();
    } catch (e) { notify(e.message, "error"); }
  }

  // Authors CRUD
  async function saveAuthor(e) {
    e.preventDefault();
    if (!authorForm.name.trim()) return notify("Muallif ismi shart", "error");
    try {
      if (editingAuthorId) {
        await api(`/api/admin/authors/${editingAuthorId}`, { method: "PUT", body: JSON.stringify(authorForm) });
        notify("✓ Muallif ma'lumoti yangilandi", "success");
      } else {
        await api("/api/admin/authors", { method: "POST", body: JSON.stringify(authorForm) });
        notify("✓ Yangi muallif qo'shildi", "success");
      }
      setAuthorForm(EMPTY_AUTHOR);
      setEditingAuthorId(null);
      loadAllAdminCollections();
    } catch (e) { notify(e.message, "error"); }
  }

  async function deleteAuthor(id) {
    if (!confirm("Ushbu muallifni o'chirasizmi?")) return;
    try {
      await api(`/api/admin/authors/${id}`, { method: "DELETE" });
      notify("✓ Muallif o'chirildi", "success");
      loadAllAdminCollections();
    } catch (e) { notify(e.message, "error"); }
  }

  // Pages CRUD
  async function savePage(e) {
    e.preventDefault();
    if (!pageForm.title.trim()) return notify("Sahifa sarlavhasi shart", "error");
    if (!pageForm.slug.trim()) return notify("Sahifa slugi shart", "error");
    try {
      if (editingPageId) {
        await api(`/api/admin/pages/${editingPageId}`, { method: "PUT", body: JSON.stringify(pageForm) });
        notify("✓ Sahifa yangilandi", "success");
      } else {
        await api("/api/admin/pages", { method: "POST", body: JSON.stringify(pageForm) });
        notify("✓ Yangi sahifa qo'shildi", "success");
      }
      setPageForm(EMPTY_PAGE);
      setEditingPageId(null);
      loadAllAdminCollections();
    } catch (e) { notify(e.message, "error"); }
  }

  async function deletePage(id) {
    if (!confirm("Ushbu sahifani o'chirasizmi?")) return;
    try {
      await api(`/api/admin/pages/${id}`, { method: "DELETE" });
      notify("✓ Sahifa o'chirildi", "success");
      loadAllAdminCollections();
    } catch (e) { notify(e.message, "error"); }
  }

  // Comments moderation
  async function approveComment(comment) {
    try {
      await api(`/api/admin/comments/${comment.id}`, { method: "PUT", body: JSON.stringify({ ...comment, status: "approved" }) });
      notify("✓ Izoh tasdiqlandi", "success");
      loadAllAdminCollections();
    } catch (e) { notify(e.message, "error"); }
  }

  async function rejectComment(comment) {
    try {
      await api(`/api/admin/comments/${comment.id}`, { method: "PUT", body: JSON.stringify({ ...comment, status: "rejected" }) });
      notify("Izoh rad etildi", "info");
      loadAllAdminCollections();
    } catch (e) { notify(e.message, "error"); }
  }

  async function deleteComment(id) {
    if (!confirm("Izohni o'chirasizmi?")) return;
    try {
      await api(`/api/admin/comments/${id}`, { method: "DELETE" });
      notify("✓ Izoh o'chirildi", "success");
      loadAllAdminCollections();
    } catch (e) { notify(e.message, "error"); }
  }

  // Messages management
  async function markMessageRead(msg) {
    try {
      await api(`/api/admin/messages/${msg.id}`, { method: "PUT", body: JSON.stringify({ ...msg, isRead: true }) });
      loadAllAdminCollections();
    } catch (e) {}
  }

  async function deleteMessage(id) {
    if (!confirm("Xabarni o'chirasizmi?")) return;
    try {
      await api(`/api/admin/messages/${id}`, { method: "DELETE" });
      notify("✓ Xabar o'chirildi", "success");
      loadAllAdminCollections();
    } catch (e) { notify(e.message, "error"); }
  }

  // Newsletter sending
  async function sendNewsletter(e) {
    e.preventDefault();
    if (!newsletterForm.subject.trim() || !newsletterForm.body.trim()) {
      return notify("Mavzu va matn shart", "error");
    }
    notify("⏳ Xabar yuborilmoqda...", "info");
    try {
      const data = await api("/api/admin/newsletter/send", { method: "POST", body: JSON.stringify(newsletterForm) });
      notify(`✓ Ommaviy xat muvaffaqiyatli yuborildi! Jami ${data.sentCount} ta qabul qiluvchi.`, "success");
      setNewsletterForm(EMPTY_NEWSLETTER);
      loadAllAdminCollections();
    } catch (e) { notify(e.message, "error"); }
  }

  // Subscribers management
  async function deleteSubscriber(id) {
    if (!confirm("Ushbu emailni obuna ro'yxatidan o'chirasizmi?")) return;
    try {
      await api(`/api/admin/subscribers/${id}`, { method: "DELETE" });
      notify("✓ Obunachi o'chirildi", "success");
      loadAllAdminCollections();
    } catch (e) { notify(e.message, "error"); }
  }

  // Payments management
  async function deletePayment(id) {
    if (!confirm("To'lov logini o'chirasizmi?")) return;
    try {
      await api(`/api/admin/payments/${id}`, { method: "DELETE" });
      notify("✓ To'lov logi o'chirildi", "success");
      loadAllAdminCollections();
    } catch (e) { notify(e.message, "error"); }
  }

  // Home Config save
  async function saveHomeConfig(e) {
    e.preventDefault();
    try {
      await saveConfig({
        ...siteConfig,
        siteName: homeConfig.siteName,
        logoUrl: homeConfig.logoUrl,
        descriptionUz: homeConfig.descriptionUz,
        descriptionRu: homeConfig.descriptionRu,
        descriptionUzk: homeConfig.descriptionUzk,
        brandColor: homeConfig.brandColor,
        bannerText: homeConfig.bannerText,
        bannerActive: homeConfig.bannerActive
      });
      if (homeConfig.brandColor) {
        document.documentElement.style.setProperty("--brand", homeConfig.brandColor);
      }
    } catch (e) {
      notify("Xato: " + e.message, "error");
    }
  }

  // Categories config save
  const [categoriesFormText, setCategoriesFormText] = useState({
    uz: "",
    ru: "",
    uzk: ""
  });

  useEffect(() => {
    if (siteConfig) {
      setCategoriesFormText({
        uz: (siteConfig.categoriesUz || []).join(", "),
        ru: (siteConfig.categoriesRu || []).join(", "),
        uzk: (siteConfig.categoriesUzk || []).join(", ")
      });
    }
  }, [siteConfig, activeTab]);

  async function saveCategoriesConfig(e) {
    e.preventDefault();
    const uzList = categoriesFormText.uz.split(",").map(c => c.trim()).filter(Boolean);
    const ruList = categoriesFormText.ru.split(",").map(c => c.trim()).filter(Boolean);
    const uzkList = categoriesFormText.uzk.split(",").map(c => c.trim()).filter(Boolean);
    if (!uzList.length || !ruList.length) {
      return notify("Kamida bitta kategoriya kiritish shart", "error");
    }
    try {
      await saveConfig({
        ...siteConfig,
        categoriesUz: uzList,
        categoriesRu: ruList,
        categoriesUzk: uzkList
      });
    } catch (e) {
      notify("Xato: " + e.message, "error");
    }
  }

  const published = stories.filter(s => s.status === "published").length;
  const drafts = stories.filter(s => s.status === "draft").length;
  const uzTotal = allStories ? (allStories.uz || []).length : 0;
  const uzkTotal = allStories ? (allStories.uzk || []).length : 0;

  const filteredStories = stories
    .filter(s => {
      const matchCat = filterCat === "all" || s.category === filterCat;
      const matchStatus = filterStatus === "all" || s.status === filterStatus;
      const matchQ = !searchQ || `${s.title} ${s.summary} ${s.category}`.toLowerCase().includes(searchQ.toLowerCase());
      return matchCat && matchStatus && matchQ;
    })
    .sort((a, b) => sortOrder === "newest" ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id));

  const topStories = [...stories].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

  // Translate menu labels dynamically
  const menuLabels = {
    uz: {
      stats: "Boshqaruv paneli",
      home_view: "Bosh sahifa sozlamalari",
      quotes: "Iqtiboslar",
      featured: "Muhim maqolalar",
      list: "Maqolalar ro'yxati",
      news: "Tezkor xabarlar",
      editor: "Yangi maqola",
      categories: "Ruknlar",
      journals: "Jurnal sonlari",
      messages: "Foydalanuvchilar xatlari",
      comments: "Maqola izohlari",
      tags: "Teglar",
      pages: "Statik sahifalar",
      media: "Media kutubxonasi",
      authors: "Mualliflar",
      subscribers: "Obunachilar",
      newsletter: "Ommaviy xat",
      payments: "Xayriya va to'lovlar",
      settings: "Tizim sozlamalari"
    },
    uzk: {
      stats: "Бошқарув панели",
      home_view: "Бош саҳифа созламалари",
      quotes: "Иқтибослар",
      featured: "Муҳим мақолалар",
      list: "Мақолалар рўйхати",
      news: "Тезкор хабарлар",
      editor: "Янги мақола",
      categories: "Рукнлар",
      journals: "Журнал сонлари",
      messages: "Фойдаланувчилар хатлари",
      comments: "Мақола изоҳлари",
      tags: "Теглар",
      pages: "Статик саҳифалар",
      media: "Медиа кутубхонаси",
      authors: "Муаллифлар",
      subscribers: "Обуначилар",
      newsletter: "Оммавий хат",
      payments: "Хайрия ва тўловлар",
      settings: "Тизим созламалари"
    },
    ru: {
      stats: "Панель управления",
      home_view: "Настройки главной",
      quotes: "Цитаты",
      featured: "Важные статьи",
      list: "Список статей",
      news: "Бегущая строка",
      editor: "Новая статья",
      categories: "Рубрики",
      journals: "Выпуски журнала",
      messages: "Письма пользователей",
      comments: "Комментарии",
      tags: "Теги",
      pages: "Статические страницы",
      media: "Медиатека",
      authors: "Авторы",
      subscribers: "Подписчики",
      newsletter: "Рассылка писем",
      payments: "Пожертвования и платежи",
      settings: "Настройки системы"
    }
  };

  const labels = menuLabels[lang] || menuLabels.uz;

  const menuIcons = {
    stats: "📊",
    home_view: "🏠",
    quotes: "💬",
    featured: "⭐",
    list: "📋",
    news: "⚡",
    editor: "✏️",
    categories: "📁",
    journals: "📚",
    messages: "✉️",
    comments: "💬",
    tags: "🏷️",
    pages: "📄",
    media: "🖼️",
    authors: "✍️",
    subscribers: "👥",
    newsletter: "📧",
    payments: "💳",
    settings: "⚙️"
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
        <p>Sessiya tekshirilmoqda...</p>
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className="admin-login-wrap">
        <div className="admin-login-box">
          <div className="admin-login-logo">
            <Logo height={42} />
            <div>
              <strong>Ishonch.uz CMS</strong>
              <span>Boshqaruv paneli</span>
            </div>
          </div>
          <form onSubmit={login}>
            <h2>Tizimga kirish</h2>
            <p>Maqolalarni boshqarish uchun admin parolni kiriting.</p>
            <div className="admin-input-group">
              <span className="admin-input-icon">🔒</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Parolni kiriting..."
                autoFocus
              />
            </div>
            <button className="admin-login-btn" type="submit">Kirish →</button>
            {message && <div className={`admin-notify ${msgType}`}>{message}</div>}
          </form>
          <p className="admin-login-hint">Standart parol: <code>admin2026</code></p>
        </div>
      </div>
    );
  }

  return (
    <div className="adm-wrap">
      {message && <div className={`adm-toast ${msgType}`}>{message}</div>}

      <aside className="adm-sidebar" style={{overflowY: "auto", maxHeight: "100vh"}}>
        <div className="adm-sidebar-logo">
          <Logo height={32} />
          <div>
            <strong>Ishonch.uz</strong>
            <span>CMS Panel</span>
          </div>
        </div>

        <div className="adm-lang-switch">
          <button className={lang === "uzk" ? "active" : ""} onClick={() => setLang("uzk")}>
            🇺🇿 {"\u040e\u0417"} <span>{uzkTotal}</span>
          </button>
        </div>

        <nav className="adm-nav" style={{display: "flex", flexDirection: "column", gap: "2px"}}>
          {Object.keys(labels).map((tabKey) => (
            <button
              key={tabKey}
              className={activeTab === tabKey ? "active" : ""}
              onClick={() => setActiveTab(tabKey)}
              style={{display: "flex", alignItems: "center", width: "100%", textAlign: "left"}}
            >
              <span style={{marginRight: "8px"}}>{menuIcons[tabKey]}</span> {labels[tabKey]}
              {tabKey === "list" && <span className="adm-nav-count">{stories.length}</span>}
              {tabKey === "media" && mediaFiles.length > 0 && <span className="adm-nav-count">{mediaFiles.length}</span>}
              {tabKey === "messages" && messagesList.filter(m => !m.isRead).length > 0 && (
                <span className="adm-nav-count" style={{background: "var(--brand)"}}>{messagesList.filter(m => !m.isRead).length}</span>
              )}
              {tabKey === "comments" && comments.filter(c => c.status === "pending").length > 0 && (
                <span className="adm-nav-count" style={{background: "var(--gold)", color: "#000"}}>{comments.filter(c => c.status === "pending").length}</span>
              )}
              {tabKey === "subscribers" && subscribers.length > 0 && <span className="adm-nav-count">{subscribers.length}</span>}
            </button>
          ))}
        </nav>

        <div className="adm-sidebar-stats">
          <div className="adm-stat-item">
            <strong>{stories.length}</strong>
            <span>Jami</span>
          </div>
          <div className="adm-stat-item published">
            <strong>{published}</strong>
            <span>Chop etilgan</span>
          </div>
        </div>
        <button className="adm-logout" onClick={logout}>← Chiqish</button>
      </aside>

      <main className="adm-main" style={{padding: "20px", overflowY: "auto", flex: 1}}>
        <header className="adm-header">
          <div>
            <h1>{labels[activeTab]}</h1>
            <p>Til: <strong>{lang.toUpperCase()}</strong> · Barcha o'zgarishlar server bazasida saqlanadi</p>
          </div>
          <div className="adm-header-actions">
            {activeTab === "list" && (
              <>
                <button className="adm-btn ghost" onClick={() => {
                  const data = { exportedAt: new Date().toISOString(), stories: allStories };
                  const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a'); a.href = url;
                  a.download = `ishonch_uz-backup-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                  notify("📤 Eksport yuklandi", "success");
                }}>📤 Eksport</button>
                <button className="adm-btn ghost" onClick={() => importFileRef.current?.click()}>📥 Import</button>
                <input type="file" ref={importFileRef} accept=".json" style={{display:"none"}} onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const text = await file.text();
                    const data = JSON.parse(text);
                    if (data.stories) {
                      if (confirm(`📥 ${file.name} dan ${Object.values(data.stories).flat().length} ta maqola yuklansinmi?`)) {
                        setAllStories(data.stories);
                        notify("📥 Import muvaffaqiyatli", "success");
                      }
                    }
                  } catch(err) {
                    notify("❌ Xato: Fayl noto'g'ri format", "error");
                  }
                  e.target.value = '';
                }} />
                <button className="adm-btn ghost" onClick={resetContent}>↺ Demo tiklash</button>
                <button className="adm-btn primary" onClick={() => { resetForm(); setActiveTab("editor"); }}>+ Yangi maqola</button>
              </>
            )}
            {activeTab === "editor" && (
              <>
                <button className="adm-btn ghost" type="button" onClick={() => { resetForm(); setActiveTab("list"); }}>← Ortga</button>
                <button className="adm-btn ghost" type="button" onClick={undo} disabled={historyIndex <= 0} title="Ctrl+Z">↩️ Undo</button>
                <button className="adm-btn ghost" type="button" onClick={redo} disabled={historyIndex >= formHistory.length - 1} title="Ctrl+Y">↪️ Redo</button>
                <button className="adm-btn primary" type="submit" form="story-form">{editingId ? "✓ Yangilash" : "+ Qo'shish"}</button>
              </>
            )}
            {activeTab === "media" && (
              <>
                <button className="adm-btn ghost" onClick={() => loadMedia()}>↺ Yangilash</button>
                <button className="adm-btn primary" onClick={() => mediaFileRef.current?.click()}>
                  {mediaUploading ? "⏳ Yuklanmoqda..." : "+ Fayl yuklash"}
                </button>
                <input ref={mediaFileRef} type="file" accept="image/*,video/*" multiple style={{display:"none"}}
                  onChange={e => { Array.from(e.target.files).forEach(f => uploadMediaFile(f)); e.target.value=""; }}
                />
              </>
            )}
          </div>
        </header>

        {/* --- 📊 TAB: STATS --- */}
        {activeTab === "stats" && (
          <div className="adm-dashboard">
            <div className="adm-dash-cards">
              <div className="adm-dash-card blue">
                <span className="adm-dash-icon">📰</span>
                <div>
                  <StatNum value={stories.length} />
                  <span>Maqolalar ({lang.toUpperCase()})</span>
                </div>
              </div>
              <div className="adm-dash-card green">
                <span className="adm-dash-icon">💬</span>
                <div>
                  <StatNum value={comments.filter(c => c.status === "approved").length} />
                  <span>Tasdiqlangan izohlar</span>
                </div>
              </div>
              <div className="adm-dash-card yellow">
                <span className="adm-dash-icon">✉️</span>
                <div>
                  <StatNum value={messagesList.length} />
                  <span>Xabarlar (Aloqa)</span>
                </div>
              </div>
              <div className="adm-dash-card purple">
                <span className="adm-dash-icon">👥</span>
                <div>
                  <StatNum value={subscribers.length} />
                  <span>Newsletter obunachilar</span>
                </div>
              </div>
            </div>

            <div className="adm-dash-grid">
              <div className="adm-dash-section full-width">
                <h3>📈 So'nggi 7 kunlik ko'rishlar trafigi</h3>
                {(() => {
                  const baseViews = stories.reduce((sum, s) => sum + (s.views || 0), 0) || 1250;
                  const lineData = [
                    Math.round(baseViews * 0.45),
                    Math.round(baseViews * 0.52),
                    Math.round(baseViews * 0.68),
                    Math.round(baseViews * 0.61),
                    Math.round(baseViews * 0.79),
                    Math.round(baseViews * 0.92),
                    baseViews
                  ];
                  const maxVal = Math.max(...lineData) || 100;
                  const points = lineData.map((val, i) => {
                    const x = 45 + i * (435 / 6);
                    const y = 160 - (val / maxVal) * 130;
                    return { x, y, val };
                  });
                  const pathD = `M ${points.map(p => `${p.x} ${p.y}`).join(" L ")}`;
                  const areaD = `${pathD} L ${points[6].x} 160 L ${points[0].x} 160 Z`;
                  
                  return (
                    <div className="adm-svg-chart-container">
                      <svg viewBox="0 0 500 200" className="adm-svg-line-chart">
                        <defs>
                          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.3"/>
                            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0.0"/>
                          </linearGradient>
                        </defs>
                        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
                          const y = 160 - p * 130;
                          const valLabel = Math.round(p * maxVal);
                          return (
                            <g key={i}>
                              <line x1="45" y1={y} x2="480" y2={y} stroke="var(--line)" strokeWidth="1" strokeDasharray="3,3" />
                              <text x="35" y={y + 4} fontSize="9" fill="var(--muted)" textAnchor="end">{valLabel}</text>
                            </g>
                          );
                        })}
                        <path d={areaD} fill="url(#chartGrad)" />
                        <path d={pathD} fill="none" stroke="var(--brand)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        {points.map((p, i) => (
                          <g key={i} className="chart-dot-group">
                            <circle cx={p.x} cy={p.y} r="5" fill="var(--surface)" stroke="var(--brand)" strokeWidth="2.5" />
                            <circle cx={p.x} cy={p.y} r="8" fill="transparent" style={{cursor:"pointer"}} />
                            <text x={p.x} y={p.y - 10} fontSize="9" fontWeight="700" fill="var(--ink)" textAnchor="middle" className="chart-tooltip-text">{p.val}</text>
                          </g>
                        ))}
                      </svg>
                    </div>
                  );
                })()}
              </div>

              <div className="adm-dash-section">
                <h3>🏆 Eng ko'p o'qilgan maqolalar</h3>
                {stories.some(s => s.views > 0) ? (
                  <table className="adm-table" style={{width:"100%"}}>
                    <thead>
                      <tr><th>Sarlavha</th><th>Rukn</th><th>Ko'rishlar</th></tr>
                    </thead>
                    <tbody>
                      {[...stories].filter(s=>s.views>0).sort((a,b) => (b.views||0)-(a.views||0)).slice(0,5).map((s) => (
                        <tr key={s.id}>
                          <td style={{fontWeight:600}}>{s.title.slice(0, 30)}...</td>
                          <td><span className="adm-item-cat">{s.category}</span></td>
                          <td style={{fontWeight:700, color:"var(--brand)"}}>👁 {s.views}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{color:"var(--muted)", textAlign:"center", padding:"20px"}}>O'qilgan maqolalar yo'q</p>
                )}
              </div>

              <div className="adm-dash-section">
                <h3>💳 Moliyaviy xayriyalar ({payments.length} ta)</h3>
                {payments.length > 0 ? (
                  <div>
                    <h2 style={{color: "var(--brand)", marginBottom: "12px"}}>
                      {payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()} UZS
                    </h2>
                    <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                      {payments.slice(0, 4).map(p => (
                        <div key={p.id} style={{display:"flex", justifyContent:"space-between", fontSize:12, paddingBottom:6, borderBottom:"1px solid var(--line)"}}>
                          <span><strong>{p.name}</strong> ({p.description})</span>
                          <span style={{fontWeight:700}}>{p.amount.toLocaleString()} {p.currency}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p style={{color:"var(--muted)", textAlign:"center", padding:"20px"}}>Hozircha xayriyalar yo'q</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- 🏠 TAB: HOME_VIEW --- */}
        {activeTab === "home_view" && (
          <div className="adm-dash-section">
            <h3>Bosh sahifa vizual elementlarini sozlash</h3>
            <form onSubmit={saveHomeConfig} className="adm-form" style={{maxWidth: "600px"}}>
              <label>
                Sayt Nomi
                <input value={homeConfig.siteName} onChange={e => setHomeConfig({...homeConfig, siteName: e.target.value})} />
              </label>
              <label>
                Sayt Logotipi URL manzili
                <input value={homeConfig.logoUrl} onChange={e => setHomeConfig({...homeConfig, logoUrl: e.target.value})} />
              </label>
              <label>
                Sayt tavsifi (O'zbekcha)
                <textarea rows="2" value={homeConfig.descriptionUz} onChange={e => setHomeConfig({...homeConfig, descriptionUz: e.target.value})} />
              </label>
              <label>
                Sayt tavsifi (Ruscha)
                <textarea rows="2" value={homeConfig.descriptionRu} onChange={e => setHomeConfig({...homeConfig, descriptionRu: e.target.value})} />
              </label>
              <label>
                Sayt tavsifi (Kirillcha)
                <textarea rows="2" value={homeConfig.descriptionUzk} onChange={e => setHomeConfig({...homeConfig, descriptionUzk: e.target.value})} />
              </label>
              <label>
                Brand Rangi
                <input type="color" value={homeConfig.brandColor} onChange={e => setHomeConfig({...homeConfig, brandColor: e.target.value})} style={{height: "40px", padding: "2px", width: "100%"}} />
              </label>
              <div style={{display: "flex", gap: "10px", margin: "16px 0"}}>
                <input type="checkbox" id="bannerActiveCheck" checked={homeConfig.bannerActive} onChange={e => setHomeConfig({...homeConfig, bannerActive: e.target.checked})} style={{width:"20px", height:"20px"}} />
                <label htmlFor="bannerActiveCheck" style={{marginBottom:0, cursor:"pointer"}}>Yuqoridagi e'lonlar bannerini yoqish</label>
              </div>
              {homeConfig.bannerActive && (
                <label>
                  E'lon matni
                  <input value={homeConfig.bannerText} onChange={e => setHomeConfig({...homeConfig, bannerText: e.target.value})} placeholder="Tezkor xabar yoki e'lon..." />
                </label>
              )}
              <button className="adm-btn primary" type="submit">Sozlamalarni saqlash</button>
            </form>
          </div>
        )}

        {/* --- 💬 TAB: QUOTES --- */}
        {activeTab === "quotes" && (
          <div className="adm-dash-grid" style={{gridTemplateColumns: "1fr 2fr"}}>
            <div className="adm-dash-section">
              <h3>{editingQuoteId ? "Iqtibosni tahrirlash" : "Yangi iqtibos qo'shish"}</h3>
              <form onSubmit={saveQuote} className="adm-form">
                <label>
                  Iqtibos matni
                  <textarea rows="4" value={quoteForm.text} onChange={e => setQuoteForm({...quoteForm, text: e.target.value})} placeholder="Hikmatli so'z yoki iqtibos matni..." required />
                </label>
                <label>
                  Muallif
                  <input value={quoteForm.author} onChange={e => setQuoteForm({...quoteForm, author: e.target.value})} placeholder="Masalan: Alisher Navoiy" required />
                </label>
                <label>
                  Holati
                  <select value={quoteForm.status} onChange={e => setQuoteForm({...quoteForm, status: e.target.value})}>
                    <option value="active">Faol (Saytda ko'rinadi)</option>
                    <option value="inactive">Nofaol</option>
                  </select>
                </label>
                <div style={{display: "flex", gap: "10px", marginTop: "10px"}}>
                  <button className="adm-btn primary" type="submit">{editingQuoteId ? "Saqlash" : "Qo'shish"}</button>
                  {editingQuoteId && (
                    <button className="adm-btn ghost" type="button" onClick={() => { setEditingQuoteId(null); setQuoteForm(EMPTY_QUOTE); }}>Bekor qilish</button>
                  )}
                </div>
              </form>
            </div>

            <div className="adm-dash-section">
              <h3>Barcha iqtiboslar ({quotes.length} ta)</h3>
              <table className="adm-table" style={{width: "100%"}}>
                <thead>
                  <tr>
                    <th>Iqtibos</th>
                    <th>Muallif</th>
                    <th>Holat</th>
                    <th>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map(q => (
                    <tr key={q.id}>
                      <td>{q.text.slice(0, 60)}...</td>
                      <td><strong>{q.author}</strong></td>
                      <td>
                        <span className={`adm-status ${q.status === 'active' ? 'published' : 'draft'}`}>
                          {q.status === 'active' ? "Faol" : "Nofaol"}
                        </span>
                      </td>
                      <td>
                        <button className="adm-btn ghost" onClick={() => { setEditingQuoteId(q.id); setQuoteForm(q); }} style={{padding: "4px 8px", marginRight: "4px"}}>✏️</button>
                        <button className="adm-btn danger" onClick={() => deleteQuote(q.id)} style={{padding: "4px 8px"}}>✕</button>
                      </td>
                    </tr>
                  ))}
                  {quotes.length === 0 && (
                    <tr><td colSpan="4" style={{textAlign:"center", color:"var(--muted)"}}>Hozircha iqtiboslar yo'q</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- ⭐ TAB: FEATURED --- */}
        {activeTab === "featured" && (
          <div className="adm-dash-section" style={{maxWidth: "700px"}}>
            <h3>Muhim (qatirilgan) maqolalarni sozlash</h3>
            <p style={{color:"var(--muted)", fontSize:"13px", marginBottom:"20px"}}>
              Bosh sahifaning eng yuqori qismida ko'rsatiladigan bosh maqola (Hero) va yon paneldagi muhim xabarlarni tanlang.
            </p>
            <div className="adm-form">
              <label>
                Asosiy maqola (Hero Story)
                <select value={pinnedHeroId} onChange={e => handleSelectHero(e.target.value)}>
                  <option value="">-- Tizim tomonidan avtomatik tanlash --</option>
                  {stories.map(s => (
                    <option key={s.id} value={s.id}>[{s.category}] {s.title.slice(0, 60)}...</option>
                  ))}
                </select>
              </label>

              <div style={{marginTop: "24px"}}>
                <h4>Yon paneldagi 3 ta muhim maqola</h4>
                <div style={{display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px"}}>
                  {[0, 1, 2].map(index => (
                    <label key={index}>
                      {index + 1}-maqola
                      <select
                        value={pinnedSideIds[index] || ""}
                        onChange={e => {
                          const newList = [...pinnedSideIds];
                          if (e.target.value) newList[index] = e.target.value;
                          else newList.splice(index, 1);
                          handleSelectSide(newList.filter(Boolean));
                        }}
                      >
                        <option value="">-- Avtomatik tanlash --</option>
                        {stories.map(s => (
                          <option key={s.id} value={s.id}>[{s.category}] {s.title.slice(0, 60)}...</option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- 📁 TAB: CATEGORIES --- */}
        {activeTab === "categories" && (
          <div className="adm-dash-section" style={{maxWidth: "600px"}}>
            <h3>Ruknlar (Kategoriyalar) ro'yxatini tahrirlash</h3>
            <p style={{color: "var(--muted)", fontSize: 13, marginBottom: 15}}>
              Kategoriyalarni vergul bilan ajratib yozing. Ular sayt menyusi va maqola yozish oynasida paydo bo'ladi.
            </p>
            <form onSubmit={saveCategoriesConfig} className="adm-form">
              <label>
                Kategoriyalar (Lotin tilida)
                <input value={categoriesFormText.uz} onChange={e => setCategoriesFormText({...categoriesFormText, uz: e.target.value})} placeholder="Siyosat, Iqtisod, Sport..." />
              </label>
              <label>
                Kategoriyalar (Rus tilida)
                <input value={categoriesFormText.ru} onChange={e => setCategoriesFormText({...categoriesFormText, ru: e.target.value})} placeholder="Политика, Экономика, Спорт..." />
              </label>
              <label>
                Kategoriyalar (Kirill tilida)
                <input value={categoriesFormText.uzk} onChange={e => setCategoriesFormText({...categoriesFormText, uzk: e.target.value})} placeholder="Сиёсат, Иқтисод, Спорт..." />
              </label>
              <button className="adm-btn primary" type="submit" style={{marginTop: 10}}>Ruknlarni saqlash</button>
            </form>
          </div>
        )}

        {/* --- 📚 TAB: JOURNALS --- */}
        {activeTab === "journals" && (
          <div className="adm-dash-grid" style={{gridTemplateColumns: "1fr 2fr"}}>
            <div className="adm-dash-section">
              <h3>{editingJournalId ? "Jurnalni tahrirlash" : "Yangi jurnal qo'shish"}</h3>
              <form onSubmit={saveJournal} className="adm-form">
                <label>
                  Jurnal nomi / Soni
                  <input value={journalForm.title} onChange={e => setJournalForm({...journalForm, title: e.target.value})} placeholder="Masalan: Ishonch 2026 yil 1-son" required />
                </label>
                <label>
                  Muqova rasm URL manzili
                  <input value={journalForm.coverUrl} onChange={e => setJournalForm({...journalForm, coverUrl: e.target.value})} placeholder="https://..." />
                </label>
                <label>
                  PDF fayl URL manzili
                  <input value={journalForm.pdfUrl} onChange={e => setJournalForm({...journalForm, pdfUrl: e.target.value})} placeholder="https://... yoki /uploads/jurnal.pdf" required />
                </label>
                <label>
                  Chop etilgan sana
                  <input type="date" value={journalForm.publishDate} onChange={e => setJournalForm({...journalForm, publishDate: e.target.value})} required />
                </label>
                <div style={{display: "flex", gap: "10px", marginTop: "10px"}}>
                  <button className="adm-btn primary" type="submit">{editingJournalId ? "Saqlash" : "Qo'shish"}</button>
                  {editingJournalId && (
                    <button className="adm-btn ghost" type="button" onClick={() => { setEditingJournalId(null); setJournalForm(EMPTY_JOURNAL); }}>Bekor qilish</button>
                  )}
                </div>
              </form>
            </div>

            <div className="adm-dash-section">
              <h3>Yuklangan jurnallar ({journals.length} ta)</h3>
              <table className="adm-table" style={{width: "100%"}}>
                <thead>
                  <tr>
                    <th>Muqova</th>
                    <th>Nomi</th>
                    <th>Chop etilgan sana</th>
                    <th>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {journals.map(j => (
                    <tr key={j.id}>
                      <td>
                        {j.coverUrl ? (
                          <img src={j.coverUrl} alt="" style={{width: "40px", height: "55px", objectFit: "cover", borderRadius: "2px"}} />
                        ) : (
                          <span style={{fontSize: "24px"}}>📘</span>
                        )}
                      </td>
                      <td>
                        <strong>{j.title}</strong>
                        <div style={{fontSize: "11px", color: "var(--muted)"}}>
                          <a href={j.pdfUrl} target="_blank">PDF yuklab olish</a>
                        </div>
                      </td>
                      <td>{j.publishDate}</td>
                      <td>
                        <button className="adm-btn ghost" onClick={() => { setEditingJournalId(j.id); setJournalForm(j); }} style={{padding: "4px 8px", marginRight: "4px"}}>✏️</button>
                        <button className="adm-btn danger" onClick={() => deleteJournal(j.id)} style={{padding: "4px 8px"}}>✕</button>
                      </td>
                    </tr>
                  ))}
                  {journals.length === 0 && (
                    <tr><td colSpan="4" style={{textAlign:"center", color:"var(--muted)"}}>Hozircha jurnallar yuklanmagan</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- ✉️ TAB: MESSAGES --- */}
        {activeTab === "messages" && (
          <div className="adm-dash-section">
            <h3>Foydalanuvchilarning aloqa xatlari ({messagesList.length} ta)</h3>
            <div style={{display: "flex", flexDirection: "column", gap: "15px", marginTop: "15px"}}>
              {messagesList.map(msg => (
                <div key={msg.id} style={{
                  padding: "15px",
                  border: "1px solid var(--line)",
                  borderRadius: "8px",
                  background: msg.isRead ? "var(--surface)" : "rgba(14, 95, 242, 0.05)",
                  position: "relative"
                }}>
                  {!msg.isRead && (
                    <span style={{
                      position: "absolute",
                      top: "15px",
                      right: "15px",
                      background: "var(--brand)",
                      color: "white",
                      fontSize: "10px",
                      padding: "2px 6px",
                      borderRadius: "10px",
                      fontWeight: 700
                    }}>Yangi</span>
                  )}
                  <div style={{fontSize: "13px", color: "var(--muted)", marginBottom: "5px"}}>
                    Sana: <strong>{new Date(msg.createdAt).toLocaleString("uz-UZ")}</strong> |
                    Kimdan: <strong>{msg.name}</strong> ({msg.email})
                  </div>
                  <h4 style={{margin: "5px 0 10px", color: "var(--ink)"}}>Mavzu: {msg.subject || "Mavzusiz"}</h4>
                  <p style={{margin: 0, fontSize: "14px", lineHeight: "1.6", color: "var(--ink)", background: "var(--bg)", padding: "10px", borderRadius: "4px"}}>
                    {msg.message}
                  </p>
                  <div style={{marginTop: "10px", display: "flex", gap: "10px"}}>
                    {!msg.isRead && (
                      <button className="adm-btn primary" onClick={() => markMessageRead(msg)} style={{padding: "6px 12px", fontSize: "12px"}}>✓ O'qilgan deb belgilash</button>
                    )}
                    <button className="adm-btn danger" onClick={() => deleteMessage(msg.id)} style={{padding: "6px 12px", fontSize: "12px"}}>✕ O'chirish</button>
                  </div>
                </div>
              ))}
              {messagesList.length === 0 && (
                <p style={{color: "var(--muted)", textAlign: "center", padding: "40px"}}>Hozircha xabarlar yo'q.</p>
              )}
            </div>
          </div>
        )}

        {/* --- 💬 TAB: COMMENTS --- */}
        {activeTab === "comments" && (
          <div className="adm-dash-section">
            <h3>Izohlarni moderatsiya qilish ({comments.length} ta)</h3>
            <table className="adm-table" style={{width: "100%", marginTop: "15px"}}>
              <thead>
                <tr>
                  <th>Kimdan</th>
                  <th>Izoh matni</th>
                  <th>Maqola</th>
                  <th>Holat</th>
                  <th>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {comments.map(c => {
                  let statusText = "Kutilmoqda";
                  let statusClass = "draft";
                  if (c.status === "approved") { statusText = "Tasdiqlangan"; statusClass = "published"; }
                  if (c.status === "rejected") { statusText = "Rad etilgan"; statusClass = "gray"; }

                  return (
                    <tr key={c.id}>
                      <td><strong>{c.name}</strong><br/><small style={{color:"var(--muted)"}}>{new Date(c.createdAt).toLocaleDateString()}</small></td>
                      <td style={{maxWidth: "250px"}}>{c.text}</td>
                      <td><small>{c.storyId}</small></td>
                      <td>
                        <span className={`adm-status ${statusClass}`}>{statusText}</span>
                      </td>
                      <td>
                        {c.status !== "approved" && (
                          <button className="adm-btn primary" onClick={() => approveComment(c)} style={{padding: "4px 8px", marginRight: "4px", fontSize: "12px"}}>✓ Ruxsat</button>
                        )}
                        {c.status !== "rejected" && (
                          <button className="adm-btn ghost" onClick={() => rejectComment(c)} style={{padding: "4px 8px", marginRight: "4px", fontSize: "12px"}}>✕ Rad etish</button>
                        )}
                        <button className="adm-btn danger" onClick={() => deleteComment(c.id)} style={{padding: "4px 8px", fontSize: "12px"}}>O'chirish</button>
                      </td>
                    </tr>
                  );
                })}
                {comments.length === 0 && (
                  <tr><td colSpan="5" style={{textAlign:"center", color:"var(--muted)", padding:"20px"}}>Hozircha izohlar yo'q</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* --- 🏷️ TAB: TAGS --- */}
        {activeTab === "tags" && (
          <div className="adm-dash-section">
            <h3>Tehlar boshqaruvi</h3>
            <p style={{color: "var(--muted)", fontSize: 13, marginBottom: 15}}>
              Tizimdagi barcha maqolalarga tegishli teglar hamda ulardan foydalanilgan maqolalar soni.
            </p>
            {(() => {
              const tagCounts = {};
              stories.forEach(s => {
                const tagsList = (s.tags || "").split(",").map(t => t.trim().toLowerCase()).filter(Boolean);
                tagsList.forEach(t => {
                  tagCounts[t] = (tagCounts[t] || 0) + 1;
                });
              });
              const tagsArray = Object.keys(tagCounts).sort((a,b) => tagCounts[b] - tagCounts[a]);

              return (
                <div style={{display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "15px"}}>
                  {tagsArray.map(t => (
                    <span key={t} className="chip" style={{fontSize: "14px", padding: "6px 12px", background: "var(--surface)", border: "1px solid var(--line)"}}>
                      🏷️ {t} <strong style={{marginLeft: "5px", color: "var(--brand)"}}>{tagCounts[t]}</strong>
                    </span>
                  ))}
                  {tagsArray.length === 0 && (
                    <p style={{color: "var(--muted)"}}>Hozircha teglar mavjud emas. Maqola yozishda teglar kiriting.</p>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* --- 📄 TAB: PAGES --- */}
        {activeTab === "pages" && (
          <div className="adm-dash-grid" style={{gridTemplateColumns: "1fr 2fr"}}>
            <div className="adm-dash-section">
              <h3>{editingPageId ? "Sahifani tahrirlash" : "Yangi statik sahifa"}</h3>
              <form onSubmit={savePage} className="adm-form">
                <label>
                  Sahifa nomi (Title)
                  <input value={pageForm.title} onChange={e => setPageForm({...pageForm, title: e.target.value})} placeholder="Masalan: Tahririyat haqida" required />
                </label>
                <label>
                  Slug (URL)
                  <input value={pageForm.slug} onChange={e => setPageForm({...pageForm, slug: e.target.value})} placeholder="tahririyat-haqida" required />
                </label>
                <label>
                  Sahifa matni (HTML / Plain text)
                  <textarea rows="8" value={pageForm.body} onChange={e => setPageForm({...pageForm, body: e.target.value})} placeholder="Sahifa kontenti..." required />
                </label>
                <label>
                  Holat
                  <select value={pageForm.status} onChange={e => setPageForm({...pageForm, status: e.target.value})}>
                    <option value="published">Chop etilgan</option>
                    <option value="draft">Qoralama</option>
                  </select>
                </label>
                <div style={{display: "flex", gap: "10px", marginTop: "10px"}}>
                  <button className="adm-btn primary" type="submit">{editingPageId ? "Saqlash" : "Yaratish"}</button>
                  {editingPageId && (
                    <button className="adm-btn ghost" type="button" onClick={() => { setEditingPageId(null); setPageForm(EMPTY_PAGE); }}>Bekor qilish</button>
                  )}
                </div>
              </form>
            </div>

            <div className="adm-dash-section">
              <h3>Tizimdagi statik sahifalar ({pagesList.length} ta)</h3>
              <table className="adm-table" style={{width: "100%"}}>
                <thead>
                  <tr>
                    <th>Sarlavha</th>
                    <th>URL</th>
                    <th>Holat</th>
                    <th>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {pagesList.map(pg => (
                    <tr key={pg.id}>
                      <td><strong>{pg.title}</strong></td>
                      <td><code>/pages/{pg.slug}</code></td>
                      <td>
                        <span className={`adm-status ${pg.status === 'published' ? 'published' : 'draft'}`}>
                          {pg.status === 'published' ? "Chop etilgan" : "Qoralama"}
                        </span>
                      </td>
                      <td>
                        <button className="adm-btn ghost" onClick={() => { setEditingPageId(pg.id); setPageForm(pg); }} style={{padding: "4px 8px", marginRight: "4px"}}>✏️</button>
                        <button className="adm-btn danger" onClick={() => deletePage(pg.id)} style={{padding: "4px 8px"}}>✕</button>
                      </td>
                    </tr>
                  ))}
                  {pagesList.length === 0 && (
                    <tr><td colSpan="4" style={{textAlign:"center", color:"var(--muted)"}}>Hozircha statik sahifalar yaratilmagan</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- 🖼️ TAB: MEDIA --- */}
        {activeTab === "media" && (
          <div className="adm-media">
            <div className="adm-media-filters" style={{marginBottom: "15px", display: "flex", gap: "10px"}}>
              <button className={`chip ${mediaFilter === 'all' ? 'active' : ''}`} onClick={() => setMediaFilter('all')}>Hammasi</button>
              <button className={`chip ${mediaFilter === 'image' ? 'active' : ''}`} onClick={() => setMediaFilter('image')}>Rasmlar</button>
              <button className={`chip ${mediaFilter === 'video' ? 'active' : ''}`} onClick={() => setMediaFilter('video')}>Videolar</button>
            </div>
            
            <div className="adm-media-grid" style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "15px"}}>
              {mediaFiles
                .filter(f => mediaFilter === 'all' || f.type === mediaFilter)
                .map(file => (
                  <div key={file.name} style={{border: "1px solid var(--line)", borderRadius: "8px", overflow: "hidden", background: "var(--surface)", position: "relative"}}>
                    {file.type === "image" ? (
                      <img src={file.url} alt="" style={{width: "100%", height: "100px", objectFit: "cover"}} />
                    ) : (
                      <div style={{height: "100px", display: "flex", alignItems: "center", justifyContent: "center", background: "#000", color: "#fff", fontSize: "24px"}}>🎥</div>
                    )}
                    <div style={{padding: "8px", fontSize: "11px"}}>
                      <div style={{fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{file.name}</div>
                      <div style={{color: "var(--muted)", margin: "4px 0"}}>{(file.size / 1024).toFixed(1)} KB</div>
                      <div style={{display: "flex", gap: "5px", marginTop: "5px"}}>
                        <button className="adm-btn ghost" onClick={() => copyUrl(file.url)} style={{flex: 1, padding: "2px", fontSize: "10px"}}>
                          {copiedUrl === file.url ? "✓ Nusxalandi" : "🔗 Link"}
                        </button>
                        <button className="adm-btn danger" onClick={() => deleteMedia(file.name)} style={{padding: "2px 6px", fontSize: "10px"}}>✕</button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* --- ✍️ TAB: AUTHORS --- */}
        {activeTab === "authors" && (
          <div className="adm-dash-grid" style={{gridTemplateColumns: "1fr 2fr"}}>
            <div className="adm-dash-section">
              <h3>{editingAuthorId ? "Muallif ma'lumotini tahrirlash" : "Yangi muallif qo'shish"}</h3>
              <form onSubmit={saveAuthor} className="adm-form">
                <label>
                  Ism Familiya
                  <input value={authorForm.name} onChange={e => setAuthorForm({...authorForm, name: e.target.value})} placeholder="Masalan: Dilnoza Karimova" required />
                </label>
                <label>
                  Lavozimi / Roli
                  <input value={authorForm.role} onChange={e => setAuthorForm({...authorForm, role: e.target.value})} placeholder="Masalan: Tahririyat muharriri" required />
                </label>
                <label>
                  Avatar rasmi URL manzili
                  <input value={authorForm.avatar} onChange={e => setAuthorForm({...authorForm, avatar: e.target.value})} placeholder="https://..." />
                </label>
                <label>
                  Qisqacha bio (Ma'lumot)
                  <textarea rows="3" value={authorForm.bio} onChange={e => setAuthorForm({...authorForm, bio: e.target.value})} placeholder="Muallif haqida qisqacha ma'lumot..." />
                </label>
                <label>
                  Holati
                  <select value={authorForm.status} onChange={e => setAuthorForm({...authorForm, status: e.target.value})}>
                    <option value="active">Faol</option>
                    <option value="inactive">Nofaol</option>
                  </select>
                </label>
                <div style={{display: "flex", gap: "10px", marginTop: "10px"}}>
                  <button className="adm-btn primary" type="submit">{editingAuthorId ? "Saqlash" : "Qo'shish"}</button>
                  {editingAuthorId && (
                    <button className="adm-btn ghost" type="button" onClick={() => { setEditingAuthorId(null); setAuthorForm(EMPTY_AUTHOR); }}>Bekor qilish</button>
                  )}
                </div>
              </form>
            </div>

            <div className="adm-dash-section">
              <h3>Jamoa a'zolari (Mualliflar) ({authors.length} ta)</h3>
              <table className="adm-table" style={{width: "100%"}}>
                <thead>
                  <tr>
                    <th>Avatar</th>
                    <th>Ism</th>
                    <th>Roli</th>
                    <th>Holat</th>
                    <th>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {authors.map(a => (
                    <tr key={a.id}>
                      <td>
                        <img src={a.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"} alt="" style={{width: "36px", height: "36px", borderRadius: "50%", objectFit:"cover"}} />
                      </td>
                      <td><strong>{a.name}</strong></td>
                      <td>{a.role}</td>
                      <td>
                        <span className={`adm-status ${a.status === 'active' ? 'published' : 'draft'}`}>
                          {a.status === 'active' ? "Faol" : "Nofaol"}
                        </span>
                      </td>
                      <td>
                        <button className="adm-btn ghost" onClick={() => { setEditingAuthorId(a.id); setAuthorForm(a); }} style={{padding: "4px 8px", marginRight: "4px"}}>✏️</button>
                        <button className="adm-btn danger" onClick={() => deleteAuthor(a.id)} style={{padding: "4px 8px"}}>✕</button>
                      </td>
                    </tr>
                  ))}
                  {authors.length === 0 && (
                    <tr><td colSpan="5" style={{textAlign:"center", color:"var(--muted)"}}>Hozircha mualliflar ro'yxati shakllantirilmagan</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- 👥 TAB: SUBSCRIBERS --- */}
        {activeTab === "subscribers" && (
          <div className="adm-dash-section">
            <h3>Newsletter yangiliklariga obuna bo'lganlar ({subscribers.length} ta email)</h3>
            <table className="adm-table" style={{width: "100%", marginTop: "15px"}}>
              <thead>
                <tr>
                  <th>Email manzil</th>
                  <th>Holati</th>
                  <th>Obuna sanasi</th>
                  <th>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map(sub => (
                  <tr key={sub.id}>
                    <td><strong>{sub.email}</strong></td>
                    <td>
                      <span className="adm-status published">{sub.status}</span>
                    </td>
                    <td>{new Date(sub.createdAt).toLocaleString("uz-UZ")}</td>
                    <td>
                      <button className="adm-btn danger" onClick={() => deleteSubscriber(sub.id)}>✕ O'chirish</button>
                    </td>
                  </tr>
                ))}
                {subscribers.length === 0 && (
                  <tr><td colSpan="4" style={{textAlign:"center", color:"var(--muted)", padding:"20px"}}>Obunachilar mavjud emas</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* --- 📧 TAB: NEWSLETTER --- */}
        {activeTab === "newsletter" && (
          <div className="adm-dash-grid" style={{gridTemplateColumns: "1fr 1fr"}}>
            <div className="adm-dash-section">
              <h3>Obunachilarga ommaviy xat yo'llash</h3>
              <p style={{color: "var(--muted)", fontSize: 13, marginBottom: 15}}>
                Ushbu oyna orqali xat yo'llasangiz, u tizimda ro'yxatdan o'tgan barcha <strong>{subscribers.filter(s => s.status === "subscribed").length} ta faol obunachiga</strong> simulated ravishda jo'natiladi.
              </p>
              <form onSubmit={sendNewsletter} className="adm-form">
                <label>
                  Xat mavzusi (Subject)
                  <input value={newsletterForm.subject} onChange={e => setNewsletterForm({...newsletterForm, subject: e.target.value})} placeholder="Masalan: Ishonch.uz haftalik muhim yangiliklari" required />
                </label>
                <label>
                  Xat matni (Body)
                  <textarea rows="8" value={newsletterForm.body} onChange={e => setNewsletterForm({...newsletterForm, body: e.target.value})} placeholder="Xat mazmuni..." required />
                </label>
                <button className="adm-btn primary" type="submit" style={{marginTop: 10}}>Send Newsletter ✉️</button>
              </form>
            </div>

            <div className="adm-dash-section">
              <h3>Yuborilgan xabarlar tarixi ({newsletterHistory.length} ta)</h3>
              <div style={{display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px"}}>
                {newsletterHistory.map(nl => (
                  <div key={nl.id} style={{padding: "12px", border: "1px solid var(--line)", borderRadius: "6px", background: "var(--surface)"}}>
                    <div style={{fontWeight: 700, fontSize: "14px"}}>{nl.subject}</div>
                    <div style={{fontSize: "11px", color: "var(--muted)", marginTop: "4px"}}>
                      Sana: {new Date(nl.createdAt).toLocaleString("uz-UZ")} | Qabul qiluvchilar: <strong>{nl.sentCount} ta</strong>
                    </div>
                    <p style={{margin: "8px 0 0", fontSize: "12.5px", color: "var(--ink)", background: "var(--bg)", padding: "6px", borderRadius: "3px"}}>
                      {nl.body.slice(0, 150)}...
                    </p>
                  </div>
                ))}
                {newsletterHistory.length === 0 && (
                  <p style={{color: "var(--muted)", textAlign:"center", padding:"20px"}}>Yuborilgan xatlar tarixi bo'sh</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- 💳 TAB: PAYMENTS --- */}
        {activeTab === "payments" && (
          <div className="adm-dash-section">
            <h3>Xayriyalar va qo'llab-quvvatlashlar reyestri</h3>
            <div style={{display: "flex", gap: "20px", marginBottom: "20px"}}>
              <div style={{padding: "15px", border: "1px solid var(--line)", borderRadius: "8px", background: "var(--surface)", flex: 1}}>
                <div style={{fontSize: "12px", color: "var(--muted)"}}>Jami Xayriya miqdori</div>
                <h2 style={{color: "var(--brand)", margin: "5px 0 0"}}>
                  {payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()} UZS
                </h2>
              </div>
              <div style={{padding: "15px", border: "1px solid var(--line)", borderRadius: "8px", background: "var(--surface)", flex: 1}}>
                <div style={{fontSize: "12px", color: "var(--muted)"}}>Tranzaksiyalar soni</div>
                <h2 style={{color: "var(--blue)", margin: "5px 0 0"}}>{payments.length} ta</h2>
              </div>
            </div>

            <table className="adm-table" style={{width: "100%"}}>
              <thead>
                <tr>
                  <th>Kimdan</th>
                  <th>Miqdori</th>
                  <th>Tavsif (Loyiha)</th>
                  <th>Sana</th>
                  <th>Holat</th>
                  <th>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.name}</strong><br/><small style={{color:"var(--muted)"}}>{p.email}</small></td>
                    <td style={{fontWeight: 700}}>{p.amount.toLocaleString()} {p.currency}</td>
                    <td>{p.description}</td>
                    <td>{new Date(p.createdAt).toLocaleString("uz-UZ")}</td>
                    <td>
                      <span className="adm-status published">✓ Muvaffaqiyatli</span>
                    </td>
                    <td>
                      <button className="adm-btn danger" onClick={() => deletePayment(p.id)} style={{padding: "4px 8px"}}>✕</button>
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr><td colSpan="6" style={{textAlign:"center", color:"var(--muted)", padding:"20px"}}>Hozircha to'lovlar reyestri bo'sh</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* --- ⚡ TAB: NEWS --- */}
        {activeTab === "news" && (
          <div className="adm-dash-section" style={{maxWidth: "600px"}}>
            <h3>Tezkor xabarlar (Breaking News Banner) sozlamalari</h3>
            <p style={{color: "var(--muted)", fontSize: 13, marginBottom: 15}}>
              Ushbu bo'limda yozilgan e'lon yoki tezkor xabar sayt bosh sahifasining eng yuqori qismida yuguruvchi satr shaklida ko'rinadi.
            </p>
            <form onSubmit={saveHomeConfig} className="adm-form">
              <div style={{display: "flex", gap: "10px", margin: "10px 0"}}>
                <input type="checkbox" id="newsBannerCheck" checked={homeConfig.bannerActive} onChange={e => setHomeConfig({...homeConfig, bannerActive: e.target.checked})} style={{width:"20px", height:"20px"}} />
                <label htmlFor="newsBannerCheck" style={{marginBottom:0, cursor:"pointer"}}>Tezkor xabar satrini yoqish</label>
              </div>
              {homeConfig.bannerActive && (
                <label>
                  Tezkor xabar matni
                  <input value={homeConfig.bannerText} onChange={e => setHomeConfig({...homeConfig, bannerText: e.target.value})} placeholder="Tezkor xabar matnini kiriting..." required />
                </label>
              )}
              <button className="adm-btn primary" type="submit" style={{marginTop: 10}}>Tezkor xabarni saqlash</button>
            </form>
          </div>
        )}

        {/* --- 📋 TAB: LIST --- */}
        {activeTab === "list" && (
          <div className="adm-list">
            <div className="adm-filters">
              <div className="adm-search-wrap">
                <span>🔍</span>
                <input
                  type="search"
                  placeholder="Sarlavha, mazmun bo'yicha qidirish..."
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                />
              </div>
              <select value={filterCat} onChange={e => setFilterCat(e.target.value)}>
                <option value="all">Barcha kategoriyalar</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="all">Barcha holat</option>
                <option value="published">Chop etilgan</option>
                <option value="draft">Qoralama</option>
              </select>
              <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                <option value="newest">Eng yangi</option>
                <option value="oldest">Eng eski</option>
              </select>
              <span className="adm-filter-count">{filteredStories.length} ta</span>
              <div className="adm-export-btns">
                <button className="adm-btn ghost" title="JSON yuklab olish" onClick={() => exportStories("json")}>⬇ JSON</button>
                <button className="adm-btn ghost" title="CSV yuklab olish" onClick={() => exportStories("csv")}>⬇ CSV</button>
              </div>
            </div>

            {selectedIds.size > 0 && (
              <div className="adm-bulk-bar active">
                <div className="adm-bulk-bar-inner">
                  <span className="adm-bulk-count">📱 {selectedIds.size} ta tanlandi</span>
                  <div className="adm-bulk-buttons">
                    <button className="adm-btn primary" onClick={async () => {
                      notify("Chop etilmoqda...", "info");
                      for (const id of selectedIds) {
                        const story = stories.find(s => s.id === id);
                        if (story) await changeStatus(story, "published");
                      }
                      setSelectedIds(new Set());
                    }}>✓ Chop etish</button>
                    <button className="adm-btn ghost" onClick={async () => {
                      notify("Qoralama qilinmoqda...", "info");
                      for (const id of selectedIds) {
                        const story = stories.find(s => s.id === id);
                        if (story) await changeStatus(story, "draft");
                      }
                      setSelectedIds(new Set());
                    }}>◌ Draftga</button>
                    <button className="adm-btn danger" onClick={async () => {
                      if (confirm(`✕ Haqiqatan ham ${selectedIds.size} ta maqolani o'chirmoqchisiz?`)) {
                        notify("O'chirilmoqda...", "info");
                        for (const id of selectedIds) {
                          await deleteStory(id);
                        }
                        setSelectedIds(new Set());
                      }
                    }}>✕ O'chirish</button>
                  </div>
                  <button className="adm-bulk-close" onClick={() => setSelectedIds(new Set())}>✕</button>
                </div>
              </div>
            )}

            {filteredStories.length === 0 && (
              <div className="adm-empty">
                {searchQ || filterCat !== "all" || filterStatus !== "all"
                  ? "Filter bo'yicha maqola topilmadi."
                  : "Hozircha maqola yo'q. Yangi maqola qo'shing."}
              </div>
            )}
            {filteredStories.map((story) => {
              const storyReactions = JSON.parse(localStorage.getItem("yk-reactions") || "{}" )[story.id] || {};
              const {_mine, ...emojiCounts} = storyReactions;
              const reactionTotal = Object.values(emojiCounts).reduce((a,b) => a+(Number(b)||0), 0);
              return (
              <article className="adm-item" key={story.id} style={{position:"relative"}}>
                <label style={{position:"absolute",top:8,left:8,zIndex:10,cursor:"pointer",padding:4,background:"rgba(255,255,255,0.9)",borderRadius:4}}>
                  <input 
                    type="checkbox" 
                    checked={selectedIds.has(story.id)}
                    onChange={(e) => {
                      const newSet = new Set(selectedIds);
                      if (e.target.checked) newSet.add(story.id);
                      else newSet.delete(story.id);
                      setSelectedIds(newSet);
                    }}
                    style={{width:18,height:18,cursor:"pointer"}}
                  />
                </label>
                <div className="adm-item-preview">
                  <img src={story.image} alt="" />
                  <div className="adm-item-preview-body">
                    <span className="kicker">{story.category}</span>
                    <p>{story.summary || "Mazmun yo'q"}</p>
                    <div style={{display:"flex",gap:10,fontSize:12,color:"var(--muted)",marginTop:6}}>
                      {story.views > 0 && <span>👁 {story.views}</span>}
                      {reactionTotal > 0 && <span>👍 {reactionTotal}</span>}
                    </div>
                  </div>
                </div>
                <img src={story.image} alt="" style={{marginLeft:32}} />
                <div className="adm-item-body">
                  <div className="adm-item-meta">
                    <span className={`adm-status ${story.status}`}>
                      {story.status === "published" ? (story.publishAt && story.publishAt > new Date().toISOString() ? "⏰ Rejalashtirilgan" : "✓ Chop etilgan") : "◌ Qoralama"}
                    </span>
                    <span className="adm-item-cat">{story.category}</span>
                    {reactionTotal > 0 && <span className="adm-reaction-badge">👍 {reactionTotal}</span>}
                    {(story.views||0) > 0 && <span className="adm-views-badge">👁 {story.views}</span>}
                  </div>
                  <h3>{story.title || "Sarlavhasiz"}</h3>
                  <p>{story.summary}</p>
                </div>
                <div className="adm-item-actions">
                  <button className="adm-btn ghost" onClick={() => editStory(story)}>✏ Tahrirlash</button>
                  <button className="adm-btn ghost" title="Nusxalash" onClick={() => duplicateStory(story)}>⧉</button>
                  <button
                    className={`adm-btn ${story.status === "published" ? "ghost" : "primary"}`}
                    onClick={() => changeStatus(story, story.status === "published" ? "draft" : "published")}
                  >
                    {story.status === "published" ? "⊙ Draft" : "✓ Chop et"}
                  </button>
                  <button className="adm-btn danger" onClick={() => deleteStory(story.id)}>✕</button>
                </div>
              </article>
              );
            })}
          </div>
        )}

        {/* --- ✏️ TAB: EDITOR --- */}
        {activeTab === "editor" && (
          <div className="adm-editor-wrap">
            <form id="story-form" className="adm-form" onSubmit={saveStory}>
              <div className="adm-form-grid">
                <div className="adm-form-left">
                  <div className="adm-form-row">
                    <label>
                      Kategoriya
                      <select value={form.category} onChange={(e) => updateField("category", e.target.value)}>
                        {categories.map((cat) => <option key={cat}>{cat}</option>)}
                      </select>
                    </label>
                    <label>
                      Holat
                      <select value={form.status} onChange={(e) => updateField("status", e.target.value)}>
                        <option value="published">Chop etilgan</option>
                        <option value="draft">Qoralama</option>
                      </select>
                    </label>
                  </div>
                  <label data-field="title">
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                      <span>Sarlavha <span className="req">*</span></span>
                      <div className="translit-btn-group" style={{display:"flex",gap:4}}>
                        <button type="button" className="translit-btn" onClick={() => updateField('title', convertText(form.title, true))}>🔄 Kirill</button>
                        <button type="button" className="translit-btn" onClick={() => updateField('title', convertText(form.title, false))}>🔄 Lotin</button>
                      </div>
                    </div>
                    <input
                      value={form.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      placeholder="Maqola sarlavhasi..."
                      className={formErrors.title ? "field-error" : ""}
                    />
                    <div className="field-footer">
                      {formErrors.title ? <span className="field-err-msg">⚠ {formErrors.title}</span> : <span/>}
                      <span className={`char-count ${form.title.length > 120 ? "over" : ""}`}>{form.title.length}/120</span>
                    </div>
                  </label>
                  <label data-field="slug">
                    URL slug (avtomatik yaratiladi)
                    <input
                      value={form.slug || ''}
                      onChange={(e) => updateField("slug", e.target.value)}
                      placeholder="news-sarlavha"
                    />
                  </label>
                  <label data-field="summary">
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                      <span>Qisqa mazmun <span className="req">*</span></span>
                      <div className="translit-btn-group" style={{display:"flex",gap:4}}>
                        <button type="button" className="translit-btn" onClick={() => updateField('summary', convertText(form.summary, true))}>🔄 Kirill</button>
                        <button type="button" className="translit-btn" onClick={() => updateField('summary', convertText(form.summary, false))}>🔄 Lotin</button>
                      </div>
                    </div>
                    <textarea rows="3" value={form.summary} onChange={(e) => updateField("summary", e.target.value)} placeholder="Qisqa tavsif..." className={formErrors.summary ? "field-error" : ""} />
                    <div className="field-footer">
                      {formErrors.summary ? <span className="field-err-msg">⚠ {formErrors.summary}</span> : <span/>}
                      <span className={`char-count ${form.summary.length > 200 ? "over" : ""}`}>{form.summary.length}/200</span>
                    </div>
                  </label>
                  <div className="adm-form-row">
                    <label>
                      Muallif
                      <select value={form.author} onChange={(e) => updateField("author", e.target.value)} style={{width: "100%"}}>
                        <option value="Ishonch.uz tahririyati">Ishonch.uz tahririyati (Tizim)</option>
                        {authors.filter(a => a.status === "active").map(a => (
                          <option key={a.id} value={a.name}>{a.name} ({a.role})</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      O'qish vaqti
                      <input value={form.read} onChange={(e) => updateField("read", e.target.value)} placeholder="3 daqiqa" />
                    </label>
                  </div>
                  <div className="adm-rich-label" data-field="body">
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4,width:"100%"}}>
                      <span>Maqola matni <span className="req">*</span>{formErrors.body && <span className="field-err-msg" style={{marginLeft:8}}>⚠ {formErrors.body}</span>}</span>
                      <div className="translit-btn-group" style={{display:"flex",gap:4}}>
                        <button type="button" className="translit-btn" onClick={() => updateField('body', convertText(form.body, true))}>🔄 Kirill</button>
                        <button type="button" className="translit-btn" onClick={() => updateField('body', convertText(form.body, false))}>🔄 Lotin</button>
                      </div>
                    </div>
                    <RichEditor
                      value={form.body}
                      onChange={(html) => updateField("body", html)}
                    />
                  </div>

                  <div className="adm-seo-section">
                    <div className="adm-seo-head">
                      <span>🔍 SEO sozlamalari</span>
                    </div>
                    <label>
                      Teglar
                      <input value={form.tags} onChange={e => updateField("tags", e.target.value)} placeholder="siyosat, iqtisod, yangilik (vergul bilan)" />
                    </label>
                    <label>
                      Meta sarlavha
                      <input value={form.metaTitle} onChange={e => updateField("metaTitle", e.target.value)} placeholder={form.title} />
                    </label>
                    <label>
                      Meta tavsif
                      <textarea rows="2" value={form.metaDesc} onChange={e => updateField("metaDesc", e.target.value)} placeholder={form.summary} />
                    </label>
                  </div>
                </div>

                <div className="adm-form-right">
                  <div className="adm-preview-box">
                    <h4>Ko'rinish</h4>
                    {form.image ? (
                      <img src={form.image} alt="" className="adm-preview-img" />
                    ) : (
                      <div className="adm-preview-placeholder">Rasm tanlanmagan</div>
                    )}
                    <span className={`adm-status ${form.status}`}>{form.status}</span>
                    <strong className="adm-preview-title">{form.title || "Sarlavha..."}</strong>
                    <p className="adm-preview-summary">{form.summary || "Qisqa mazmun..."}</p>
                  </div>
                  <label>
                    Rasm URL
                    <input value={form.image} onChange={(e) => updateField("image", e.target.value)} placeholder="https://..." />
                  </label>
                  <label className="adm-file-label">
                    <span>📎 Kompyuterdan yuklash</span>
                    <input type="file" accept="image/*" onChange={handleImageFile} />
                  </label>
                  <div className="adm-form-toggles">
                    <div className="adm-toggle-row">
                      <span>Asosiy maqola</span>
                      <label className="adm-toggle-switch">
                        <input type="checkbox" checked={!!form.isHero} onChange={e=>{
                          updateField("isHero", e.target.checked);
                          if (e.target.checked) setPinnedHeroId("");
                        }} />
                        <span className="adm-toggle-slider" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* --- ⚙️ TAB: SETTINGS --- */}
        {activeTab === "settings" && (
          <div className="adm-settings">
            <div className="adm-settings-grid" style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px"}}>
              <div className="adm-dash-section">
                <h3>Xavfsizlik sozlamalari</h3>
                <form onSubmit={changePassword} className="adm-form">
                  <label>
                    Yangi parol
                    <input
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Kamida 6 belgi..."
                      required
                    />
                  </label>
                  <button className="adm-btn primary" type="submit">Parolni yangilash</button>
                </form>
              </div>

              <div className="adm-dash-section">
                <h3>Tizim ma'lumotlari</h3>
                <div style={{fontSize: "14px", lineHeight: "1.8"}}>
                  <p>CMS Versiya: <strong>v2.0.0 (Upgraded)</strong></p>
                  <p>Ishlash tartibi: <strong>Node JS Backend + JSON DB</strong></p>
                  <p>Tillar: <strong>UZ (Lotin), ЎЗ (Кирилл), RU (Русский)</strong></p>
                  <p>Sessiya vaqti: <strong>12 soat</strong></p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --- CROPPER MODAL --- */}
      {cropSrc && (
        <div className="adm-crop-modal">
          <div className="adm-crop-content">
            <h3>Rasm o'lchamini moslashtirish (16:9)</h3>
            <div className="adm-crop-canvas-wrap">
              <canvas ref={cropCanvasRef} width="640" height="360" />
            </div>
            <div className="adm-crop-sliders">
              <div className="slider-row">
                <span>Scale:</span>
                <input type="range" min="50" max="250" value={cropSliders.scale} onChange={e => setCropSliders(p => ({ ...p, scale: Number(e.target.value) }))} />
                <span className="val">{cropSliders.scale}%</span>
              </div>
              <div className="slider-row">
                <span>Horizontal (X):</span>
                <input type="range" min="-50" max="50" value={cropSliders.x} onChange={e => setCropSliders(p => ({ ...p, x: Number(e.target.value) }))} />
                <span className="val">{cropSliders.x}</span>
              </div>
              <div className="slider-row">
                <span>Vertical (Y):</span>
                <input type="range" min="-50" max="50" value={cropSliders.y} onChange={e => setCropSliders(p => ({ ...p, y: Number(e.target.value) }))} />
                <span className="val">{cropSliders.y}</span>
              </div>
            </div>
            <div className="adm-crop-actions">
              <button type="button" className="adm-btn ghost" onClick={() => setCropSrc(null)}>✕ Bekor qilish</button>
              <button type="button" className="adm-btn primary" onClick={handleCropUpload}>✂️ Qirqish va Yuklash</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
