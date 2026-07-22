INSERT INTO hods (id, name, email, department) VALUES ('h3', 'HOD3', 'hod3@test.com', 'CSE') ON CONFLICT DO NOTHING;
INSERT INTO permissions (id, member_uuid, hod_id, date, time) VALUES ('p3', 'u3', 'h3', '2023-01-01', '10:00') ON CONFLICT DO NOTHING;
