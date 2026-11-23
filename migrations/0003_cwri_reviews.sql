CREATE TABLE IF NOT EXISTS cwri_reviews (
 day TEXT NOT NULL,
 window_days INTEGER NOT NULL,
 cve TEXT NOT NULL,
 baseline_day TEXT NOT NULL,
 previous_level TEXT,
 current_level TEXT,
 changed INTEGER NOT NULL DEFAULT 0,
 reason TEXT NOT NULL,
 source_url TEXT NOT NULL,
 PRIMARY KEY(day,window_days,cve)
);
CREATE INDEX IF NOT EXISTS idx_cwri_reviews_day ON cwri_reviews(day DESC);
