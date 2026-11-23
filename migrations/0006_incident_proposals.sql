CREATE TABLE IF NOT EXISTS incident_assessment_proposals (incident_id TEXT PRIMARY KEY NOT NULL, payload TEXT NOT NULL CHECK(json_valid(payload)), created_at TEXT NOT NULL);
