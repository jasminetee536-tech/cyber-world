CREATE TABLE IF NOT EXISTS shadow_daily (
  day TEXT PRIMARY KEY NOT NULL,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_shadow_daily_created ON shadow_daily(created_at);
