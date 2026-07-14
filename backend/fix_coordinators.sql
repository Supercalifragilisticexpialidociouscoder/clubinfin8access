-- Clear existing faculty assignments
DELETE FROM faculty_club_assignments;

-- Create missing faculty members (using INSERT OR IGNORE if they exist)
INSERT OR IGNORE INTO members (roll_number, full_name, email, member_type, uuid, status, position) 
VALUES 
('FAC-SABIR', 'Mr. Sabir', 'sabir@clubpass.com', 'faculty', lower(hex(randomblob(16))), 'active', 'Coordinator'),
('FAC-SAIDHUL', 'Mr. Saidhul Yadav', 'saidhulyadav@clubpass.com', 'faculty', lower(hex(randomblob(16))), 'active', 'Coordinator');

-- Technical Club
INSERT INTO faculty_club_assignments (club_id, faculty_member_id)
SELECT c.id, m.id FROM clubs c, members m 
WHERE c.name = 'Technical Club' AND m.full_name IN ('Mr. Nalamasa Ramesh', 'Mr. Anand Adlakadi');

-- Cultural Club
INSERT INTO faculty_club_assignments (club_id, faculty_member_id)
SELECT c.id, m.id FROM clubs c, members m 
WHERE c.name = 'Cultural Club' AND m.full_name IN ('Ms. M. Devarshini', 'Ms. Vaddepelli Sathwika');

-- Women Empowerment Club
INSERT INTO faculty_club_assignments (club_id, faculty_member_id)
SELECT c.id, m.id FROM clubs c, members m 
WHERE c.name = 'Women Empowerment Club' AND m.full_name IN ('Mrs. Jhili Patro', 'Ms. Pillarisetty Alekhya');

-- Film Club
INSERT INTO faculty_club_assignments (club_id, faculty_member_id)
SELECT c.id, m.id FROM clubs c, members m 
WHERE c.name = 'Film Club' AND m.full_name IN ('Mr. Madgula Mahesh', 'Mr. Susanta Sahu');

-- Media Club
INSERT INTO faculty_club_assignments (club_id, faculty_member_id)
SELECT c.id, m.id FROM clubs c, members m 
WHERE c.name = 'Media Club' AND m.full_name IN ('Ms. Dyavanapally Shirishha', 'Ms. Noureen Tabassum');

-- Financial Literacy Club
INSERT INTO faculty_club_assignments (club_id, faculty_member_id)
SELECT c.id, m.id FROM clubs c, members m 
WHERE c.name = 'Financial Literacy Club' AND m.full_name IN ('Mr. M. Srikanth', 'Mr. A. Paparao');

-- Sports Club
INSERT INTO faculty_club_assignments (club_id, faculty_member_id)
SELECT c.id, m.id FROM clubs c, members m 
WHERE c.name = 'Sports Club' AND m.full_name IN ('Mr. Sabir', 'Mr. Saidhul Yadav');

-- Innovation & Entrepreneurship Club
INSERT INTO faculty_club_assignments (club_id, faculty_member_id)
SELECT c.id, m.id FROM clubs c, members m 
WHERE c.name = 'Innovation and entrepreneurship' AND m.full_name IN ('Mrs. Tanneru Venkata Lavanya', 'Mrs. V. Nikitha');
