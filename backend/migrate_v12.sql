-- ClubPass v1.2 Additive Migration
-- Safe to run multiple times (uses IF NOT EXISTS).
-- Never drops, renames, or destroys existing data.

-- ============================================================
-- 1. Student Credentials (student login with roll number)
-- ============================================================

CREATE TABLE IF NOT EXISTS student_credentials (
  member_id INTEGER PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  must_change_password INTEGER DEFAULT 1,
  last_login TEXT,
  login_attempts INTEGER DEFAULT 0,
  locked_until TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id)
);

CREATE INDEX IF NOT EXISTS idx_student_cred_username ON student_credentials(username);

-- ============================================================
-- 2. Permission extensions
-- ============================================================

-- Expected return time (HH:MM format)
ALTER TABLE permissions ADD COLUMN expected_return_time TEXT;

-- When the permission was approved/rejected
ALTER TABLE permissions ADD COLUMN approved_at TEXT;

-- ============================================================
-- 3. Club extensions
-- ============================================================

-- Club active/disabled status
ALTER TABLE clubs ADD COLUMN status TEXT DEFAULT 'active';

-- ============================================================
-- 4. Member ID sequence table
--    Tracks the next CLB- number for auto-provisioning
-- ============================================================

CREATE TABLE IF NOT EXISTS id_sequences (
  name TEXT PRIMARY KEY,
  current_value INTEGER NOT NULL DEFAULT 0
);

-- Initialize member ID sequence from current max member id
INSERT OR IGNORE INTO id_sequences (name, current_value)
VALUES ('member_id', (SELECT COALESCE(MAX(id), 0) FROM members));

-- ============================================================
-- 5. New default settings for v1.2
-- ============================================================

INSERT OR IGNORE INTO settings (key, value) VALUES ('member_id_format', 'CLB-{ID}');
INSERT OR IGNORE INTO settings (key, value) VALUES ('app_version', '1.2');
INSERT OR IGNORE INTO settings (key, value) VALUES ('theme', 'dark');
INSERT OR IGNORE INTO settings (key, value) VALUES ('notification_enabled', 'true');
