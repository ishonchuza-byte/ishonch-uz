const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings to LF
content = content.replace(/\r\n/g, '\n');

// 1. Add state variables inside AdminPanel
const targetAdminPanelStart = `function AdminPanel({ lang, setLang, allStories, stories, setAllStories, refreshPublicStories, siteConfig, setSiteConfig, pinnedHeroId, setPinnedHeroId, pinnedSideIds, setPinnedSideIds, ads, setAds }) {
  const adminLang = lang === "uzk" ? "uz" : lang;
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);`;

const replacementAdminPanelStart = `function AdminPanel({ lang, setLang, allStories, stories, setAllStories, refreshPublicStories, siteConfig, setSiteConfig, pinnedHeroId, setPinnedHeroId, pinnedSideIds, setPinnedSideIds, ads, setAds }) {
  const adminLang = lang === "uzk" ? "uz" : lang;
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  // New Security State variables
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [loginHistory, setLoginHistory] = useState([]);
  const [accountCreatedAt, setAccountCreatedAt] = useState("");`;

if (content.includes(targetAdminPanelStart)) {
  content = content.replace(targetAdminPanelStart, replacementAdminPanelStart);
  console.log("✓ Added security state variables to AdminPanel");
} else {
  console.log("⚠️ Target AdminPanelStart pattern not found");
}

// 2. Add fetch logic inside loadAllAdminCollections
const targetCollections = `      const pgData = await api("/api/admin/pages"); setPagesList(pgData.pages || []);
      
      const nlRes = await fetch("/api/admin/newsletter/history"); 
      const nlData = await nlRes.json();
      setNewsletterHistory(nlData.sentNewsletters || []);`;

const replacementCollections = `      const pgData = await api("/api/admin/pages"); setPagesList(pgData.pages || []);
      
      const nlRes = await fetch("/api/admin/newsletter/history"); 
      const nlData = await nlRes.json();
      setNewsletterHistory(nlData.sentNewsletters || []);

      try {
        const lhRes = await fetch("/api/admin/login-history", { credentials: "same-origin" });
        if (lhRes.ok) {
          const lhData = await lhRes.json();
          setLoginHistory(lhData.history || []);
          setAccountCreatedAt(lhData.createdAt || "");
        }
      } catch(e) { console.error("Failed to load login history", e); }`;

if (content.includes(targetCollections)) {
  content = content.replace(targetCollections, replacementCollections);
  console.log("✓ Updated loadAllAdminCollections to load login history");
} else {
  console.log("⚠️ Target Collections pattern not found");
}

// 3. Add maintenanceMode to homeConfig state initialization
const targetHomeConfigState = `    keywords: "",
    brandColor: "",
    bannerText: "",
    bannerActive: false
  });`;

const replacementHomeConfigState = `    keywords: "",
    brandColor: "",
    bannerText: "",
    bannerActive: false,
    maintenanceMode: false
  });`;

if (content.includes(targetHomeConfigState)) {
  content = content.replace(targetHomeConfigState, replacementHomeConfigState);
  console.log("✓ Added maintenanceMode to homeConfig state definition");
} else {
  console.log("⚠️ Target HomeConfigState pattern not found");
}

// 4. Add maintenanceMode to siteConfig useEffect loader
const targetUseEffectLoad = `        keywords: siteConfig.keywords || "",
        brandColor: siteConfig.brandColor || "#c31932",
        bannerText: siteConfig.bannerText || "",
        bannerActive: siteConfig.bannerActive || false
      });`;

const replacementUseEffectLoad = `        keywords: siteConfig.keywords || "",
        brandColor: siteConfig.brandColor || "#c31932",
        bannerText: siteConfig.bannerText || "",
        bannerActive: siteConfig.bannerActive || false,
        maintenanceMode: siteConfig.maintenanceMode || false
      });`;

if (content.includes(targetUseEffectLoad)) {
  content = content.replace(targetUseEffectLoad, replacementUseEffectLoad);
  console.log("✓ Added maintenanceMode to siteConfig useEffect loader");
} else {
  console.log("⚠️ Target UseEffectLoad pattern not found");
}

