ALTER TABLE HODs ADD COLUMN role TEXT DEFAULT 'hod';

UPDATE HODs 
SET role = 'poc' 
WHERE email IN (
  'pocece@infin8access.com', 
  'poccsm@infin8access.com', 
  'pocds@infin8access.com', 
  'poccse@infin8access.com'
);
