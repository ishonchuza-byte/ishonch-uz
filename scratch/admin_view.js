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
                <button className="adm-btn ghost" type="button" onClick={redo} disabled={historyIndex >= formHistory.length - 1} title="Ctrl+Y">↪️ Redo</button>
                <button className="adm-btn ghost" type="button" onClick={() => {
                  const toCyr = lang !== "uzk";
                  setForm(f => ({
                    ...f,
                    title: convertText(f.title, toCyr),
                    summary: convertText(f.summary, toCyr),
                    body: convertText(f.body, toCyr),
                    category: convertText(f.category, toCyr)
                  }));
                  setLang(toCyr ? "uzk" : "uz");
                }}>↹ {"\u041b\u043e\u0442\u0438\u043d"} ↔ {"\u041a\u0440\u0438\u043b\u043b"}</button>
                <button className="adm-btn ghost" type="button" onClick={() => {
                  // 👁️ Preview - yangi tabda ko'rish
                  const previewWindow = window.open('', '_blank');
                  const isDark = document.body.classList.contains('dark');
                  const html = `
<!DOCTYPE html>
<html class="${isDark ? 'dark' : ''}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview: ${form.title || 'Maqola'}</title>
  <link rel="stylesheet" href="./styles.css">
  <style>
    body { padding: 20px; max-width: 800px; margin: 0 auto; }
    .preview-badge { position: fixed; top: 10px; right: 10px; background: var(--accent); color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; z-index: 1000; }
  </style>
</head>
<body>
  <div class="preview-badge">👁️ PREVIEW</div>
  <article class="article-page">
    <header class="article-header">
      <span class="article-category">${form.category || 'Siyosat'}</span>
      <h1 class="article-title">${form.title || 'Sarlavhasiz'}</h1>
      <div class="article-meta">
        <span>${form.author || 'Ishonch.uz'}</span>
        <span>•</span>
        <span>${form.time || 'Hozir'}</span>
        <span>•</span>
        <span>${form.read || '3 daqiqa'}</span>
      </div>
    </header>
    ${form.image ? `<img src="${form.image}" class="article-image" style="width:100%;border-radius:8px;margin:20px 0;">` : ''}
    <div class="article-body">
      <p class="article-summary" style="font-weight:500;margin-bottom:16px;">${form.summary || ''}</p>
      <div class="article-text">${form.body ? form.body.replace(/\n/g, '<br>') : ''}</div>
    </div>
  </article>
</body>
</html>`;
                  previewWindow.document.write(html);
                  previewWindow.document.close();
                }}>👁️ Ko'rish</button>
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

        {activeTab === "stats" && (
          <div className="adm-dashboard">
            <div className="adm-dash-cards">
              <div className="adm-dash-card blue">
                <span className="adm-dash-icon">📰</span>
                <div>
                  <StatNum value={stories.length} />
                  <span>Jami maqolalar ({lang.toUpperCase()})</span>
                </div>
              </div>
              <div className="adm-dash-card green">
                <span className="adm-dash-icon">✅</span>
                <div>
                  <StatNum value={published} />
                  <span>Chop etilgan</span>
                </div>
              </div>
              <div className="adm-dash-card yellow">
                <span className="adm-dash-icon">📝</span>
                <div>
                  <StatNum value={drafts} />
                  <span>Qoralama</span>
                </div>
              </div>
              <div className="adm-dash-card purple">
                <span className="adm-dash-icon">🌐</span>
                <div>
                  <StatNum value={uzTotal + uzkTotal} />
                  <span>Jami (UZ + ЎЗ)</span>
                </div>
              </div>
              {(() => {
                const allReactions = JSON.parse(localStorage.getItem("yk-reactions") || "{}");
                const totalReactions = Object.values(allReactions).reduce((sum, r) => {
                  const {_mine, ...emojis} = r;
                  return sum + Object.values(emojis).reduce((a,b) => a + (Number(b)||0), 0);
                }, 0);
                return (
                  <div className="adm-dash-card brand">
                    <span className="adm-dash-icon">👍</span>
                    <div>
                      <StatNum value={totalReactions} />
                      <span>Jami reaksiyalar</span>
                    </div>
                  </div>
                );
              })()}
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
                        
                        {/* Grid lines */}
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
                        
                        {/* Area under the line */}
                        <path d={areaD} fill="url(#chartGrad)" />
                        
                        {/* The line itself */}
                        <path d={pathD} fill="none" stroke="var(--brand)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        
                        {/* Dots and Tooltips */}
                        {points.map((p, i) => (
                          <g key={i} className="chart-dot-group">
                            <circle cx={p.x} cy={p.y} r="5" fill="var(--surface)" stroke="var(--brand)" strokeWidth="2.5" />
                            <circle cx={p.x} cy={p.y} r="8" fill="transparent" style={{cursor:"pointer"}} />
                            <text x={p.x} y={p.y - 10} fontSize="9" fontWeight="700" fill="var(--ink)" textAnchor="middle" className="chart-tooltip-text">{p.val}</text>
                          </g>
                        ))}
                        
                        {/* X Axis labels */}
                        {points.map((p, i) => {
                          const dateObj = new Date();
                          dateObj.setDate(dateObj.getDate() - (6 - i));
                          const label = dateObj.toLocaleDateString("uz-UZ", {month: "short", day: "numeric"});
                          return (
                            <text key={i} x={p.x} y="180" fontSize="9" fill="var(--muted)" textAnchor="middle">{label}</text>
                          );
                        })}
                      </svg>
                    </div>
                  );
                })()}
              </div>

              <div className="adm-dash-section">
                <h3>📂 Ruknlar taqsimoti</h3>
                {(() => {
                  const catData = categories.map(cat => {
                    const count = stories.filter(s => s.category === cat).length;
                    return { name: cat, count };
                  }).filter(c => c.count > 0);
                  const totalCatCount = catData.reduce((sum, c) => sum + c.count, 0);

                  if (totalCatCount === 0) {
                    return (
                      <div style={{color:"var(--muted)",fontSize:13,padding:"40px 0",textAlign:"center"}}>
                        Ruknlar bo'yicha maqolalar mavjud emas
                      </div>
                    );
                  }

                  let cumulativePercent = 0;
                  const slices = catData.map((slice, idx) => {
                    const percent = slice.count / totalCatCount;
                    const startAngle = cumulativePercent * 360;
                    const endAngle = (cumulativePercent + percent) * 360;
                    cumulativePercent += percent;

                    const rad = Math.PI / 180;
                    const x1 = 100 + 80 * Math.cos(startAngle * rad - Math.PI / 2);
                    const y1 = 100 + 80 * Math.sin(startAngle * rad - Math.PI / 2);
                    const x2 = 100 + 80 * Math.cos(endAngle * rad - Math.PI / 2);
                    const y2 = 100 + 80 * Math.sin(endAngle * rad - Math.PI / 2);

                    const largeArcFlag = percent > 0.5 ? 1 : 0;
                    const pathData = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                    const colors = ["var(--brand)", "var(--blue)", "var(--gold)", "#16a34a", "#7c3aed", "#b45309", "#06b6d4"];
                    const fill = colors[idx % colors.length];

                    return { ...slice, pathData, fill, pct: Math.round(percent * 100) };
                  });

                  return (
                    <div className="adm-svg-pie-wrapper" style={{display:"flex",alignItems:"center",gap:20,flexWrap:"wrap",justifyContent:"center"}}>
                      <svg viewBox="0 0 200 200" width="160" height="160">
                        {slices.map((slice, idx) => (
                          <path key={idx} d={slice.pathData} fill={slice.fill} stroke="var(--surface)" strokeWidth="1.5">
                            <title>{slice.name}: {slice.count} ta ({slice.pct}%)</title>
                          </path>
                        ))}
                      </svg>
                      <div className="adm-pie-legend" style={{display:"flex",flexDirection:"column",gap:6,flex:1,minWidth:120}}>
                        {slices.map((slice, idx) => (
                          <div key={idx} style={{display:"flex",alignItems:"center",gap:8,fontSize:12}}>
                            <span style={{width:12,height:12,borderRadius:"50%",background:slice.fill,display:"inline-block"}} />
                            <span style={{color:"var(--ink)",fontWeight:500}}>{slice.name}</span>
                            <span style={{color:"var(--muted)",marginLeft:"auto"}}>{slice.count} ta ({slice.pct}%)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="adm-dash-section">
                <h3>🏆 Eng ko'p o'qilgan maqolalar</h3>
                {stories.some(s => s.views > 0) ? (
                  <div style={{overflowX:"auto"}}>
                    <table className="adm-table" style={{width:"100%",borderCollapse:"collapse",marginTop:10}}>
                      <thead>
                        <tr style={{borderBottom:"2px solid var(--line)",textAlign:"left",fontSize:12,color:"var(--muted)"}}>
                          <th style={{padding:"8px 4px",width:30}}>#</th>
                          <th style={{padding:"8px 4px"}}>Sarlavha</th>
                          <th style={{padding:"8px 4px"}}>Rukn</th>
                          <th style={{padding:"8px 4px",textAlign:"right"}}>Ko'rishlar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...stories].filter(s=>s.views>0).sort((a,b) => (b.views||0)-(a.views||0)).slice(0,5).map((s, i) => (
                          <tr key={s.id} style={{borderBottom:"1px solid var(--line)",fontSize:12.5}}>
                            <td style={{padding:"10px 4px",fontWeight:700,color:"var(--muted)"}}>{i + 1}</td>
                            <td style={{padding:"10px 4px",fontWeight:600,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={s.title}>{s.title}</td>
                            <td style={{padding:"10px 4px"}}><span className="adm-item-cat" style={{padding:"2px 6px",fontSize:10}}>{s.category}</span></td>
                            <td style={{padding:"10px 4px",textAlign:"right",fontWeight:700,color:"var(--brand)"}}>👁 {s.views}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{color:"var(--muted)",fontSize:13,padding:"20px 0",textAlign:"center"}}>
                    📊 O'qilgan maqolalar yo'q
                  </div>
                )}
                
                <h3 style={{marginTop:24}}>🕐 So'nggi maqolalar</h3>
                <div className="adm-dash-recent">
                  {[...stories].slice(0, 5).map(s => (
                    <div className="adm-dash-recent-item" key={s.id}>
                      <img src={s.image} alt="" loading="lazy" />
                      <div style={{flex:1,minWidth:0}}>
                        <span className={`adm-status ${s.status}`} style={{marginRight:6}}>{s.status === "published" ? "✓" : "◌"}</span>
                        <span style={{fontWeight:700,fontSize:13,color:"var(--ink)",display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.title}</span>
                        <small>{s.category} · {s.time}</small>
                      </div>
                      <button className="adm-btn ghost" style={{fontSize:12,padding:6}} onClick={() => editStory(s)}>✏</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="adm-dash-section full-width">
                <h3>📢 Reklama bannerlari CTR samaradorligi</h3>
                {(() => {
                  const activeAds = ads || [];
                  if (activeAds.length === 0) {
                    return (
                      <div style={{color:"var(--muted)",fontSize:13,padding:"20px 0",textAlign:"center"}}>
                        Hozircha reklama bannerlari mavjud emas. Reklama bo'limida banner qo'shing.
                      </div>
                    );
                  }
                  return (
                    <div style={{overflowX:"auto"}}>
                      <table className="adm-table" style={{width:"100%",borderCollapse:"collapse",marginTop:10}}>
                        <thead>
                          <tr style={{borderBottom:"2px solid var(--line)",textAlign:"left",fontSize:13,color:"var(--muted)"}}>
                            <th style={{padding:"10px 8px"}}>Banner nomi</th>
                            <th style={{padding:"10px 8px"}}>Pozitsiya</th>
                            <th style={{padding:"10px 8px"}}>Holat</th>
                            <th style={{padding:"10px 8px",textAlign:"right"}}>Ko'rishlar (Imp)</th>
                            <th style={{padding:"10px 8px",textAlign:"right"}}>Bosishlar (Click)</th>
                            <th style={{padding:"10px 8px",textAlign:"right"}}>CTR</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeAds.map(ad => {
                            const stats = adStats[ad.id] || { impressions: 0, clicks: 0 };
                            const imp = stats.impressions || 0;
                            const clicks = stats.clicks || 0;
                            const ctr = imp > 0 ? (clicks / imp * 100) : 0;
                            
                            let ctrPillClass = "gray";
                            if (ctr > 2.0) ctrPillClass = "green";
                            else if (ctr > 0.5) ctrPillClass = "orange";

                            return (
                              <tr key={ad.id} style={{borderBottom:"1px solid var(--line)",fontSize:13}}>
                                <td style={{padding:"12px 8px",fontWeight:600}}>{ad.title || "Sarlavhasiz"}</td>
                                <td style={{padding:"12px 8px"}}>
                                  {{top:"Yuqori",inline:"O'rta",bottom:"Pastki",sidebar:"Sidebar"}[ad.position] || ad.position}
                                </td>
                                <td style={{padding:"12px 8px"}}>
                                  <span className={`adm-status ${ad.active ? "published" : "draft"}`}>
                                    {ad.active ? "Faol" : "Nofaol"}
                                  </span>
                                </td>
                                <td style={{padding:"12px 8px",textAlign:"right",fontWeight:700}}>{imp}</td>
                                <td style={{padding:"12px 8px",textAlign:"right",fontWeight:700}}>{clicks}</td>
                                <td style={{padding:"12px 8px",textAlign:"right"}}>
                                  <span className={`ctr-pill ${ctrPillClass}`}>
                                    {ctr.toFixed(2)}%
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

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

            {/* 📱 Bulk Actions floating toolbar */}
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
                {/* 📱 Bulk checkbox */}
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
                {/* Hover preview */}
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
                        <button type="button" className="translit-btn" style={{fontSize:10,padding:"2px 6px",cursor:"pointer",border:"1px solid var(--line)",borderRadius:4,background:"var(--surface)",color:"var(--ink)"}} onClick={() => updateField('title', convertText(form.title, true))}>🔄 Kirill</button>
                        <button type="button" className="translit-btn" style={{fontSize:10,padding:"2px 6px",cursor:"pointer",border:"1px solid var(--line)",borderRadius:4,background:"var(--surface)",color:"var(--ink)"}} onClick={() => updateField('title', convertText(form.title, false))}>🔄 Lotin</button>
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
                    URL slug (автоматик генерацияланади)
                    <input
                      value={form.slug || ''}
                      onChange={(e) => updateField("slug", e.target.value)}
                      placeholder="news-sarlavha"
                    />
                    <div className="field-footer">
                      <span className="adm-hint">URL: /news/{form.slug || 'slug'}</span>
                    </div>
                  </label>
                  <label data-field="summary">
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                      <span>Qisqa mazmun <span className="req">*</span></span>
                      <div className="translit-btn-group" style={{display:"flex",gap:4}}>
                        <button type="button" className="translit-btn" style={{fontSize:10,padding:"2px 6px",cursor:"pointer",border:"1px solid var(--line)",borderRadius:4,background:"var(--surface)",color:"var(--ink)"}} onClick={() => updateField('summary', convertText(form.summary, true))}>🔄 Kirill</button>
                        <button type="button" className="translit-btn" style={{fontSize:10,padding:"2px 6px",cursor:"pointer",border:"1px solid var(--line)",borderRadius:4,background:"var(--surface)",color:"var(--ink)"}} onClick={() => updateField('summary', convertText(form.summary, false))}>🔄 Lotin</button>
                      </div>
                    </div>
                    <textarea rows="3" value={form.summary} onChange={(e) => updateField("summary", e.target.value)} placeholder="Qisqa tavsif (card da ko'rinadi)..." className={formErrors.summary ? "field-error" : ""} />
                    <div className="field-footer">
                      {formErrors.summary ? <span className="field-err-msg">⚠ {formErrors.summary}</span> : <span/>}
                      <span className={`char-count ${form.summary.length > 200 ? "over" : ""}`}>{form.summary.length}/200</span>
                    </div>
                  </label>
                  <div className="adm-form-row">
                    <label>
                      Muallif
                      <input value={form.author} onChange={(e) => updateField("author", e.target.value)} placeholder="Ishonch.uz tahririyati" />
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
                        <button type="button" className="translit-btn" style={{fontSize:10,padding:"2px 6px",cursor:"pointer",border:"1px solid var(--line)",borderRadius:4,background:"var(--surface)",color:"var(--ink)"}} onClick={() => updateField('body', convertText(form.body, true))}>🔄 Kirill</button>
                        <button type="button" className="translit-btn" style={{fontSize:10,padding:"2px 6px",cursor:"pointer",border:"1px solid var(--line)",borderRadius:4,background:"var(--surface)",color:"var(--ink)"}} onClick={() => updateField('body', convertText(form.body, false))}>🔄 Lotin</button>
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
                      <small>Google qidiruv uchun</small>
                    </div>
                    <label>
                      Teglar
                      <input value={form.tags} onChange={e => updateField("tags", e.target.value)} placeholder="siyosat, iqtisod, yangilik (vergul bilan)" />
                      <span className="adm-hint">Maqolaga teglar qo'shing, vergul bilan ajrating</span>
                    </label>
                    <label>
                      Meta sarlavha
                      <input value={form.metaTitle} onChange={e => updateField("metaTitle", e.target.value)} placeholder={form.title || "Meta sarlavha (bo'sh bo'lsa asosiy sarlavha ishlatiladi)"} />
                    </label>
                    <label>
                      Meta tavsif
                      <textarea rows="2" value={form.metaDesc} onChange={e => updateField("metaDesc", e.target.value)} placeholder={form.summary || "Meta tavsif (bo'sh bo'lsa qisqa mazmun ishlatiladi)"} />
                      <span className={`adm-seo-counter ${(form.metaDesc || form.summary).length > 160 ? "over" : ""}`}>{(form.metaDesc || form.summary).length}/160</span>
                    </label>

                    {/* Google SERP Preview */}
                    <div className="adm-serp-preview">
                      <div className="adm-serp-head">Google қидирув натижаси кўриниши:</div>
                      <div className="adm-serp-box">
                        <div className="adm-serp-url">
                          https://ishonch.uz <span className="adm-serp-arrow">›</span> news <span className="adm-serp-arrow">›</span> {form.slug || "slug"}
                        </div>
                        <div className="adm-serp-title">
                          {(() => {
                            const tVal = form.metaTitle || form.title || "Мақола сарлавҳаси...";
                            return tVal.length > 60 ? tVal.slice(0, 57) + "..." : tVal;
                          })()}
                        </div>
                        <div className="adm-serp-desc">
                          {(() => {
                            const dVal = form.metaDesc || form.summary || "Мақола учун қисқача SEO тавсифи бу ерда кўринади...";
                            return dVal.length > 155 ? dVal.slice(0, 152) + "..." : dVal;
                          })()}
                        </div>
                      </div>
                    </div>
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
                    <span className={`adm-status ${form.status}`}>
                      {form.status === "published" ? "✓ Chop etilgan" : "◌ Qoralama"}
                    </span>
                    <strong className="adm-preview-title">{form.title || "Sarlavha..."}</strong>
                    <p className="adm-preview-summary">{form.summary || "Qisqa mazmun..."}</p>
                  </div>
                  <label>
                    Rasm URL
                    <input value={form.image} onChange={(e) => updateField("image", e.target.value)} placeholder="https://images.unsplash.com/..." />
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
                    <div className="adm-toggle-row">
                      <span>Muharrir tanlovi</span>
                      <label className="adm-toggle-switch">
                        <input type="checkbox" checked={!!form.isEditorPick} onChange={e=>updateField("isEditorPick", e.target.checked)} />
                        <span className="adm-toggle-slider" />
                      </label>
                    </div>
                    <div className="adm-toggle-row">
                      <span>Dolzarb mavzu</span>
                      <label className="adm-toggle-switch">
                        <input type="checkbox" checked={!!form.isBreaking} onChange={e=>updateField("isBreaking", e.target.checked)} />
                        <span className="adm-toggle-slider" />
                      </label>
                    </div>
                  </div>

                  <div className="adm-views-field">
                    <label className="adm-views-label">Ko'rishlar soni</label>
                    <div className="adm-views-input-row">
                      <div className="adm-views-input-wrap">
                        <span>👁</span>
                        <input type="number" min="0" value={form.views||0} onChange={e=>updateField("views", Number(e.target.value))} />
                      </div>
                      <label className="adm-countviews-check">
                        <input type="checkbox" checked={!!form.countViews} onChange={e=>updateField("countViews", e.target.checked)} />
                        <span>SANASH</span>
                      </label>
                    </div>
                  </div>

                  <div className="adm-schedule-box" style={{padding:12,background:"var(--fill)",borderRadius:8,marginBottom:8}}>
                    <label style={{display:"flex",flexDirection:"column",gap:6,fontSize:13}}>
                      🕐 Rejalashtirish (ixtiyoriy)
                      <input 
                        type="datetime-local" 
                        value={form.publishAt ? form.publishAt.slice(0,16) : ""} 
                        onChange={(e) => updateField("publishAt", e.target.value ? new Date(e.target.value).toISOString() : "")}
                        style={{padding:"8px 10px",fontSize:13,border:"1px solid var(--line)",borderRadius:6}}
                      />
                      <small style={{color:"var(--muted)",fontSize:11}}>
                        {form.publishAt ? "Belgilangan vaqtda avtomatik chiqadi" : "Hozir chiqadi"}
                      </small>
                    </label>
                  </div>

                  {editingId && form.revisions && form.revisions.length > 0 && (
                    <div className="adm-revisions-box" style={{padding:12,background:"var(--fill)",borderRadius:8,marginBottom:8}}>
                      <h4 style={{margin:"0 0 6px 0",fontSize:13,display:"flex",alignItems:"center",gap:6}}>
                        <span>⏱️</span> Tahrirlar tarixi ({form.revisions.length})
                      </h4>
                      <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:150,overflowY:"auto",paddingRight:2}}>
                        {form.revisions.map((rev, idx) => {
                          const formattedDate = new Date(rev.updatedAt).toLocaleString("uz-UZ", {
                            day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                          });
                          return (
                            <div key={idx} className="adm-rev-item" style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px",background:"var(--surface)",border:"1px solid var(--line)",borderRadius:6,fontSize:11}}>
                              <span style={{color:"var(--muted)",fontWeight:600}}>{formattedDate}</span>
                              <button
                                type="button"
                                className="adm-btn ghost"
                                style={{fontSize:9,padding:"2px 5px",height:"auto",minHeight:"unset"}}
                                onClick={() => {
                                  if (confirm("Ushbu versiyani tiklashni xohlaysizmi? O'zgarishlar faqat formaga yuklanadi. Saqlash yoki Yangilash tugmasini bosish shart.")) {
                                    updateField("title", rev.title || "");
                                    updateField("summary", rev.summary || "");
                                    updateField("body", rev.body || "");
                                    notify("✓ Versiya yuklandi. Saqlashni bosing.", "success");
                                  }
                                }}
                              >
                                Tiklash
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="adm-form-actions" style={{flexDirection:"column",gap:8}}>
                    <button className="adm-btn primary" type="submit" style={{width:"100%",padding:"13px",fontSize:15,justifyContent:"center",gap:8}}>
                      💾 {editingId ? "Yangilash" : "Nashr etish"}
                      {isDirty && <span style={{fontSize:10,opacity:0.7,marginLeft:4}}>• o'zgartirilgan</span>}
                    </button>
                    <div style={{display:"flex",gap:6}}>
                      <button className="adm-btn ghost" type="button" onClick={() => {
                        const draftKey = `yk-draft-${editingId || 'new'}`;
                        localStorage.setItem(draftKey, JSON.stringify({form, savedAt: new Date().toISOString(), lang}));
                        notify("💾 Qoralama saqlandi", "success", 2000);
                        setIsDirty(false);
                      }} style={{flex:1,justifyContent:"center"}}>
                        📋 Draft
                      </button>
                      <button className="adm-btn ghost" type="button" onClick={resetForm} style={{flex:1,justifyContent:"center"}}>
                        🔄 Bekor
                      </button>
                    </div>
                    <small className="adm-shortcut-hint">💡 Ctrl+S — saqlash &nbsp;|&nbsp; Ctrl+Z — orqaga</small>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {activeTab === "media" && (
          <div className="adm-media-wrap">
            <div className="adm-media-toolbar">
              <div className="adm-media-filter-btns">
                {["all","image","video"].map(f => (
                  <button key={f} className={`adm-media-filt ${mediaFilter===f?"active":""}`} onClick={()=>setMediaFilter(f)}>
                    {f==="all"?"Hammasi":f==="image"?"🖼 Rasmlar":"🎬 Videolar"}
                  </button>
                ))}
              </div>
              <span className="adm-filter-count">{mediaFiles.filter(f=>mediaFilter==="all"||f.type===mediaFilter).length} ta fayl</span>
            </div>

            <div
              className="adm-media-dropzone"
              onDragOver={e=>e.preventDefault()}
              onDrop={e=>{e.preventDefault();Array.from(e.dataTransfer.files).forEach(f=>uploadMediaFile(f));}}
            >
              {mediaUploading ? (
                <div className="adm-media-dz-inner loading">
                  <span className="rich-upload-spinner" style={{width:32,height:32,borderWidth:3}}/>
                  <p>Yuklanmoqda...</p>
                </div>
              ) : (
                <div className="adm-media-dz-inner">
                  <span style={{fontSize:36}}>📂</span>
                  <p>Foto yoki video fayllarni bu yerga tashlang</p>
                  <small>PNG, JPG, WEBP, GIF, MP4, WEBM qabul qilinadi</small>
                  <button className="adm-btn primary" style={{marginTop:10}} onClick={()=>mediaFileRef.current?.click()}>Fayl tanlash</button>
                </div>
              )}
            </div>

            {mediaFiles.filter(f=>mediaFilter==="all"||f.type===mediaFilter).length === 0 && !mediaUploading && (
              <div className="adm-empty">Hozircha media fayl yo'q. Yuqoriga fayl tashlang yoki tanlang.</div>
            )}

            <div className="adm-media-grid">
              {mediaFiles.filter(f=>mediaFilter==="all"||f.type===mediaFilter).map(file=>(
                <div className="adm-media-card" key={file.name}>
                  <div className="adm-media-thumb">
                    {file.type==="image"
                      ? <img src={file.url} alt={file.name}/>
                      : (
                        <div className="adm-media-video-thumb">
                          <video src={file.url} muted />
                          <span className="adm-media-play">▶</span>
                        </div>
                      )
                    }
                    <span className={`adm-media-type-badge ${file.type}`}>
                      {file.type==="image"?"🖼":"🎬"}
                    </span>
                  </div>
                  <div className="adm-media-info">
                    <p title={file.name}>{file.name.length>22?file.name.slice(0,20)+"...":file.name}</p>
                    <small>{(file.size/1024).toFixed(0)} KB</small>
                  </div>
                  <div className="adm-media-actions">
                    <button
                      className={`adm-btn ghost ${copiedUrl===file.url?"success":""}`}
                      onClick={()=>copyUrl(file.url)}
                    >{copiedUrl===file.url?"✓ Nusxalandi":"📋 URL"}</button>
                    <button className="adm-btn danger" onClick={()=>deleteMedia(file.name)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "ads" && (
          <div className="adm-ads-wrap">
            <div className="adm-ads-grid">
              {/* Banner yaratish / tahrirlash formasi */}
              <div className="adm-ads-form-card">
                <h3>{editingAdId ? "✏️ Bannerni tahrirlash" : "➕ Yangi banner"}</h3>
                <label>Banner sarlavhasi
                  <input value={adForm.title} onChange={e=>setAdForm(p=>({...p,title:e.target.value}))} placeholder="Reklama matni..." />
                </label>
                <label>Qo'shimcha matn
                  <input value={adForm.subtitle} onChange={e=>setAdForm(p=>({...p,subtitle:e.target.value}))} placeholder="Taklif, chegirma va h.k." />
                </label>
                <label>Rasm URL (ixtiyoriy)
                  <input value={adForm.image} onChange={e=>setAdForm(p=>({...p,image:e.target.value}))} placeholder="https://..." />
                  {adForm.image && <img src={adForm.image} alt="" style={{width:"100%",maxHeight:80,objectFit:"cover",borderRadius:6,marginTop:6}} />}
                </label>
                <label>Havola URL
                  <input value={adForm.link} onChange={e=>setAdForm(p=>({...p,link:e.target.value}))} placeholder="https://..." />
                </label>
                <label>Pozitsiya
                  <select value={adForm.position} onChange={e=>setAdForm(p=>({...p,position:e.target.value}))}>
                    <option value="top">⬆ Yuqori (Header osti — Leaderboard)</option>
                    <option value="inline">📄 O'rta (Maqolalar ustida)</option>
                    <option value="bottom">⬇ Pastki (Footer osti)</option>
                    <option value="sidebar">◼ Sidebar (O'ng panel)</option>
                  </select>
                </label>
                <label style={{display:"flex",alignItems:"center",gap:10,fontWeight:700}}>
                  <input type="checkbox" checked={adForm.active} onChange={e=>setAdForm(p=>({...p,active:e.target.checked}))} />
                  Faol (saitda ko'rinsin)
                </label>
                <div style={{display:"flex",gap:8,marginTop:4}}>
                  <button className="adm-btn primary" style={{flex:1}} onClick={() => {
                    if (!adForm.title && !adForm.image) { notify("⚠️ Sarlavha yoki rasm kerak","error"); return; }
                    const id = editingAdId || `ad-${Date.now()}`;
                    const newAd = {...adForm, id};
                    const nextAds = editingAdId ? (ads || []).map(a=>a.id===editingAdId?newAd:a) : [...(ads || []), newAd];
                    handleUpdateAds(nextAds);
                    setAdForm(EMPTY_AD); setEditingAdId(null);
                    notify(editingAdId ? "✓ Banner yangilandi" : "✓ Banner qo'shildi", "success");
                  }}>
                    {editingAdId ? "✓ Yangilash" : "➕ Qo'shish"}
                  </button>
                  {editingAdId && (
                    <button className="adm-btn ghost" onClick={()=>{setAdForm(EMPTY_AD);setEditingAdId(null);}}>✕ Bekor</button>
                  )}
                </div>
              </div>

              {/* Banner ro'yxati */}
              <div className="adm-ads-list-col">
                <h3>📋 Barcha bannerlar ({(ads||[]).length} ta)</h3>
                {!(ads||[]).length && (
                  <div className="adm-empty">Hozircha banner yo'q. Yangi banner qo'shing.</div>
                )}
                {(ads||[]).map(ad => (
                  <div key={ad.id} className={`adm-ad-item ${ad.active ? "active" : "inactive"}`}>
                    <div className={`adm-ad-pos-badge adm-ad-pos-${ad.position}`}>
                      {{top:"⬆ Yuqori",inline:"📄 O'rta",bottom:"⬇ Pastki",sidebar:"◼ Sidebar"}[ad.position]}
                    </div>
                    {ad.image && <img src={ad.image} alt="" className="adm-ad-thumb" />}
                    <div className="adm-ad-info">
                      <strong>{ad.title || <em style={{color:"var(--muted)"}}>Sarlavsiz</em>}</strong>
                      {ad.subtitle && <span>{ad.subtitle}</span>}
                      {ad.link && <small>🔗 {ad.link.slice(0,40)}{ad.link.length>40?"...":""}</small>}
                    </div>
                    <div className="adm-ad-actions">
                      <label className="adm-toggle-switch" title={ad.active?"O'chirish":"Yoqish"}>
                        <input type="checkbox" checked={ad.active} onChange={e=>{
                          const nextAds = (ads || []).map(a=>a.id===ad.id?{...a,active:e.target.checked}:a);
                          handleUpdateAds(nextAds);
                        }} />
                        <span className="adm-toggle-slider" />
                      </label>
                      <button className="adm-btn ghost" onClick={()=>{setAdForm({...ad});setEditingAdId(ad.id);window.scrollTo({top:0,behavior:"smooth"});}}>✏</button>
                      <button className="adm-btn danger" onClick={()=>{
                        if(!confirm("Bannerni o'chirish?")) return;
                        const nextAds = (ads || []).filter(a=>a.id!==ad.id);
                        handleUpdateAds(nextAds);
                        notify("Banner o'chirildi","info");
                      }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="adm-ads-preview-section">
              <h3>👁 Saitdagi ko'rinish (preview)</h3>
              <div className="adm-ads-preview-layout">
                {["top","inline","bottom","sidebar"].map(pos => {
                  const posAds = (ads||[]).filter(a=>a.active && a.position===pos);
                  return (
                    <div key={pos} className="adm-preview-pos-block">
                      <div className="adm-preview-pos-label">{{top:"⬆ Yuqori",inline:"📄 O'rta",bottom:"⬇ Pastki",sidebar:"◼ Sidebar"}[pos]}</div>
                      {posAds.length ? posAds.map(ad => (
                        <div key={ad.id} className="adm-preview-ad-card">
                          {ad.image && <img src={ad.image} alt="" />}
                          <div>
                            {ad.title && <strong>{ad.title}</strong>}
                            {ad.subtitle && <span>{ad.subtitle}</span>}
                          </div>
                        </div>
                      )) : <div className="adm-preview-empty">Faol banner yo'q</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="adm-settings">
            <div className="adm-settings-card">
              <h3>🌟 Maxsus loyiha sektsiyasi</h3>
              <p>Bosh sahifadagi qora fon sektsiya matni (UZ / RU alohida)</p>
              <div className="adm-special-tabs">
                <div className="adm-special-lang-group">
                  <strong>🇺🇿 UZ versiyasi</strong>
                  <label>Kicker (tepa yorliq)
                    <input value={siteConfig.specialUz.kicker} onChange={e=>setSiteConfig(p=>({...p,specialUz:{...p.specialUz,kicker:e.target.value}}))} placeholder="Maxsus loyiha" />
                  </label>
                  <label>Sarlavha
                    <input value={siteConfig.specialUz.title} onChange={e=>setSiteConfig(p=>({...p,specialUz:{...p.specialUz,title:e.target.value}}))} placeholder="Sarlavha..." />
                  </label>
                  <label>Tavsif
                    <textarea rows="2" value={siteConfig.specialUz.text} onChange={e=>setSiteConfig(p=>({...p,specialUz:{...p.specialUz,text:e.target.value}}))} placeholder="Tavsif matni..." />
                  </label>
                  <label>Rasm badji matni
                    <input value={siteConfig.specialUz.badge} onChange={e=>setSiteConfig(p=>({...p,specialUz:{...p.specialUz,badge:e.target.value}}))} placeholder="Jonli tahririyat" />
                  </label>
                  <label>Rasm URL
                    <input value={siteConfig.specialUz.image} onChange={e=>setSiteConfig(p=>({...p,specialUz:{...p.specialUz,image:e.target.value}}))} placeholder="https://... (bo'sh bo'lsa standart rasm)" />
                  </label>
                  <label>Xususiyatlar (vergul bilan)
                    <input value={siteConfig.specialUz.features} onChange={e=>setSiteConfig(p=>({...p,specialUz:{...p.specialUz,features:e.target.value}}))} placeholder="Tezkor yangiliklar, Mustaqil tahlil, ..." />
                  </label>
                  <div className="adm-form-row" style={{gap:8}}>
                    {["stat1","stat2","stat3","stat4"].map(k=>(
                      <div key={k} style={{display:"flex",flexDirection:"column",gap:4,flex:1,minWidth:80}}>
                        <input value={siteConfig.specialUz[k]} onChange={e=>setSiteConfig(p=>({...p,specialUz:{...p.specialUz,[k]:e.target.value}}))} placeholder="24/7" style={{fontWeight:900,textAlign:"center"}} />
                        <input value={siteConfig.specialUz[k+"label"]} onChange={e=>setSiteConfig(p=>({...p,specialUz:{...p.specialUz,[k+"label"]:e.target.value}}))} placeholder="Monitoring" style={{textAlign:"center",fontSize:12}} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="adm-special-lang-group">
                  <strong>🇷🇺 RU versiyasi</strong>
                  <label>Kicker (tepa yorliq)
                    <input value={siteConfig.specialRu.kicker} onChange={e=>setSiteConfig(p=>({...p,specialRu:{...p.specialRu,kicker:e.target.value}}))} placeholder="Спецпроект" />
                  </label>
                  <label>Sarlavha
                    <input value={siteConfig.specialRu.title} onChange={e=>setSiteConfig(p=>({...p,specialRu:{...p.specialRu,title:e.target.value}}))} placeholder="Заголовок..." />
                  </label>
                  <label>Tavsif
                    <textarea rows="2" value={siteConfig.specialRu.text} onChange={e=>setSiteConfig(p=>({...p,specialRu:{...p.specialRu,text:e.target.value}}))} placeholder="Описание..." />
                  </label>
                  <label>Rasm badji matni
                    <input value={siteConfig.specialRu.badge} onChange={e=>setSiteConfig(p=>({...p,specialRu:{...p.specialRu,badge:e.target.value}}))} placeholder="Живая редакция" />
                  </label>
                  <label>Rasm URL
                    <input value={siteConfig.specialRu.image} onChange={e=>setSiteConfig(p=>({...p,specialRu:{...p.specialRu,image:e.target.value}}))} placeholder="https://..." />
                  </label>
                  <label>Xususiyatlar (vergul bilan)
                    <input value={siteConfig.specialRu.features} onChange={e=>setSiteConfig(p=>({...p,specialRu:{...p.specialRu,features:e.target.value}}))} placeholder="Быстрые новости, Независимый анализ, ..." />
                  </label>
                  <div className="adm-form-row" style={{gap:8}}>
                    {["stat1","stat2","stat3","stat4"].map(k=>(
                      <div key={k} style={{display:"flex",flexDirection:"column",gap:4,flex:1,minWidth:80}}>
                        <input value={siteConfig.specialRu[k]} onChange={e=>setSiteConfig(p=>({...p,specialRu:{...p.specialRu,[k]:e.target.value}}))} placeholder="24/7" style={{fontWeight:900,textAlign:"center"}} />
                        <input value={siteConfig.specialRu[k+"label"]} onChange={e=>setSiteConfig(p=>({...p,specialRu:{...p.specialRu,[k+"label"]:e.target.value}}))} placeholder="Мониторинг" style={{textAlign:"center",fontSize:12}} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button className="adm-btn primary" type="button" onClick={()=>saveConfig(siteConfig)}>Saqlash</button>
            </div>

            <div className="adm-settings-card">
              <h3>🎨 Brand rangi</h3>
              <p>Saytning asosiy rang sxemasi</p>
              <div className="brand-color-row">
                {["#c31932","#1d4ed8","#0f766e","#7c3aed","#b45309","#0369a1","#dc2626","#16a34a"].map(color => (
                  <button
                    key={color}
                    className={`brand-color-swatch ${(siteConfig.brandColor || "#c31932") === color ? "active" : ""}`}
                    style={{background: color}}
                    onClick={() => {
                      const updated = { ...siteConfig, brandColor: color };
                      setSiteConfig(updated);
                      document.documentElement.style.setProperty("--brand", color);
                      saveConfig(updated);
                    }}
                    title={color}
                  />
                ))}
                <input
                  type="color"
                  className="brand-color-input"
                  value={siteConfig.brandColor || "#c31932"}
                  onChange={e => {
                    const updated = { ...siteConfig, brandColor: e.target.value };
                    setSiteConfig(updated);
                    document.documentElement.style.setProperty("--brand", e.target.value);
                    saveConfig(updated);
                  }}
                  title="Maxsus rang"
                />
              </div>
              <small style={{color:"var(--muted)",fontSize:12,marginTop:6,display:"block"}}>
                Brand rangi barcha tashrif buyuruvchilar uchun serverda saqlanadi.
              </small>
            </div>

            <div className="adm-settings-card">
              <h3>📌 Hero maqola tanlash</h3>
              <p>Bosh sahifaning eng katta (chap) maqolasini qo'lda belgilang. Tanlov saqlanadi.</p>

              {pinnedHeroId ? (
                <div className="adm-hero-current">
                  <img src={stories.find(s=>s.id===pinnedHeroId)?.image} alt="" />
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:11,fontWeight:800,color:"var(--brand)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>📌 Hozirgi Hero</div>
                    <strong style={{fontSize:14,display:"block",marginBottom:2}}>{stories.find(s=>s.id===pinnedHeroId)?.title || "—"}</strong>
                    <small style={{color:"var(--muted)"}}>{stories.find(s=>s.id===pinnedHeroId)?.category}</small>
                  </div>
                  <button className="adm-btn danger" style={{fontSize:12,padding:"6px 12px",flexShrink:0}} onClick={()=>handleSelectHero("")}>✕ Bekor qilish</button>
                </div>
              ) : (
                <div style={{padding:"10px 14px",background:"var(--paper)",borderRadius:8,fontSize:13,color:"var(--muted)",marginBottom:12}}>
                  ℹ️ Hozir avtomatik rejim — eng so'nggi maqola ko'rsatiladi
                </div>
              )}

              <input
                className="comment-input"
                placeholder="🔍 Maqola qidirish..."
                id="hero-search"
                style={{marginBottom:10}}
                onChange={e => {
                  const q = e.target.value.toLowerCase();
                  document.querySelectorAll(".hero-pick-item").forEach(el => {
                    el.style.display = el.dataset.title.toLowerCase().includes(q) ? "" : "none";
                  });
                }}
              />

              <div style={{maxHeight:360,overflowY:"auto",display:"flex",flexDirection:"column",gap:8,paddingRight:4}}>
                {stories.filter(s=>s.status==="published").map(s => (
                  <div
                    key={s.id}
                    data-title={s.title}
                    className={`adm-dash-recent-item hero-pick-item ${pinnedHeroId===s.id?"adm-hero-pick":""}`}
                    style={{cursor:"pointer",padding:"8px 10px",borderRadius:8,border:`1.5px solid ${pinnedHeroId===s.id?"var(--brand)":"var(--line)"}`,background:"var(--surface)",transition:"border-color 150ms"}}
                    onClick={()=>{ const isNew = pinnedHeroId !== s.id; handleSelectHero(isNew ? s.id : ""); notify(isNew ? "✓ Hero maqola belgilandi va saqlandi!" : "Hero bekor qilindi", isNew ? "success" : "info"); }}
                  >
                    <img src={s.image} alt="" style={{width:60,height:44,objectFit:"cover",borderRadius:6,flexShrink:0}} loading="lazy" />
                    <div style={{flex:1,minWidth:0}}>
                      <span style={{fontSize:10,fontWeight:800,color:"var(--brand)",textTransform:"uppercase",letterSpacing:"0.06em"}}>{s.category}</span>
                      <p style={{margin:"2px 0 0",fontSize:13,fontWeight:700,lineHeight:1.3,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{s.title}</p>
                      <small style={{color:"var(--muted)",fontSize:11}}>{s.time} · {s.read}</small>
                    </div>
                    {pinnedHeroId===s.id
                      ? <span className="adm-hero-pick-label">📌 Hero</span>
                      : <span style={{fontSize:11,color:"var(--muted)",flexShrink:0}}>Tanlash</span>
                    }
                  </div>
                ))}
                {stories.filter(s=>s.status==="published").length === 0 && (
                  <div style={{color:"var(--muted)",fontSize:13,padding:"20px",textAlign:"center"}}>Chop etilgan maqolalar yo'q</div>
                )}
              </div>
            </div>

            <div className="adm-settings-card">
              <h3>🗂️ O'ng tomon kartalar (2 ta)</h3>
              <p>Hero bo'limining o'ng tomonidagi 2 ta kichik kartani belgilang. Saqlanadi.</p>

              {pinnedSideIds.length > 0 && (
                <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
                  {pinnedSideIds.map((id, idx) => {
                    const s = stories.find(x => x.id === id);
                    if (!s) return null;
                    return (
                      <div key={id} className="adm-hero-current" style={{marginBottom:0}}>
                        <img src={s.image} alt="" />
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:11,fontWeight:800,color:"var(--brand)",marginBottom:4}}>
                            {idx === 0 ? "🔼 Yuqori karta" : "🔽 Quyi karta"}
                          </div>
                          <strong style={{fontSize:13,display:"block"}}>{s.title}</strong>
                          <small style={{color:"var(--muted)"}}>{s.category}</small>
                        </div>
                        <button className="adm-btn ghost" style={{fontSize:12,padding:"4px 10px",flexShrink:0}}
                          onClick={()=>{ const nextList = pinnedSideIds.filter(x=>x!==id); handleSelectSide(nextList); }}>✕</button>
                      </div>
                    );
                  })}
                  {pinnedSideIds.length > 0 && (
                    <button className="adm-btn ghost" style={{fontSize:12,alignSelf:"flex-start"}}
                      onClick={()=>{ handleSelectSide([]); notify("Side kartalar bekor qilindi","info"); }}>
                      ✕ Hammasini bekor qilish
                    </button>
                  )}
                </div>
              )}

              {pinnedSideIds.length < 2 && (
                <div style={{padding:"8px 12px",background:"var(--paper)",borderRadius:8,fontSize:13,color:"var(--muted)",marginBottom:12}}>
                  📌 {2 - pinnedSideIds.length} ta karta tanlang
                </div>
              )}

              <div style={{maxHeight:320,overflowY:"auto",display:"flex",flexDirection:"column",gap:8,paddingRight:4}}>
                {stories.filter(s=>s.status==="published" && s.id !== pinnedHeroId).map(s => {
                  const sideIdx = pinnedSideIds.indexOf(s.id);
                  const isSelected = sideIdx !== -1;
                  return (
                    <div
                      key={s.id}
                      style={{cursor:"pointer",padding:"8px 10px",borderRadius:8,
                        border:`1.5px solid ${isSelected?"var(--brand)":"var(--line)"}`,
                        background:"var(--surface)",transition:"border-color 150ms",
                        opacity: pinnedSideIds.length >= 2 && !isSelected ? 0.45 : 1}}
                      onClick={()=>{
                        if (isSelected) {
                          const nextList = pinnedSideIds.filter(x=>x!==s.id);
                          handleSelectSide(nextList);
                          notify("Karta olib tashlandi","info");
                        } else if (pinnedSideIds.length < 2) {
                          const nextList = [...pinnedSideIds, s.id];
                          handleSelectSide(nextList);
                          notify("✓ Karta belgilandi va saqlandi!","success");
                        }
                      }}
                    >
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <img src={s.image} alt="" style={{width:56,height:40,objectFit:"cover",borderRadius:6,flexShrink:0}} loading="lazy" />
                        <div style={{flex:1,minWidth:0}}>
                          <span style={{fontSize:10,fontWeight:800,color:"var(--brand)",textTransform:"uppercase"}}>{s.category}</span>
                          <p style={{margin:"2px 0 0",fontSize:13,fontWeight:700,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{s.title}</p>
                        </div>
                        {isSelected
                          ? <span className="adm-hero-pick-label">{sideIdx === 0 ? "🔼 1" : "🔽 2"}</span>
                          : <span style={{fontSize:11,color:"var(--muted)",flexShrink:0}}>Tanlash</span>
                        }
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="adm-settings-card">
              <h3>🌐 Sayt sozlamalari</h3>
              <p>Saytning umumiy ma'lumotlari</p>
              <div className="adm-form-row">
                <label style={{display:"flex",flexDirection:"column",gap:6}}>
                  Sayt nomi
                  <input value={siteConfig.siteName} onChange={e => setSiteConfig(p=>({...p,siteName:e.target.value}))} placeholder="Ishonch.uz" />
                </label>
                <label style={{display:"flex",flexDirection:"column",gap:6}}>
                  Email
                  <input value={siteConfig.email} onChange={e => setSiteConfig(p=>({...p,email:e.target.value}))} placeholder="news@ishonch.uz" />
                </label>
              </div>
              <div className="adm-form-row">
                <label style={{display:"flex",flexDirection:"column",gap:6}}>
                  Telegram havolasi
                  <input value={siteConfig.telegram} onChange={e => setSiteConfig(p=>({...p,telegram:e.target.value}))} placeholder="https://t.me/..." />
                </label>
                <label style={{display:"flex",flexDirection:"column",gap:6}}>
                  Logo URL
                  <input value={siteConfig.logoUrl} onChange={e => setSiteConfig(p=>({...p,logoUrl:e.target.value}))} placeholder="https://..." />
                </label>
              </div>
              <div className="adm-form-row">
                <label style={{display:"flex",flexDirection:"column",gap:6}}>
                  Instagram havolasi
                  <input value={siteConfig.instagram || ""} onChange={e => setSiteConfig(p=>({...p,instagram:e.target.value}))} placeholder="https://instagram.com/..." />
                </label>
                <label style={{display:"flex",flexDirection:"column",gap:6}}>
                  YouTube havolasi
                  <input value={siteConfig.youtube || ""} onChange={e => setSiteConfig(p=>({...p,youtube:e.target.value}))} placeholder="https://youtube.com/..." />
                </label>
              </div>
              <div className="adm-form-row">
                <label style={{display:"flex",flexDirection:"column",gap:6}}>
                  Facebook havolasi
                  <input value={siteConfig.facebook || ""} onChange={e => setSiteConfig(p=>({...p,facebook:e.target.value}))} placeholder="https://facebook.com/..." />
                </label>
              </div>
              <div className="adm-form-row">
                <label style={{display:"flex",flexDirection:"column",gap:6}}>
                  Tavsif (UZ)
                  <textarea value={siteConfig.descriptionUz || ""} onChange={e => setSiteConfig(p=>({...p,descriptionUz:e.target.value}))} placeholder="Uzbekcha tavsif..." style={{minHeight:60,fontFamily:"inherit",padding:"8px 10px",borderRadius:6,border:"1.5px solid var(--line)"}} />
                </label>
                <label style={{display:"flex",flexDirection:"column",gap:6}}>
                  Описание (RU)
                  <textarea value={siteConfig.descriptionRu || ""} onChange={e => setSiteConfig(p=>({...p,descriptionRu:e.target.value}))} placeholder="Описание на русском..." style={{minHeight:60,fontFamily:"inherit",padding:"8px 10px",borderRadius:6,border:"1.5px solid var(--line)"}} />
                </label>
              </div>
              <button className="adm-btn primary" type="button" onClick={() => saveConfig(siteConfig)}>Saqlash</button>
            </div>

            <div className="adm-settings-card">
              <h3>📞 Aloqa ma'lumotlari (Contacts)</h3>
              <p>Saytning "Aloqa" sahifasida va menyuda ko'rinadigan aloqa ma'lumotlarini boshqaring.</p>
              
              <div className="adm-categories-grid" style={{display:"flex",gap:16,flexWrap:"wrap",marginTop:12}}>
                {/* UZ Contacts */}
                <div style={{flex:1,minWidth:300,background:"var(--fill)",padding:12,borderRadius:8}}>
                  <strong style={{display:"block",marginBottom:8}}>🇺🇿 UZ Aloqa ma'lumotlari</strong>
                  <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:12}}>
                    {(siteConfig.contactUz || []).map((c, idx) => (
                      <div key={idx} style={{display:"flex",flexDirection:"column",gap:4,padding:8,background:"var(--paper)",borderRadius:6,border:"1px solid var(--line)"}}>
                        <div style={{display:"flex",gap:6,alignItems:"center"}}>
                          <input 
                            type="text" 
                            value={c.title} 
                            placeholder="Nomi (Masalan: Tahririyat)"
                            onChange={e => {
                              const newList = [...(siteConfig.contactUz || [])];
                              newList[idx] = { ...newList[idx], title: e.target.value };
                              setSiteConfig(p => ({ ...p, contactUz: newList }));
                            }}
                            style={{flex:1,padding:"4px 8px",fontSize:12,fontWeight:700,border:"1px solid var(--line)",borderRadius:4}}
                          />
                          <button 
                            className="adm-btn danger" 
                            style={{fontSize:10,padding:"2px 6px",height:"auto",minHeight:"unset"}}
                            onClick={() => {
                              const newList = (siteConfig.contactUz || []).filter((_, i) => i !== idx);
                              setSiteConfig(p => ({ ...p, contactUz: newList }));
                            }}
                          >✕</button>
                        </div>
                        <textarea 
                          value={c.value} 
                          placeholder="Qiymati / Tafsiloti"
                          onChange={e => {
                            const newList = [...(siteConfig.contactUz || [])];
                            newList[idx] = { ...newList[idx], value: e.target.value };
                            setSiteConfig(p => ({ ...p, contactUz: newList }));
                          }}
                          style={{width:"100%",minHeight:40,padding:"4px 8px",fontSize:12,border:"1px solid var(--line)",borderRadius:4,fontFamily:"inherit",boxSizing:"border-box"}}
                        />
                      </div>
                    ))}
                  </div>
                  <button 
                    className="adm-btn ghost" 
                    style={{fontSize:11,padding:"6px 12px"}}
                    onClick={() => {
                      setSiteConfig(p => ({ ...p, contactUz: [...(p.contactUz || []), { title: "", value: "" }] }));
                    }}
                  >+ Yangi aloqa qo'shish</button>
                </div>

                {/* RU Contacts */}
                <div style={{flex:1,minWidth:300,background:"var(--fill)",padding:12,borderRadius:8}}>
                  <strong style={{display:"block",marginBottom:8}}>🇷🇺 RU Контакты</strong>
                  <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:12}}>
                    {(siteConfig.contactRu || []).map((c, idx) => (
                      <div key={idx} style={{display:"flex",flexDirection:"column",gap:4,padding:8,background:"var(--paper)",borderRadius:6,border:"1px solid var(--line)"}}>
                        <div style={{display:"flex",gap:6,alignItems:"center"}}>
                          <input 
                            type="text" 
                            value={c.title} 
                            placeholder="Название (Например: Редакция)"
                            onChange={e => {
                              const newList = [...(siteConfig.contactRu || [])];
                              newList[idx] = { ...newList[idx], title: e.target.value };
                              setSiteConfig(p => ({ ...p, contactRu: newList }));
                            }}
                            style={{flex:1,padding:"4px 8px",fontSize:12,fontWeight:700,border:"1px solid var(--line)",borderRadius:4}}
                          />
                          <button 
                            className="adm-btn danger" 
                            style={{fontSize:10,padding:"2px 6px",height:"auto",minHeight:"unset"}}
                            onClick={() => {
                              const newList = (siteConfig.contactRu || []).filter((_, i) => i !== idx);
                              setSiteConfig(p => ({ ...p, contactRu: newList }));
                            }}
                          >✕</button>
                        </div>
                        <textarea 
                          value={c.value} 
                          placeholder="Значение / Детали"
                          onChange={e => {
                            const newList = [...(siteConfig.contactRu || [])];
                            newList[idx] = { ...newList[idx], value: e.target.value };
                            setSiteConfig(p => ({ ...p, contactRu: newList }));
                          }}
                          style={{width:"100%",minHeight:40,padding:"4px 8px",fontSize:12,border:"1px solid var(--line)",borderRadius:4,fontFamily:"inherit",boxSizing:"border-box"}}
                        />
                      </div>
                    ))}
                  </div>
                  <button 
                    className="adm-btn ghost" 
                    style={{fontSize:11,padding:"6px 12px"}}
                    onClick={() => {
                      setSiteConfig(p => ({ ...p, contactRu: [...(p.contactRu || []), { title: "", value: "" }] }));
                    }}
                  >+ Добавить контакт</button>
                </div>
              </div>
              <button className="adm-btn primary" type="button" style={{marginTop:12}} onClick={() => saveConfig(siteConfig)}>Saqlash</button>
            </div>

            <div className="adm-settings-card">
              <h3>📢 Yuqori banner</h3>
              <p>Sayt yuqorisida ko'rinadigan e'lon matni</p>
              <label style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,fontWeight:700,fontSize:13}}>
                <input type="checkbox" checked={siteConfig.bannerActive} onChange={e => setSiteConfig(p=>({...p,bannerActive:e.target.checked}))} />
                Bannerni faollashtirish
              </label>
              <input
                value={siteConfig.bannerText}
                onChange={e => setSiteConfig(p=>({...p,bannerText:e.target.value}))}
                placeholder="E'lon matni..."
                style={{width:"100%",border:"1.5px solid var(--line)",borderRadius:7,padding:"10px 12px",fontSize:14,fontFamily:"inherit",boxSizing:"border-box",marginBottom:12}}
              />
              <button className="adm-btn primary" type="button" onClick={() => saveConfig(siteConfig)}>Saqlash</button>
            </div>

            <div className="adm-settings-card">
              <h3>📂 Ruknlarni boshqarish</h3>
              <p>Sayt sahifalaridagi ruknlarni tahrirlang, o'chiring yoki yangisini qo'shing</p>
              
              <div className="adm-categories-grid" style={{display:"flex",gap:16,flexWrap:"wrap",marginTop:12}}>
                {/* UZ Categories */}
                <div style={{flex:1,minWidth:220,background:"var(--fill)",padding:12,borderRadius:8}}>
                  <strong style={{display:"block",marginBottom:8}}>🇺🇿 UZ Ruknlar</strong>
                  <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:10}}>
                    {(siteConfig.categoriesUz || []).map((cat, idx) => (
                      <div key={idx} style={{display:"flex",gap:6,alignItems:"center"}}>
                        <input 
                          type="text" 
                          value={cat} 
                          onChange={e => {
                            const newList = [...(siteConfig.categoriesUz || [])];
                            newList[idx] = e.target.value;
                            setSiteConfig(p => ({ ...p, categoriesUz: newList }));
                          }}
                          style={{flex:1,padding:"4px 8px",fontSize:12.5,border:"1px solid var(--line)",borderRadius:4}}
                        />
                        <button 
                          className="adm-btn danger" 
                          style={{fontSize:10,padding:"4px 8px",height:"auto",minHeight:"unset"}}
                          onClick={() => {
                            const newList = (siteConfig.categoriesUz || []).filter((_, i) => i !== idx);
                            setSiteConfig(p => ({ ...p, categoriesUz: newList }));
                          }}
                        >✕</button>
                      </div>
                    ))}
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <input 
                      id="new-cat-uz" 
                      placeholder="Yangi rukn..." 
                      style={{flex:1,padding:"6px 8px",fontSize:12.5,border:"1px solid var(--line)",borderRadius:4}} 
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          const val = e.target.value.trim();
                          if (val) {
                            setSiteConfig(p => ({ ...p, categoriesUz: [...(p.categoriesUz || []), val] }));
                            e.target.value = "";
                          }
                        }
                      }}
                    />
                    <button 
                      className="adm-btn primary" 
                      style={{fontSize:11,padding:"6px 10px"}}
                      onClick={() => {
                        const el = document.getElementById("new-cat-uz");
                        const val = el.value.trim();
                        if (val) {
                          setSiteConfig(p => ({ ...p, categoriesUz: [...(p.categoriesUz || []), val] }));
                          el.value = "";
                        }
                      }}
                    >+</button>
                  </div>
                </div>

                {/* RU Categories */}
                <div style={{flex:1,minWidth:220,background:"var(--fill)",padding:12,borderRadius:8}}>
                  <strong style={{display:"block",marginBottom:8}}>🇷🇺 RU Рубрики</strong>
                  <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:10}}>
                    {(siteConfig.categoriesRu || []).map((cat, idx) => (
                      <div key={idx} style={{display:"flex",gap:6,alignItems:"center"}}>
                        <input 
                          type="text" 
                          value={cat} 
                          onChange={e => {
                            const newList = [...(siteConfig.categoriesRu || [])];
                            newList[idx] = e.target.value;
                            setSiteConfig(p => ({ ...p, categoriesRu: newList }));
                          }}
                          style={{flex:1,padding:"4px 8px",fontSize:12.5,border:"1px solid var(--line)",borderRadius:4}}
                        />
                        <button 
                          className="adm-btn danger" 
                          style={{fontSize:10,padding:"4px 8px",height:"auto",minHeight:"unset"}}
                          onClick={() => {
                            const newList = (siteConfig.categoriesRu || []).filter((_, i) => i !== idx);
                            setSiteConfig(p => ({ ...p, categoriesRu: newList }));
                          }}
                        >✕</button>
                      </div>
                    ))}
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <input 
                      id="new-cat-ru" 
                      placeholder="Новая рубрика..." 
                      style={{flex:1,padding:"6px 8px",fontSize:12.5,border:"1px solid var(--line)",borderRadius:4}} 
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          const val = e.target.value.trim();
                          if (val) {
                            setSiteConfig(p => ({ ...p, categoriesRu: [...(p.categoriesRu || []), val] }));
                            e.target.value = "";
                          }
                        }
                      }}
                    />
                    <button 
                      className="adm-btn primary" 
                      style={{fontSize:11,padding:"6px 10px"}}
                      onClick={() => {
                        const el = document.getElementById("new-cat-ru");
                        const val = el.value.trim();
                        if (val) {
                          setSiteConfig(p => ({ ...p, categoriesRu: [...(p.categoriesRu || []), val] }));
                          el.value = "";
                        }
                      }}
                    >+</button>
                  </div>
                </div>

                {/* UZK Categories */}
                <div style={{flex:1,minWidth:220,background:"var(--fill)",padding:12,borderRadius:8}}>
                  <strong style={{display:"block",marginBottom:8}}>🇺🇿 ЎЗ Рукнлар (Кирилл)</strong>
                  <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:10}}>
                    {(siteConfig.categoriesUzk || []).map((cat, idx) => (
                      <div key={idx} style={{display:"flex",gap:6,alignItems:"center"}}>
                        <input 
                          type="text" 
                          value={cat} 
                          onChange={e => {
                            const newList = [...(siteConfig.categoriesUzk || [])];
                            newList[idx] = e.target.value;
                            setSiteConfig(p => ({ ...p, categoriesUzk: newList }));
                          }}
                          style={{flex:1,padding:"4px 8px",fontSize:12.5,border:"1px solid var(--line)",borderRadius:4}}
                        />
                        <button 
                          className="adm-btn danger" 
                          style={{fontSize:10,padding:"4px 8px",height:"auto",minHeight:"unset"}}
                          onClick={() => {
                            const newList = (siteConfig.categoriesUzk || []).filter((_, i) => i !== idx);
                            setSiteConfig(p => ({ ...p, categoriesUzk: newList }));
                          }}
                        >✕</button>
                      </div>
                    ))}
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <input 
                      id="new-cat-uzk" 
                      placeholder="Янги рукн..." 
                      style={{flex:1,padding:"6px 8px",fontSize:12.5,border:"1px solid var(--line)",borderRadius:4}} 
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          const val = e.target.value.trim();
                          if (val) {
                            setSiteConfig(p => ({ ...p, categoriesUzk: [...(p.categoriesUzk || []), val] }));
                            e.target.value = "";
                          }
                        }
                      }}
                    />
                    <button 
                      className="adm-btn primary" 
                      style={{fontSize:11,padding:"6px 10px"}}
                      onClick={() => {
                        const el = document.getElementById("new-cat-uzk");
                        const val = el.value.trim();
                        if (val) {
                          setSiteConfig(p => ({ ...p, categoriesUzk: [...(p.categoriesUzk || []), val] }));
                          el.value = "";
                        }
                      }}
                    >+</button>
                  </div>
                </div>
              </div>

              <button 
                className="adm-btn primary" 
                style={{marginTop:12}} 
                onClick={() => saveConfig(siteConfig)}
              >Saqlash</button>
            </div>

            <div className="adm-settings-card">
              <h3>🔒 Parolni o'zgartirish</h3>
              <p>Yangi parol kamida 6 belgidan iborat bo'lsin.</p>
              <form onSubmit={changePassword} style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Yangi parol..."
                  style={{flex:1,minWidth:200}}
                />
                <button className="adm-btn primary" type="submit">Saqlash</button>
              </form>
            </div>
            <div className="adm-settings-card danger-zone">
              <h3>⚠️ Xavfli zona</h3>
              <p>Demo maqolalarni tiklash barcha mavjud maqolalarni o'chiradi.</p>
              <button className="adm-btn danger" onClick={resetContent}>↺ Demo maqolalarni tiklash</button>
            </div>
          </div>
        )}
      </main>

      {/* 🖼️ HTML5 Canvas Cropper Modal */}
      {cropSrc && (
        <div className="adm-crop-modal">
          <div className="adm-crop-content">
            <h3>🖼️ Rasmni 16:9 formatda qirqish</h3>
            <p className="adm-crop-hint">Rasmni joylashtirish va kattalashtirish uchun slayderlardan foydalaning</p>
            
            <div className="adm-crop-canvas-wrap">
              <canvas ref={cropCanvasRef} width="640" height="360" className="adm-crop-canvas" />
            </div>

            <div className="adm-crop-controls">
              <div className="adm-crop-control-row">
                <span>🔍 Kattalashtirish (Scale)</span>
                <input 
                  type="range" 
                  min="100" 
                  max="300" 
                  value={cropSliders.scale} 
                  onChange={e => setCropSliders(p => ({ ...p, scale: Number(e.target.value) }))} 
                />
                <span className="val">{cropSliders.scale}%</span>
              </div>
              <div className="adm-crop-control-row">
                <span>↔️ Chap/O'ng (Pan X)</span>
                <input 
                  type="range" 
                  min="-50" 
                  max="50" 
                  value={cropSliders.x} 
                  onChange={e => setCropSliders(p => ({ ...p, x: Number(e.target.value) }))} 
                />
                <span className="val">{cropSliders.x}</span>
              </div>
              <div className="adm-crop-control-row">
                <span>↕️ Tepa/Past (Pan Y)</span>
                <input 
                  type="range" 
                  min="-50" 
                  max="50" 
                  value={cropSliders.y} 
                  onChange={e => setCropSliders(p => ({ ...p, y: Number(e.target.value) }))} 
                />
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

function AdBanner({ ads, position }) {
  const active = (ads || []).filter(a => a.active && a.position === position);
  if (!active.length) return null;
  const ad = active[Math.floor(Date.now() / 30000) % active.length];
  if (!ad) return null;

  useEffect(() => {
    if (ad && ad.id) {
      fetch(`/api/ads/impression/${ad.id}`, { method: "POST" }).catch(() => null);
    }
  }, [ad.id]);

  const handleAdClick = () => {
    if (ad && ad.id) {
      fetch(`/api/ads/click/${ad.id}`, { method: "POST" }).catch(() => null);
    }
  };

  const sizes = {
    top:     { height: 90, label: "728×90 Leaderboard" },
    bottom:  { height: 90, label: "728×90 Leaderboard" },
    sidebar: { height: 250, label: "300×250 Rectangle" },
    inline:  { height: 100, label: "468×100 Banner" },
  };
  const sz = sizes[position] || sizes.inline;

  return (
    <div className={`ad-banner ad-banner-${position}`}>
      <span className="ad-label">Reklama</span>
      {ad.link ? (
        <a href={ad.link} target="_blank" rel="noopener noreferrer" className="ad-inner" onClick={handleAdClick} style={{minHeight: sz.height}}>
          {ad.image ? (
            <img src={ad.image} alt={ad.title || "Reklama"} />
          ) : (
            <div className="ad-text-banner">
              {ad.title && <strong>{ad.title}</strong>}
              {ad.subtitle && <span>{ad.subtitle}</span>}
            </div>
          )}
        </a>
      ) : (
        <div className="ad-inner" style={{minHeight: sz.height}}>
          {ad.image ? (
            <img src={ad.image} alt={ad.title || "Reklama"} />
          ) : (
            <div className="ad-text-banner">
              {ad.title && <strong>{ad.title}</strong>}
              {ad.subtitle && <span>{ad.subtitle}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );