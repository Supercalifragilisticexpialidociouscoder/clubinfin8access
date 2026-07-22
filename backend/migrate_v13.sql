-- Migration v13: Add role column to admins table for Read-Only Admin feature
ALTER TABLE admins ADD COLUMN role TEXT DEFAULT 'super_admin';
