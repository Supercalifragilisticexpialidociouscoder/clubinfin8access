BEGIN TRANSACTION;

CREATE TABLE permissions_new (
  id TEXT PRIMARY KEY,
  member_uuid TEXT NOT NULL,
  hod_id TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  purpose TEXT NOT NULL DEFAULT '',
  remark TEXT,
  status TEXT DEFAULT 'granted',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
  closed_at TEXT, 
  closed_by TEXT, 
  close_reason TEXT, 
  completed_at TEXT, 
  club_id TEXT,
  expected_return_time TEXT,
  approved_at TEXT
);

INSERT INTO permissions_new 
SELECT id, member_uuid, hod_id, date, time, purpose, remark, status, created_at, closed_at, closed_by, close_reason, completed_at, club_id, expected_return_time, approved_at
FROM permissions;

DROP TABLE permissions;
ALTER TABLE permissions_new RENAME TO permissions;

COMMIT;
