-- Curated, independently verified incident resolution records.
-- Only insert a row after a human editor checks the original source and resolution evidence.
-- initial_day refers to the saved daily assessment; resolution does NOT rewrite that score.
CREATE TABLE IF NOT EXISTS shadow_resolutions (
  initial_day TEXT PRIMARY KEY NOT NULL REFERENCES shadow_daily(day),
  reviewed_at TEXT NOT NULL,
  evidence_urls TEXT NOT NULL CHECK(json_valid(evidence_urls)),
  note TEXT NOT NULL
);
