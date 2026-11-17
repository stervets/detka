CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY);
CREATE TABLE content (
 kind TEXT NOT NULL CHECK(kind IN ('page','service','employee','article','media','price','settings','business_card')),
 slug TEXT NOT NULL,
 payload TEXT NOT NULL CHECK(json_valid(payload)),
 visible INTEGER NOT NULL DEFAULT 0 CHECK(visible IN (0,1)),
 sort_order INTEGER NOT NULL DEFAULT 0,
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(kind,slug)
);
CREATE TABLE callbacks (
 id INTEGER PRIMARY KEY,
 name TEXT NOT NULL,
 phone TEXT NOT NULL,
 comment TEXT NOT NULL,
 consent_version TEXT NOT NULL,
 consent_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 status TEXT NOT NULL DEFAULT 'new',
 notification_status TEXT NOT NULL DEFAULT 'pending'
);
CREATE TABLE notification_attempts (
 id INTEGER PRIMARY KEY, callback_id INTEGER NOT NULL REFERENCES callbacks(id),
 result TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE rate_limits (ip_hash TEXT PRIMARY KEY, window_start INTEGER NOT NULL, attempts INTEGER NOT NULL);
CREATE TABLE publications (
 id INTEGER PRIMARY KEY, started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 finished_at TEXT, status TEXT NOT NULL, content_hash TEXT NOT NULL, error TEXT
);
INSERT INTO schema_migrations VALUES (1);
