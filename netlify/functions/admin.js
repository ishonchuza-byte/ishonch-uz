const crypto = require('crypto');

// Password hashing functions
function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, saved) {
  const [salt, hash] = saved.split(":");
  const testHash = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(testHash, "hex"));
}

function normalizeStory(input) {
  const now = new Date().toISOString();
  return {
    id: input.id || crypto.randomUUID(),
    category: String(input.category || "Siyosat").trim(),
    title: String(input.title || "").trim(),
    summary: String(input.summary || "").trim(),
    image: String(input.image || "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80").trim(),
    author: String(input.author || "Ishonch.uz tahririyati").trim(),
    time: String(input.time || "Hozir").trim(),
    read: String(input.read || "3 daqiqa").trim(),
    body: String(input.body || "").trim(),
    status: input.status === "draft" ? "draft" : "published",
    slug: input.slug || null,
    tags: input.tags || "",
    meta_title: input.metaTitle || "",
    meta_desc: input.metaDesc || "",
    is_hero: input.isHero ? 1 : 0,
    is_editor_pick: input.isEditorPick ? 1 : 0,
    is_breaking: input.isBreaking ? 1 : 0,
    views: input.views || 0,
    count_views: input.countViews ? 1 : 0,
    script: input.script || "latin",
    publish_at: input.publishAt || null,
    created_at: input.createdAt || now,
    updated_at: now,
  };
}

async function requireAdmin(event, DB) {
  const cookie = event.headers.cookie || '';
  const tokenMatch = cookie.match(/yk_session=([^;]+)/);
  const token = tokenMatch ? tokenMatch[1] : null;

  if (!token) return false;

  try {
    const session = await DB.prepare(`
      SELECT expires_at FROM sessions 
      WHERE token = ? AND expires_at > datetime('now')
    `).bind(token).first();
    return !!session;
  } catch (error) {
    return false;
  }
}

