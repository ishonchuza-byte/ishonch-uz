import re

server_path = 'server.js'

with open(server_path, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Modify the collections array in readDb() to include "videos"
old_collections = 'const collections = ["quotes", "journals", "messages", "comments", "tags", "pages", "authors", "subscribers", "payments", "sentNewsletters"];'
new_collections = 'const collections = ["quotes", "journals", "messages", "comments", "tags", "pages", "authors", "subscribers", "payments", "sentNewsletters", "videos"];'

if old_collections in code:
    code = code.replace(old_collections, new_collections)
    print("Added 'videos' to database collections array in server.js")
else:
    print("Warning: collections array target not found in server.js")

# 2. Add seeding logic for videos in readDb()
seed_logic = """
  // Seeding default videos if empty
  if (!db.videos || db.videos.length === 0) {
    db.videos = [
      { id: "v-1", type: "video", title: "Dunyoda nechta AES bor va ularning birinchisi qayerda qurilgan?", meta: "Jahon | 09:38", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "uz" },
      { id: "v-2", type: "video", title: "Marg'ilonda yangi turizm majmuasi va 7 millionga yaqinlashgan o'rtacha ish haqi", meta: "O'zbekiston | 19:50", image: "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "uz" },
      { id: "v-3", type: "video", title: "Aksiyadorlardan qarzdorlik, kompensatsiya masalasi sudlashyaptimi?", meta: "O'zbekiston | 19:00", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "uz" },
      { id: "v-4", type: "video", title: "LIVE: Vashingtondagi otishma va Moskvaga borgan Aroqcchi", meta: "Jahon | 15:07", image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "uz" },
      { id: "v-5", type: "video", title: "Putin-Aroqcchi uchrashuvi, Eron taklifi va kun dayjesti", meta: "Jahon | 14:48", image: "https://images.unsplash.com/photo-1541872705-1f73c6400ec9?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "uz" },
      { id: "v-6", type: "video", title: "Tramp suiqasddan omon chiqdi, yana!", meta: "Jahon | 22:19", image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "uz" },
      { id: "v-7", type: "video", title: "Дунёда нечта АЕС бор ва уларнинг биринчиси қаерда қурилган?", meta: "Дунё | 09:38", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "uzk" },
      { id: "v-8", type: "video", title: "Марғилонда янги туризм мажмуаси ва ўртача иш ҳақи", meta: "Ўзбекистон | 19:50", image: "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "uzk" },
      { id: "v-9", type: "video", title: "Акциядорлардан қарздорлик ва компенсация", meta: "Ўзбекистон | 19:00", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "uzk" },
      { id: "v-10", type: "video", title: "LIVE: Вашингтондаги отишма ва Москвага борган Ароқччи", meta: "Дунё | 15:07", image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "uzk" },
      { id: "v-11", type: "video", title: "Путин-Ароқччи учрашуви, Эрон таклифи ва кун дайжести", meta: "Дунё | 14:48", image: "https://images.unsplash.com/photo-1541872705-1f73c6400ec9?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "uzk" },
      { id: "v-12", type: "video", title: "Трамп суиқасддан омон чиқди", meta: "Дунё | 22:19", image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "uzk" },
      { id: "v-13", type: "video", title: "Сколько в мире АЭС и где построили первую?", meta: "Мир | 09:38", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "ru" },
      { id: "v-14", type: "video", title: "Новый туристический комплекс и рынок труда", meta: "Узбекистан | 19:50", image: "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "ru" },
      { id: "v-15", type: "video", title: "Долги перед акционерами и компенсации", meta: "Узбекистан | 19:00", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "ru" },
      { id: "v-16", type: "video", title: "LIVE: стрельба в Вашингтоне и переговоры в Москве", meta: "Мир | 15:07", image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "ru" },
      { id: "v-17", type: "video", title: "Встреча Путина, предложение Ирана и дайджест", meta: "Мир | 14:48", image: "https://images.unsplash.com/photo-1541872705-1f73c6400ec9?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "ru" },
      { id: "v-18", type: "video", title: "Трамп пережил покушение", meta: "Мир | 22:19", image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "ru" }
    ];
    modified = true;
  }
"""

read_db_end = """  if (modified) {
    writeDb(db);
  }"""

if read_db_end in code:
    code = code.replace(read_db_end, seed_logic + "\n" + read_db_end)
    print("Added video seeding logic in readDb() in server.js")
else:
    print("Warning: readDb() closing block not found in server.js")

# 3. Add Public API for videos
public_quotes_route = """  if (request.method === "GET" && pathname === "/api/public/quotes") {
    db.quotes = db.quotes || [];
    const activeQuotes = db.quotes.filter(q => q.status === "active");
    sendJson(response, 200, { quotes: activeQuotes });
    return;
  }"""

public_videos_route = """  if (request.method === "GET" && pathname === "/api/public/quotes") {
    db.quotes = db.quotes || [];
    const activeQuotes = db.quotes.filter(q => q.status === "active");
    sendJson(response, 200, { quotes: activeQuotes });
    return;
  }
  if (request.method === "GET" && pathname === "/api/public/videos") {
    db.videos = db.videos || [];
    sendJson(response, 200, { videos: db.videos });
    return;
  }"""

if public_quotes_route in code:
    code = code.replace(public_quotes_route, public_videos_route)
    print("Added public GET /api/public/videos endpoint in server.js")
else:
    print("Warning: public quotes route not found in server.js")

# 4. Add Admin APIs for videos
admin_quotes_delete_route = """  if (quoteMatch && request.method === "DELETE") {
    const id = quoteMatch[1];
    db.quotes = (db.quotes || []).filter(q => q.id !== id);
    writeDb(db);
    sendJson(response, 200, { quotes: db.quotes });
    return;
  }"""

admin_videos_routes = """  if (quoteMatch && request.method === "DELETE") {
    const id = quoteMatch[1];
    db.quotes = (db.quotes || []).filter(q => q.id !== id);
    writeDb(db);
    sendJson(response, 200, { quotes: db.quotes });
    return;
  }

  // Videos
  if (request.method === "GET" && pathname === "/api/admin/videos") {
    sendJson(response, 200, { videos: db.videos || [] });
    return;
  }
  if (request.method === "POST" && pathname === "/api/admin/videos") {
    const body = await readJson(request);
    const item = {
      id: crypto.randomUUID(),
      type: String(body.type || "video").trim(),
      title: String(body.title || "").trim(),
      meta: String(body.meta || "").trim(),
      image: String(body.image || "").trim(),
      url: String(body.url || "").trim(),
      lang: String(body.lang || "uz").trim(),
      createdAt: new Date().toISOString()
    };
    db.videos = db.videos || [];
    db.videos.unshift(item);
    writeDb(db);
    sendJson(response, 200, { videos: db.videos });
    return;
  }
  const videoMatch = pathname.match(/^\/api\/admin\/videos\/([^/]+)$/);
  if (videoMatch && request.method === "PUT") {
    const id = videoMatch[1];
    const body = await readJson(request);
    db.videos = db.videos || [];
    const index = db.videos.findIndex(v => v.id === id);
    if (index !== -1) {
      db.videos[index] = {
        ...db.videos[index],
        type: body.type !== undefined ? String(body.type).trim() : db.videos[index].type,
        title: body.title !== undefined ? String(body.title).trim() : db.videos[index].title,
        meta: body.meta !== undefined ? String(body.meta).trim() : db.videos[index].meta,
        image: body.image !== undefined ? String(body.image).trim() : db.videos[index].image,
        url: body.url !== undefined ? String(body.url).trim() : db.videos[index].url,
        lang: body.lang !== undefined ? String(body.lang).trim() : db.videos[index].lang,
        updatedAt: new Date().toISOString()
      };
      writeDb(db);
    }
    sendJson(response, 200, { videos: db.videos });
    return;
  }
  if (videoMatch && request.method === "DELETE") {
    const id = videoMatch[1];
    db.videos = (db.videos || []).filter(v => v.id !== id);
    writeDb(db);
    sendJson(response, 200, { videos: db.videos });
    return;
  }"""

if admin_quotes_delete_route in code:
    code = code.replace(admin_quotes_delete_route, admin_videos_routes)
    print("Added admin /api/admin/videos endpoints in server.js")
else:
    print("Warning: admin quotes delete route not found in server.js")

with open(server_path, 'w', encoding='utf-8') as f:
    f.write(code)
print("Finished modifying server.js")