// 5. Add maintenanceMode to saveHomeConfig
const targetSaveHomeConfig = `        keywords: homeConfig.keywords,
        brandColor: homeConfig.brandColor,
        bannerText: homeConfig.bannerText,
        bannerActive: homeConfig.bannerActive
      });`;

const replacementSaveHomeConfig = `        keywords: homeConfig.keywords,
        brandColor: homeConfig.brandColor,
        bannerText: homeConfig.bannerText,
        bannerActive: homeConfig.bannerActive,
        maintenanceMode: homeConfig.maintenanceMode
      });`;

if (content.includes(targetSaveHomeConfig)) {
  content = content.replace(targetSaveHomeConfig, replacementSaveHomeConfig);
  console.log("✓ Added maintenanceMode to saveHomeConfig");
} else {
  console.log("⚠️ Target SaveHomeConfig pattern not found");
}

// 6. Add PIN and Password update handlers inside AdminPanel
const targetPasswordHandlerLocation = `  // Categories config save`;

const replacementPasswordHandlerLocation = `  // Security update password and PIN functions
  async function updatePassword(e) {
    e.preventDefault();
    if (newPassword.trim().length < 6) {
      notify("Yangi parol kamida 6 ta belgidan iborat bo'lsin.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      notify("Yangi parollar mos kelmadi.", "error");
      return;
    }
    try {
      await api("/api/admin/password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, password: newPassword.trim() })
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      notify("✓ Parol muvaffaqiyatli yangilandi.", "success");
    } catch (e) {
      notify("Xato: " + e.message, "error");
    }
  }

  async function updatePin(e) {
    e.preventDefault();
    if (newPin.length !== 4 || isNaN(newPin)) {
      notify("PIN-kod 4 ta raqamdan iborat bo'lishi kerak.", "error");
      return;
    }
    try {
      await api("/api/admin/pin", {
        method: "POST",
        body: JSON.stringify({ currentPin, newPin })
      });
      setCurrentPin("");
      setNewPin("");
      notify("✓ PIN-kod muvaffaqiyatli yangilandi.", "success");
    } catch (e) {
      notify("Xato: " + e.message, "error");
    }
  }

  async function toggleMaintenanceMode(checked) {
    setHomeConfig(p => ({ ...p, maintenanceMode: checked }));
    try {
      await saveConfig({ ...siteConfig, maintenanceMode: checked });
      notify(checked ? "✓ Ta'mirlash rejimi yoqildi" : "✓ Ta'mirlash rejimi o'chirildi", "success");
    } catch (e) {
      notify("Xato: " + e.message, "error");
    }
  }

  // Categories config save`;

if (content.includes(targetPasswordHandlerLocation)) {
  content = content.replace(targetPasswordHandlerLocation, replacementPasswordHandlerLocation);
  console.log("✓ Added updatePassword, updatePin, and toggleMaintenanceMode handlers");
} else {
  console.log("⚠️ Target PasswordHandlerLocation pattern not found");
}

// 7. Inject Maintenance Screen in App component return statement
const targetAppReturn = `  return (
    <div className="app">`;

const replacementAppReturn = `  if (siteConfig && siteConfig.maintenanceMode && page !== "admin") {
    const isUz = lang === "uz" || lang === "uzk";
    return (
      <div className="maintenance-screen" style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0b0f19, #111827)",
        color: "#fff",
        fontFamily: "Outfit, Inter, sans-serif",
        textAlign: "center",
        padding: "20px"
      }}>
        <div style={{fontSize: "72px", marginBottom: "20px"}}>🛠️</div>
        <h1 style={{fontSize: "32px", margin: "0 0 10px 0", fontWeight: "700", color: "#f3f4f6"}}>Таъмирлаш режими</h1>
        <p style={{fontSize: "18px", color: "#9ca3af", maxWidth: "500px", lineHeight: "1.6", margin: "0 0 30px 0"}}>
          {isUz 
            ? "Ҳурматли мухлислар, сайтда техник таъмирлаш ва янгилаш ишлари олиб борилмоқда. Тез орада хизматингизда бўламиз!"
            : "Уважаемые читатели, на сайте проводятся технические работы. Мы скоро вернемся!"}
        </p>
        <div style={{marginTop: "20px", fontSize: "14px", color: "#4b5563"}}>
          {siteConfig.siteName || "VATAN"} © {new Date().getFullYear()}
        </div>
      </div>
    );
  }

  return (
    <div className="app">`;

