-- Migration v14: Add explicit manual close support
ALTER TABLE permissions ADD COLUMN closed_at TEXT;
ALTER TABLE permissions ADD COLUMN closed_by TEXT;
