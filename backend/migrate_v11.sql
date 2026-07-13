-- ClubPass v1.1 Additive Migration
-- Safe to run multiple times (uses IF NOT EXISTS).
-- Never drops, renames, or destroys existing data.

-- ============================================================
-- 1. Faculty-Club Assignments (fixes Feature 1)
--    Maps faculty members to the clubs they coordinate.
-- ============================================================

CREATE TABLE IF NOT EXISTS faculty_club_assignments (
  faculty_member_id INTEGER NOT NULL,
  club_id INTEGER NOT NULL,
  assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (faculty_member_id, club_id)
);

CREATE INDEX IF NOT EXISTS idx_fca_club ON faculty_club_assignments(club_id);

-- ============================================================
-- 2. Settings table (Feature 12)
-- ============================================================

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed default settings
INSERT OR IGNORE INTO settings (key, value) VALUES ('college_name', 'Malla Reddy Technical Campus');
INSERT OR IGNORE INTO settings (key, value) VALUES ('college_logo', '');
INSERT OR IGNORE INTO settings (key, value) VALUES ('member_id_prefix', 'CP');
INSERT OR IGNORE INTO settings (key, value) VALUES ('qr_url_prefix', 'https://clubpass.pages.dev/verify/');
INSERT OR IGNORE INTO settings (key, value) VALUES ('password_min_length', '12');
INSERT OR IGNORE INTO settings (key, value) VALUES ('session_timeout_hours', '24');

-- ============================================================
-- 3. Add status columns where missing
-- ============================================================

-- admins.status (enable/disable admin accounts)
ALTER TABLE admins ADD COLUMN status TEXT DEFAULT 'active';

-- hods.status (enable/disable HOD accounts)
ALTER TABLE hods ADD COLUMN status TEXT DEFAULT 'active';

-- ============================================================
-- 4. Login security columns on admins/hods
-- ============================================================

ALTER TABLE admins ADD COLUMN login_attempts INTEGER DEFAULT 0;
ALTER TABLE admins ADD COLUMN locked_until TEXT;

ALTER TABLE hods ADD COLUMN login_attempts INTEGER DEFAULT 0;
ALTER TABLE hods ADD COLUMN locked_until TEXT;
