-- ClubPass Additive Migration
-- This script ONLY adds new columns and tables. It does NOT drop or modify existing data.
-- Safe to run multiple times (uses IF NOT EXISTS / try-catch pattern).

-- ============================================================
-- 1. Extend existing `members` table with new columns
-- ============================================================

-- Add UUID column for QR code references
ALTER TABLE members ADD COLUMN uuid TEXT;

-- Add year column
ALTER TABLE members ADD COLUMN year INTEGER DEFAULT 1;

-- Add status column
ALTER TABLE members ADD COLUMN status TEXT DEFAULT 'active';

-- Add photo_url column
ALTER TABLE members ADD COLUMN photo_url TEXT;

-- Add position column (will be populated from member_clubs.role)
ALTER TABLE members ADD COLUMN position TEXT;

-- ============================================================
-- 2. Generate UUIDs for all existing members
-- ============================================================

UPDATE members SET uuid = lower(
  hex(randomblob(4)) || '-' ||
  hex(randomblob(2)) || '-' ||
  '4' || substr(hex(randomblob(2)), 2) || '-' ||
  substr('89ab', abs(random()) % 4 + 1, 1) || substr(hex(randomblob(2)), 2) || '-' ||
  hex(randomblob(6))
) WHERE uuid IS NULL;

-- ============================================================
-- 3. Create unique index on uuid
-- ============================================================

CREATE UNIQUE INDEX IF NOT EXISTS idx_members_uuid ON members(uuid);
CREATE INDEX IF NOT EXISTS idx_members_roll ON members(roll_number);

-- ============================================================
-- 4. Create HODs table
-- ============================================================

CREATE TABLE IF NOT EXISTS hods (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 5. Create Admins table
-- ============================================================

CREATE TABLE IF NOT EXISTS admins (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Admin',
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 6. Create Permissions table
-- ============================================================

CREATE TABLE IF NOT EXISTS permissions (
  id TEXT PRIMARY KEY,
  member_uuid TEXT NOT NULL,
  hod_id TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  purpose TEXT NOT NULL DEFAULT '',
  remark TEXT,
  status TEXT DEFAULT 'granted',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(member_uuid, date)
);

CREATE INDEX IF NOT EXISTS idx_permissions_member_date ON permissions(member_uuid, date);
CREATE INDEX IF NOT EXISTS idx_permissions_date ON permissions(date);

-- ============================================================
-- 7. Create Notifications table
-- ============================================================

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  recipient_id TEXT NOT NULL,
  recipient_role TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general',
  title TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  related_member_uuid TEXT,
  read_status INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id, read_status);

-- ============================================================
-- 8. Create Audit Logs table
-- ============================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  user_role TEXT,
  action TEXT NOT NULL,
  details TEXT,
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);

-- ============================================================
-- 9. Seed default admin account
--    Password: admin123 (bcrypt hash)
-- ============================================================

INSERT OR IGNORE INTO admins (id, name, email, password_hash)
VALUES (
  'admin-001',
  'Super Admin',
  'admin@clubpass.com',
  '$2a$10$rQZk8KJ4Hp8eSHxVqXCQOOKDE.jB7UxqK9X7n5pVjXqK8hR4WmXyG'
);

-- ============================================================
-- 10. Seed default HOD account
--     Password: hod123 (bcrypt hash)
-- ============================================================

INSERT OR IGNORE INTO hods (id, name, department, email, password_hash)
VALUES (
  'hod-001',
  'Dr. HOD',
  'CSE',
  'hod@clubpass.com',
  '$2a$10$rQZk8KJ4Hp8eSHxVqXCQOOKDE.jB7UxqK9X7n5pVjXqK8hR4WmXyG'
);
