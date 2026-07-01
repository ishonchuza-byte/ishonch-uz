-- Admin table
CREATE TABLE IF NOT EXISTS admin (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  password_hash TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Stories table
CREATE TABLE IF NOT EXISTS stories (
  id TEXT PRIMARY KEY,
  lang TEXT NOT NULL CHECK(lang IN ('uz', 'uzk', 'ru')),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  body TEXT NOT NULL,
  image TEXT,
  author TEXT,
  time TEXT,
  read TEXT,
  slug TEXT,
  status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
  tags TEXT,
  meta_title TEXT,
  meta_desc TEXT,
  is_hero INTEGER DEFAULT 0,
  is_editor_pick INTEGER DEFAULT 0,
  is_breaking INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  count_views INTEGER DEFAULT 1,
  script TEXT DEFAULT 'latin',
  publish_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Insert default admin (password: admin2026)
-- Note: This is a placeholder. You need to generate a real hash for production.
INSERT INTO admin (password_hash)
VALUES ('scrypt:16:a1b2c3d4e5f6a7b8:placeholder_hash_update_me')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stories_lang ON stories(lang);
CREATE INDEX IF NOT EXISTS idx_stories_status ON stories(status);
CREATE INDEX IF NOT EXISTS idx_stories_slug ON stories(slug);
