DROP TABLE IF EXISTS Admins;
DROP TABLE IF EXISTS HODs;
DROP TABLE IF EXISTS Clubs;
DROP TABLE IF EXISTS ClubCoordinators;
DROP TABLE IF EXISTS Members;
DROP TABLE IF EXISTS Permissions;
DROP TABLE IF EXISTS Notifications;
DROP TABLE IF EXISTS AuditLogs;

CREATE TABLE Admins (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE HODs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Clubs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ClubCoordinators (
  id TEXT PRIMARY KEY,
  club_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (club_id) REFERENCES Clubs(id)
);

CREATE TABLE Members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  roll_number TEXT UNIQUE NOT NULL,
  department TEXT NOT NULL,
  year INTEGER NOT NULL,
  section TEXT NOT NULL,
  club_id TEXT NOT NULL,
  position TEXT,
  status TEXT DEFAULT 'active',
  photo_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (club_id) REFERENCES Clubs(id)
);

CREATE TABLE Permissions (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL,
  hod_id TEXT NOT NULL,
  date TEXT NOT NULL, -- YYYY-MM-DD
  time TEXT NOT NULL,
  purpose TEXT NOT NULL,
  remark TEXT,
  status TEXT DEFAULT 'granted',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES Members(id),
  FOREIGN KEY (hod_id) REFERENCES HODs(id),
  UNIQUE (member_id, date) -- Enforce one permission per day
);

CREATE TABLE Notifications (
  id TEXT PRIMARY KEY,
  recipient_id TEXT NOT NULL,
  recipient_role TEXT NOT NULL, -- coordinator, admin, etc.
  message TEXT NOT NULL,
  read_status INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE AuditLogs (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  user_role TEXT,
  action TEXT NOT NULL,
  details TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