if (content.includes(targetAppReturn)) {
  content = content.replace(targetAppReturn, replacementAppReturn);
  console.log("✓ Injected Maintenance screen return statement");
} else {
  console.log("⚠️ Target AppReturn pattern not found");
}

// 8. Replace Tab 4 (system sub-tab) rendering block with the mockup layout
const targetSystemTabUI = `              {settingsSubTab === "system" && (
                <div style={{display: "flex", flexDirection: "column", gap: "24px"}}>
                  {/* Banner config inside system tab */}
                  <div>
                    <h4 style={{margin: "0 0 16px 0", color: "var(--ink)"}}>E'lonlar banneri</h4>
                    <div style={{display: "flex", alignItems: "center", gap: "10px", margin: "8px 0 16px"}}>
                      <input 
                        type="checkbox" 
                        id="bannerActiveCheckSettings" 
                        checked={homeConfig.bannerActive} 
                        onChange={e => setHomeConfig({...homeConfig, bannerActive: e.target.checked})} 
                        style={{width: "20px", height: "20px", cursor: "pointer"}} 
                      />
                      <label htmlFor="bannerActiveCheckSettings" style={{margin: 0, cursor: "pointer", color: "var(--ink)"}}>
                        Yuqoridagi e'lonlar bannerini yoqish
                      </label>
                    </div>
                    {homeConfig.bannerActive && (
                      <label>
                        E'lon matni
                        <input 
                          value={homeConfig.bannerText} 
                          onChange={e => setHomeConfig({...homeConfig, bannerText: e.target.value})} 
                          placeholder="Tezkor xabar yoki e'lon..." 
                        />
                      </label>
                    )}
                  </div>

                  <div style={{borderTop: "1px solid var(--line)", paddingTop: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px"}}>
                    <div>
                      <h4 style={{margin: "0 0 16px 0", color: "var(--ink)"}}>Tizim ma'lumotlari</h4>
                      <div style={{fontSize: "13px", lineHeight: "2", color: "var(--muted)", background: "var(--surface)", border: "1px solid var(--line)", padding: "12px", borderRadius: "6px"}}>
                        <div>CMS Versiya: <strong style={{color: "var(--ink)"}}>v2.0.0 (Upgraded)</strong></div>
                        <div>Ishlash tartibi: <strong style={{color: "var(--ink)"}}>Node JS Backend + JSON DB</strong></div>
                        <div>Tillar: <strong style={{color: "var(--ink)"}}>UZ (Lotin), ЎЗ (Кирилл), RU (Русский)</strong></div>
                        <div>Sessiya vaqti: <strong style={{color: "var(--ink)"}}>12 soat</strong></div>
                      </div>
                    </div>

                    <div>
                      <h4 style={{margin: "0 0 16px 0", color: "var(--ink)"}}>Zaxiralash va Sozlash</h4>
                      <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                        <div style={{display: "flex", gap: "10px"}}>
                          <button 
                            type="button" 
                            className="adm-btn ghost" 
                            style={{flex: 1}}
                            onClick={() => {
                              const data = { exportedAt: new Date().toISOString(), stories: allStories };
                              const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a'); a.href = url;
                              a.download = \`ishonch_uz-backup-\${new Date().toISOString().split('T')[0]}.json\`;
                              a.click();
                              URL.revokeObjectURL(url);
                              notify("📤 Eksport yuklandi", "success");
                            }}
                          >
                            📤 Eksport
                          </button>

                          <button 
                            type="button" 
                            className="adm-btn ghost" 
                            style={{flex: 1}}
                            onClick={() => importFileRef.current?.click()}
                          >
                            📥 Import
                          </button>
                        </div>
                        
                        <button 
                          type="button" 
                          className="adm-btn ghost" 
                          style={{width: "100%", color: "#ff4d4d", borderColor: "rgba(255, 77, 77, 0.3)"}} 
                          onClick={resetContent}
                        >
                          ↺ Demo ma'lumotlarni tiklash
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}`;

