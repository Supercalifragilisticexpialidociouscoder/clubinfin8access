-- ClubPass v1.2 Part 2 Additive Migration

-- 1. Add completed_at to tracking when coordinators mark permissions as done
ALTER TABLE permissions ADD COLUMN completed_at TEXT;

-- 2. Add club_id to permissions to easily filter by club
-- (This helps coordinators query their club's active permissions without complex joins)
ALTER TABLE permissions ADD COLUMN club_id TEXT;
