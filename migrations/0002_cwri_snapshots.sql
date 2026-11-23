CREATE TABLE IF NOT EXISTS cwri_snapshots (
  day TEXT PRIMARY KEY,
  payload TEXT NOT NULL,
  recorded_at TEXT NOT NULL
);
