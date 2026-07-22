INSERT INTO members (id, uuid, full_name, email, member_type, status, year) VALUES (2, 'u2', 'Test2', 't2@test.com', 'student', 'active', 2) ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, member_uuid, hod_id, date, time) VALUES ('p2', 'u2', 'h1', '2023-01-01', '10:00') ON CONFLICT DO NOTHING;