const replacementSystemTabUI = `              {settingsSubTab === "system" && (
                <div style={{display: "flex", flexDirection: "column", gap: "24px"}}>
                  {/* Актив Сессиялар ва Ҳолат Card */}
                  <div style={{
                    padding: "20px", 
                    background: "var(--surface)", 
                    border: "1px solid var(--line)", 
                    borderRadius: "8px",
                  }}>
                    <strong style={{color: "var(--ink)", display: "flex", alignItems: "center", gap: "8px", fontSize: "16px", marginBottom: "16px"}}>
                      💻 Актив Сессиялар ва Ҳолат
                    </strong>
                    <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "16px"}}>
                      <div>
                        <div style={{color: "var(--muted)", fontSize: "13px", marginBottom: "4px"}}>Охирги марта кирилган вақт:</div>
                        <strong style={{color: "var(--ink)", fontSize: "14px"}}>
                          {loginHistory.length > 0 
                            ? \`\${new Date(loginHistory[0].timestamp).toLocaleString('uz-UZ')} (\${loginHistory[0].ip})\`
                            : "Юкланмоқда..."
                          }
                        </strong>
                      </div>
                      <div>
                        <div style={{color: "var(--muted)", fontSize: "13px", marginBottom: "4px"}}>Аккаунт яратилган вақт:</div>
                        <strong style={{color: "var(--ink)", fontSize: "14px"}}>
                          {accountCreatedAt 
                            ? new Date(accountCreatedAt).toLocaleDateString('uz-UZ') 
                            : "Юкланмоқда..."
                          }
                        </strong>
                      </div>
                    </div>
                    
                    {/* Active IP entries details */}
                    {loginHistory.length > 0 && (
                      <div style={{marginTop: "16px", paddingTop: "16px", borderTop: "1px dashed var(--line)"}}>
                        <div style={{fontSize: "12px", color: "var(--muted)", marginBottom: "8px", fontWeight: "600"}}>ОХИРГИ КИРИШЛАР ТАРИХИ:</div>
                        <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                          {loginHistory.slice(0, 3).map((session, i) => (
                            <div key={i} style={{display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--muted)"}}>
                              <span>🌐 IP: <strong style={{color: "var(--ink)"}}>\${session.ip}</strong> - \${session.device}</span>
                              <span>\${new Date(session.timestamp).toLocaleString('uz-UZ')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <p style={{margin: "12px 0 0 0", color: "#ff4d4d", fontSize: "12px", lineHeight: "1.4"}}>
                      ⚠️ Агар аккаунтингизга бегоналар кирганиdan гумон қилсангиз, зудлик билан пастроқдаги форма орқали паролингизни ўзгартиринг!
                    </p>
                  </div>

                  {/* Паролни Ўзгартириш */}
                  <div style={{borderTop: "1px solid var(--line)", paddingTop: "16px"}}>
                    <h4 style={{margin: "0 0 16px 0", color: "var(--ink)"}}>Паролни ўзгартириш</h4>
                    <form onSubmit={updatePassword} className="adm-form" style={{maxWidth: "500px"}}>
                      <label>
                        Жорий парол
                        <input 
                          type="password" 
                          value={currentPassword} 
                          onChange={e => setCurrentPassword(e.target.value)} 
                          placeholder="Joriy parolni kiriting..."
                          required
                        />
                      </label>
                      <label style={{marginTop: "12px"}}>
                        Янги парол
                        <input 
                          type="password" 
                          value={newPassword} 
                          onChange={e => setNewPassword(e.target.value)} 
                          placeholder="Yangi parol (kamida 6 ta belgi)..."
                          required
                        />
                      </label>
                      <label style={{marginTop: "12px"}}>
                        Янги паролни тасдиқланг
                        <input 
                          type="password" 
                          value={confirmPassword} 
                          onChange={e => setConfirmPassword(e.target.value)} 
                          placeholder="Yangi parolni tasdiqlang..."
                          required
                        />
                      </label>
                      <button type="submit" className="adm-btn primary" style={{marginTop: "16px"}}>Паролни янгилаш</button>
                    </form>
                  </div>

                  {/* 2-босқичли ПИН-код */}
                  <div style={{borderTop: "1px solid var(--line)", paddingTop: "16px"}}>
                    <h4 style={{margin: "0 0 16px 0", color: "var(--ink)"}}>2-босқичли ПИН-кодни ўзгартириш</h4>
                    <form onSubmit={updatePin} className="adm-form" style={{maxWidth: "500px"}}>
                      <label>
                        Жорий ПИН-код
                        <input 
                          type="password" 
                          value={currentPin} 
                          onChange={e => setCurrentPin(e.target.value)} 
                          placeholder="Joriy 4 xonali PIN-kod..."
                          maxLength="4"
                          required
                        />
                      </label>
                      <label style={{marginTop: "12px"}}>
                        Янги 4 хонали ПИН-код
                        <input 
                          type="password" 
                          value={newPin} 
                          onChange={e => setNewPin(e.target.value)} 
                          placeholder="Yangi 4 xonali PIN-kod..."
                          maxLength="4"
                          required
                        />
                      </label>
                      <button type="submit" className="adm-btn primary" style={{marginTop: "16px"}}>ПИН-кодни янгилаш</button>
                    </form>
                  </div>

                  {/* E'lonlar banneri */}
                  <div style={{borderTop: "1px solid var(--line)", paddingTop: "16px"}}>
                    <h4 style={{margin: "0 0 16px 0", color: "var(--ink)"}}>E'lonlar banneri</h4>
                    <div style={{display: "flex", alignItems: "center", gap: "10px", margin: "8px 0 16px"}}>
                      <input 
                        type="checkbox" 
                        id="bannerActiveCheckSettings" 
                        checked={homeConfig.bannerActive} 
                        onChange={e => setHomeConfig({...homeConfig, bannerActive: e.target.checked})} 
                        style={{width: "20px", height: "20px", cursor: "pointer"}} 
                      />
                      <label htmlFor="bannerActiveCheckSettings" style={{margin: 0, cursor: "pointer", color: "var(--ink)"}}>
                        Yuqoridagi e'lonlar bannerini yoqish
                      </label>
                    </div>
                    {homeConfig.bannerActive && (
                      <label>
                        E'lon matni
                        <input 
                          value={homeConfig.bannerText} 
                          onChange={e => setHomeConfig({...homeConfig, bannerText: e.target.value})} 
                          placeholder="Tezkor xabar yoki e'lon..." 
                        />
                      </label>
                    )}
                  </div>

                  {/* Maintenance Mode Card (Yellow Warning Style) */}
                  <div style={{
                    borderTop: "1px solid var(--line)", 
                    paddingTop: "16px",
                  }}>
                    <h4 style={{margin: "0 0 16px 0", color: "var(--ink)"}}>Тизим ҳолати</h4>
                    <div style={{
                      padding: "20px", 
                      background: "rgba(245, 158, 11, 0.1)", 
                      border: "1px solid rgba(245, 158, 11, 0.3)", 
                      borderRadius: "8px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "20px"
                    }}>
                      <div>
                        <strong style={{color: "#f59e0b", display: "block", fontSize: "15px", marginBottom: "4px"}}>Таъмирлаш режими (Maintenance Mode)</strong>
                        <span style={{color: "var(--muted)", fontSize: "13px"}}>Ёқилган ҳолатда фақат админлар сайтга кира олади.</span>
                      </div>
                      <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                        <button 
                          type="button"
                          className={\`adm-btn \${homeConfig.maintenanceMode ? "primary" : "ghost"}\`}
                          onClick={() => toggleMaintenanceMode(!homeConfig.maintenanceMode)}
                          style={{
                            minWidth: "120px", 
                            borderColor: homeConfig.maintenanceMode ? "var(--brand)" : "rgba(245, 158, 11, 0.3)",
                            color: homeConfig.maintenanceMode ? "#fff" : "#f59e0b"
                          }}
                        >
                          {homeConfig.maintenanceMode ? "● Ёқилган" : "○ Ўчирилган"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Backup database card */}
                  <div style={{
                    borderTop: "1px solid var(--line)", 
                    paddingTop: "16px",
                  }}>
                    <h4 style={{margin: "0 0 16px 0", color: "var(--ink)"}}>Маълумотлар базасидан нусха олиш (Backup)</h4>
                    <div style={{
                      padding: "20px", 
                      background: "var(--surface)", 
                      border: "1px solid var(--line)", 
                      borderRadius: "8px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "20px"
                    }}>
                      <div>
                        <span style={{color: "var(--muted)", fontSize: "13px"}}>Барча мақолалар, рукнлар ва муаллифларни JSON форматида юклаб олиш.</span>
                      </div>
                      <div style={{display: "flex", gap: "10px"}}>
                        <button 
                          type="button" 
                          className="adm-btn primary" 
                          onClick={() => {
                            const data = { exportedAt: new Date().toISOString(), stories: allStories };
                            const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a'); a.href = url;
                            a.download = \`ishonch_uz-backup-\${new Date().toISOString().split('T')[0]}.json\`;
                            a.click();
                            URL.revokeObjectURL(url);
                            notify("📥 Eksport yuklandi", "success");
                          }}
                        >
                          📥 JSON шаклида кўчириб олиш
                        </button>
                        
                        <button 
                          type="button" 
                          className="adm-btn ghost" 
                          onClick={() => importFileRef.current?.click()}
                        >
                          Импорт қилиш
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* CMS system info */}
                  <div style={{borderTop: "1px solid var(--line)", paddingTop: "16px"}}>
                    <h4 style={{margin: "0 0 16px 0", color: "var(--ink)"}}>Tizim ma'lumotlari</h4>
                    <div style={{fontSize: "13px", lineHeight: "2", color: "var(--muted)", background: "var(--surface)", border: "1px solid var(--line)", padding: "12px", borderRadius: "6px", maxWidth: "400px"}}>
                      <div>CMS Versiya: <strong style={{color: "var(--ink)"}}>v2.0.0 (Upgraded)</strong></div>
                      <div>Ishlash tartibi: <strong style={{color: "var(--ink)"}}>Node JS Backend + JSON DB</strong></div>
                      <div>Tillar: <strong style={{color: "var(--ink)"}}>UZ (Lotin), ЎЗ (Кирилл), RU (Русский)</strong></div>
                      <div>Sessiya vaqti: <strong style={{color: "var(--ink)"}}>12 soat</strong></div>
                    </div>
                  </div>
                </div>
              )}`;