export async function handler(event, context) {
  const { DB } = process.env;

  // Check if D1 database is available
  if (!DB) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ 
        error: "Netlify D1 database mavjud emas. Netlify dashboardda D1 database yaratish va netlify.toml da database_id ni yangilash kerak." 
      }) 
    };
  }

  try {
    // Parse path
    const url = new URL(event.rawUrl || event.url, `http://${event.headers.host}`);
    const pathname = url.pathname;

    // GET /api/admin/session
    if (event.httpMethod === 'GET' && pathname === '/api/admin/session') {
      const cookie = event.headers.cookie || '';
      const tokenMatch = cookie.match(/yk_session=([^;]+)/);
      const token = tokenMatch ? tokenMatch[1] : null;

      if (!token) {
        return { statusCode: 200, body: JSON.stringify({ authenticated: false }) };
      }

      const session = await DB.prepare(`
        SELECT expires_at FROM sessions 
        WHERE token = ? AND expires_at > datetime('now')
      `).bind(token).first();

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authenticated: !!session })
      };
    }

    // POST /api/admin/login
    if (event.httpMethod === 'POST' && pathname === '/api/admin/login') {
      const body = JSON.parse(event.body);
      
      const adminResult = await DB.prepare('SELECT password_hash FROM admin LIMIT 1').first();
      
      if (!adminResult) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Admin not found' }) };
      }

      if (!body.password || !verifyPassword(body.password, adminResult.password_hash)) {
        return { statusCode: 401, body: JSON.stringify({ error: 'Parol noto\'g\'ri' }) };
      }

      const token = crypto.randomBytes(32).toString("hex");
      const sessionTtlMs = 1000 * 60 * 60 * 12;
      
      await DB.prepare(`
        INSERT INTO sessions (token, expires_at) 
        VALUES (?, datetime('now', '+' || (? / 1000) || ' seconds'))
      `).bind(token, sessionTtlMs).run();

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `yk_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${sessionTtlMs / 1000}`
        },
        body: JSON.stringify({ ok: true })
      };
    }

    // POST /api/admin/logout
    if (event.httpMethod === 'POST' && pathname === '/api/admin/logout') {
      const cookie = event.headers.cookie || '';
      const tokenMatch = cookie.match(/yk_session=([^;]+)/);
      const token = tokenMatch ? tokenMatch[1] : null;

      if (token) {
        await DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
      }

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': 'yk_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0'
        },
        body: JSON.stringify({ ok: true })
      };
    }

    // Require authentication for other endpoints
    const authenticated = await requireAdmin(event, DB);
    if (!authenticated) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
    }

    // GET /api/admin/stories
    if (event.httpMethod === 'GET' && pathname === '/api/admin/stories') {
      const stories = await DB.prepare(`
        SELECT * FROM stories 
        ORDER BY created_at DESC
      `).all();

      const result = {
        uz: stories.results.filter(s => s.lang === 'uz'),
        ru: stories.results.filter(s => s.lang === 'ru'),
        uzk: stories.results.filter(s => s.lang === 'uzk'),
      };

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stories: result })
      };
    }

    // POST /api/admin/stories
    if (event.httpMethod === 'POST' && pathname === '/api/admin/stories') {
      const body = JSON.parse(event.body);
      const lang = body.lang === 'ru' ? 'ru' : 'uz';
      const item = normalizeStory(body.story);
      item.lang = lang;

      await DB.prepare(`
        INSERT INTO stories (
          id, lang, category, title, summary, body, image, author, time, read,
          status, slug, tags, meta_title, meta_desc, is_hero, is_editor_pick,
          is_breaking, views, count_views, script, publish_at, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        item.id, item.lang, item.category, item.title, item.summary, item.body,
        item.image, item.author, item.time, item.read, item.status, item.slug,
        item.tags, item.meta_title, item.meta_desc, item.is_hero, item.is_editor_pick,
        item.is_breaking, item.views, item.count_views, item.script, item.publish_at,
        item.created_at, item.updated_at
      ).run();

      const stories = await DB.prepare('SELECT * FROM stories ORDER BY created_at DESC').all();
      const result = {
        uz: stories.results.filter(s => s.lang === 'uz'),
        ru: stories.results.filter(s => s.lang === 'ru'),
        uzk: stories.results.filter(s => s.lang === 'uzk'),
      };

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ story: item, stories: result })
      };
    }

    // PUT /api/admin/stories/:lang/:id
    const pathMatch = pathname.match(/^\/api\/admin\/stories\/(uz|uzk|ru)\/([^/]+)$/);
    if (pathMatch && event.httpMethod === 'PUT') {
      const [, lang, id] = pathMatch;
      const body = JSON.parse(event.body);
      const item = normalizeStory({ ...body.story, id });
      item.lang = lang;

      await DB.prepare(`
        UPDATE stories SET
          category = ?, title = ?, summary = ?, body = ?, image = ?, author = ?,
          time = ?, read = ?, status = ?, slug = ?, tags = ?, meta_title = ?,
          meta_desc = ?, is_hero = ?, is_editor_pick = ?, is_breaking = ?,
          views = ?, count_views = ?, script = ?, publish_at = ?, updated_at = ?
        WHERE id = ? AND lang = ?
      `).bind(
        item.category, item.title, item.summary, item.body, item.image, item.author,
        item.time, item.read, item.status, item.slug, item.tags, item.meta_title,
        item.meta_desc, item.is_hero, item.is_editor_pick, item.is_breaking,
        item.views, item.count_views, item.script, item.publish_at, item.updated_at,
        id, lang
      ).run();

      const stories = await DB.prepare('SELECT * FROM stories ORDER BY created_at DESC').all();
      const result = {
        uz: stories.results.filter(s => s.lang === 'uz'),
        ru: stories.results.filter(s => s.lang === 'ru'),
        uzk: stories.results.filter(s => s.lang === 'uzk'),
      };

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ story: item, stories: result })
      };
    }

    // DELETE /api/admin/stories/:lang/:id
    if (pathMatch && event.httpMethod === 'DELETE') {
      const [, lang, id] = pathMatch;

      await DB.prepare('DELETE FROM stories WHERE id = ? AND lang = ?').bind(id, lang).run();

      const stories = await DB.prepare('SELECT * FROM stories ORDER BY created_at DESC').all();
      const result = {
        uz: stories.results.filter(s => s.lang === 'uz'),
        ru: stories.results.filter(s => s.lang === 'ru'),
        uzk: stories.results.filter(s => s.lang === 'uzk'),
      };

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stories: result })
      };
    }

    // POST /api/admin/password
    if (event.httpMethod === 'POST' && pathname === '/api/admin/password') {
      const body = JSON.parse(event.body);
      
      if (!body.password || body.password.length < 6) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak' }) };
      }

      const passwordHash = hashPassword(body.password);
      await DB.prepare('UPDATE admin SET password_hash = ?').bind(passwordHash).run();

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: true })
      };
    }

    // GET /api/admin/media
    if (event.httpMethod === 'GET' && pathname === '/api/admin/media') {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          media: [],
          warning: 'Netlify Functions da file system yo\'q. Netlify Blobs yoki AWS S3 ishlatish kerak.' 
        })
      };
    }

    // DELETE /api/admin/media/:name
    if (event.httpMethod === 'DELETE' && pathname.startsWith('/api/admin/media/')) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ok: true,
          warning: 'Netlify Functions da file system yo\'q. Netlify Blobs yoki AWS S3 ishlatish kerak.' 
        })
      };
    }

    // POST /api/admin/upload
    if (event.httpMethod === 'POST' && pathname === '/api/admin/upload') {
      const body = JSON.parse(event.body);
      const match = String(body.dataUrl || "").match(/^data:((image|video)\/(png|jpeg|jpg|webp|gif|mp4|webm|ogg|mov));base64,(.+)$/);
      
      if (!match) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Fayl turi qabul qilinmadi' }) };
      }

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: body.dataUrl,
          type: match[2],
          warning: 'Netlify Functions da file system yo\'q. Netlify Blobs yoki AWS S3 ishlatish kerak.' 
        })
      };
    }

    return { statusCode: 404, body: JSON.stringify({ error: 'API topilmadi' }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}
