        </section>
      </div>
    </div>
  );
}

function AdminPanel({ lang, setLang, allStories, stories, setAllStories, refreshPublicStories, siteConfig, setSiteConfig, pinnedHeroId, setPinnedHeroId, pinnedSideIds, setPinnedSideIds, ads, setAds }) {
  const adminLang = lang === "uzk" ? "uz" : lang;
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
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
      .replace(/[ʻ'ʽ]/g, '') // O'zbek apostroflarini olib tashlash
      .replace(/[^a-z0-9\s-]/g, '') // Faqat harf, raqam, bo'shliq va tire
      .replace(/\s+/g, '-') // Bo'shliqni tirega almashtirish
      .replace(/-+/g, '-') // Ko'p tirelarni bitta tirega
      .replace(/^-|-$/g, ''); // Bosh va oxirgi tirelarni olib tashlash
  }
  const [msgType, setMsgType] = useState("info");
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("list");
  const [form, setForm] = useState({ ...emptyStory, category: lang !== "ru" ? "Siyosat" : "Политика" });
  // 🔄 Undo/Redo history
  const [formHistory, setFormHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const maxHistory = 20; // Охирги 20 та амал
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

  // 💾 Auto-save - har 30 sekundda qoralamani localStorage ga saqlash
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
    }, 30000); // 30 sekund
    return () => clearInterval(interval);
  }, [activeTab, form, editingId, lang]);

  // 🔄 Editor ochilganda draft ni tiklash
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
    // 🔔 Browser notification
    if ("Notification" in window && Notification.permission === "granted" && document.hidden) {
      new Notification("Ishonch.uz Admin", {
        body: text,
        icon: "📰",
        tag: type,
      });
    }
  }
  // 🔔 Notification permission so'rash
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
    } finally {
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
      requestNotificationPermission(); // 🔔 Notification so'rash
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

  function generateSlug(title) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[ʻ'ʽ]/g, '') // O'zbek apostroflarini olib tashlash
      .replace(/[^a-z0-9\s-]/g, '') // Faqat harf, raqam, bo'shliq va tire
      .replace(/\s+/g, '-') // Bo'shliqni tirega almashtirish
      .replace(/-+/g, '-') // Ko'p tirelarni bitta tirega
      .replace(/^-|-$/g, ''); // Bosh va oxirgi tirelarni olib tashlash
  }

  function updateField(field, value) {
    setIsDirty(true);
    setForm((current) => {
      const newForm = { ...current, [field]: value };
      // Slug avtomatik generation
      if (field === 'title' && !current.slug) {
        newForm.slug = generateSlug(value);
      }
      // Realtime validatsiya
      if (formErrors[field]) {
        const errs = validateForm(newForm);
        setFormErrors(prev => ({ ...prev, [field]: errs[field] || null }));
      }
      // 🔄 History ga qo'shish
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

  // 🔄 Undo/Redo funksiyalari
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
  // Ctrl+Z/Y/S/N shortcuts + beforeunload
  useEffect(() => {
    function onKey(e) {
      if (!loggedIn) return;
      const inInput = ["INPUT","TEXTAREA","SELECT"].includes(e.target.tagName) || e.target.isContentEditable;
      // Ctrl+S — saqlash
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (activeTab === "editor") document.getElementById("story-form")?.requestSubmit();
      }
      // Ctrl+N — yangi maqola
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
      // Birinchi xato maydonga scroll
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

      <aside className="adm-sidebar">
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

        <nav className="adm-nav">
          <button className={activeTab === "stats" ? "active" : ""} onClick={() => setActiveTab("stats")}>
            <span>📊</span> Dashboard
          </button>
          <button className={activeTab === "list" ? "active" : ""} onClick={() => setActiveTab("list")}>
            <span>📋</span> Maqolalar
            <span className="adm-nav-count">{stories.length}</span>
          </button>
          <button className={activeTab === "editor" ? "active" : ""} onClick={() => { setActiveTab("editor"); resetForm(); }}>
            <span>✏️</span> {editingId ? "Tahrirlash" : "Yangi maqola"}
          </button>
          <button className={activeTab === "media" ? "active" : ""} onClick={() => { setActiveTab("media"); loadMedia(); }}>
            <span>🖼</span> Media
            {mediaFiles.length > 0 && <span className="adm-nav-count">{mediaFiles.length}</span>}
          </button>
          <button className={activeTab === "ads" ? "active" : ""} onClick={() => setActiveTab("ads")}>
            <span>📢</span> Reklama
            {(ads||[]).filter(a=>a.active).length > 0 && <span className="adm-nav-count">{(ads||[]).filter(a=>a.active).length}</span>}
          </button>
          <button className={activeTab === "settings" ? "active" : ""} onClick={() => setActiveTab("settings")}>
            <span>⚙️</span> Sozlamalar
          </button>
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
          <div className="adm-stat-item draft">
            <strong>{drafts}</strong>
            <span>Qoralama</span>
          </div>
        </div>
        <button className="adm-logout" onClick={logout}>← Chiqish</button>
      </aside>

      <main className="adm-main">
        <header className="adm-header">
          <div>
            <h1>
              {activeTab === "stats" && "Dashboard"}
              {activeTab === "list" && "Maqolalar ro'yxati"}
              {activeTab === "editor" && (editingId ? "Maqolani tahrirlash" : "Yangi maqola qo'shish")}
              {activeTab === "media" && "Media kutubxonasi"}
              {activeTab === "ads" && "Reklama bannerlari"}
              {activeTab === "settings" && "Sozlamalar"}
            </h1>
            <p>Til: <strong>{lang.toUpperCase()}</strong> · Barcha o'zgarishlar server bazasida saqlanadi</p>
          </div>
          <div className="adm-header-actions">
            {activeTab === "list" && (
              <>
                <button className="adm-btn ghost" onClick={() => {
                  // 📤 Export all stories to JSON
                  const data = {
                    exportedAt: new Date().toISOString(),
                    stories: allStories
                  };
                  const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
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