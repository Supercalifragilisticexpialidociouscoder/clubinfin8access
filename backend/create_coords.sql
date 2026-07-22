
CREATE TABLE IF NOT EXISTS coordinator_credentials (
  id TEXT PRIMARY KEY,
  club_id INTEGER NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  login_attempts INTEGER DEFAULT 0,
  locked_until TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (club_id) REFERENCES clubs(id)
);

CREATE INDEX IF NOT EXISTS idx_coord_cred_email ON coordinator_credentials(email);
CREATE INDEX IF NOT EXISTS idx_coord_cred_club ON coordinator_credentials(club_id);

DELETE FROM coordinator_credentials;

INSERT INTO coordinator_credentials (id, club_id, email, password_hash)
VALUES ('fdb5a34f-4054-481d-a45c-0328405c60ec', 1, 'technicalclub@infin8access.com', '$2b$10$hxBcDOM82OSsNZknzja1ZeTZ.HIHSRqfEu/xyr33eAdTObWhqan/6');

INSERT INTO coordinator_credentials (id, club_id, email, password_hash)
VALUES ('de6a41ff-354c-44a4-ac86-8305f9523469', 2, 'financialliteracyclub@infin8access.com', '$2b$10$9O34XnWsXDoCYmcW5sf.S.vIZYTlnvIEoVbEIQs4LPdyTR.4Uzc8m');

INSERT INTO coordinator_credentials (id, club_id, email, password_hash)
VALUES ('9f7c385e-c92d-47ef-892b-4b5eb3c80dfa', 3, 'culturalclub@infin8access.com', '$2b$10$DVjtbV6qern./TZCaXQO4OSpqU0vULqLDLFPiriiF5kJI9AD35L6W');

INSERT INTO coordinator_credentials (id, club_id, email, password_hash)
VALUES ('29ffac03-7c92-46ba-bb27-6229511781e6', 4, 'filmclub@infin8access.com', '$2b$10$Jh3aFhO.5oaF5Zk70wITRe7XXDoj4.A8nBUx7.FUIwUpP3f5UOW4m');

INSERT INTO coordinator_credentials (id, club_id, email, password_hash)
VALUES ('cf416801-e5ca-4fa7-8a16-048a09af4c41', 5, 'mediaclub@infin8access.com', '$2b$10$nKKsCGL3pZx0I1Yx8mCVIuYgBK8a4JZexxtmqZSisf0x0oRXYdUze');

INSERT INTO coordinator_credentials (id, club_id, email, password_hash)
VALUES ('f776bf6d-3d37-4aae-981f-be6b82de6c01', 6, 'sportsclub@infin8access.com', '$2b$10$dRrM9bGqrD.qwXJfzY/NZeTeRIy6eK9uQpxR3rwFRTKdHX1k4ZMvC');

INSERT INTO coordinator_credentials (id, club_id, email, password_hash)
VALUES ('1057b58b-909e-4680-848b-5e7b4d32637c', 7, 'innovationclub@infin8access.com', '$2b$10$3Xp7AhoYivYbScnxNv8.heeraPKPmuScdY/JFuQC2DzjWzItVFDWS');

INSERT INTO coordinator_credentials (id, club_id, email, password_hash)
VALUES ('f027ce85-da71-47e6-950d-44e9bce9d461', 8, 'womenempowermentclub@infin8access.com', '$2b$10$Rzi9c4vENbcBOtCnxdNr/OwbqsereFuTywl/T6kuQDvnk2BMNzuCO');