if (content.includes(targetSystemTabUI)) {
  content = content.replace(targetSystemTabUI, replacementSystemTabUI);
  console.log("✓ Rewrote System & Security tab UI");
} else {
  console.log("⚠️ Target SystemTabUI pattern not found");
}

// 9. Remove the separate password form update container at the bottom
const targetSeparatePasswordForm = `            {/* Separate Form for Password Updates (Inside System tab only) */}
            {settingsSubTab === "system" && (
              <div style={{marginTop: "30px", borderTop: "1px solid var(--line)", paddingTop: "20px"}}>
                <h4 style={{margin: "0 0 16px 0", color: "var(--ink)"}}>Admin parolini o'zgartirish</h4>
                <form onSubmit={changePassword} className="adm-form" style={{maxWidth: "400px", display: "flex", gap: "10px", alignItems: "flex-end"}}>
                  <label style={{flex: 1, marginBottom: 0}}>
                    Yangi parol
                    <input 
                      type="password" 
                      value={newPassword} 
                      onChange={e => setNewPassword(e.target.value)} 
                      placeholder="Kamida 6 belgi..." 
                      required 
                    />
                  </label>
                  <button type="submit" className="adm-btn primary" style={{height: "42px"}}>Yangilash</button>
                </form>
              </div>
            )}`;

if (content.includes(targetSeparatePasswordForm)) {
  content = content.replace(targetSeparatePasswordForm, "");
  console.log("✓ Removed outdated separate password form from settings bottom");
} else {
  console.log("⚠️ Target SeparatePasswordForm pattern not found");
}

// Write back with CRLF line endings
fs.writeFileSync(filePath, content.replace(/\n/g, '\r\n'), 'utf8');
console.log("App.jsx security update complete.");
