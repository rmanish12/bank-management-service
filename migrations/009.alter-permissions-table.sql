ALTER TABLE IF EXISTS permissions ADD COLUMN IF NOT EXISTS created_at timestamp DEFAULT now();
ALTER TABLE IF EXISTS permissions ADD COLUMN IF NOT EXISTS modified_at timestamp DEFAULT now();
ALTER TABLE IF EXISTS permissions ADD COLUMN IF NOT EXISTS created_by uuid NOT NULL REFERENCES users(id);
ALTER TABLE IF EXISTS permissions ADD COLUMN IF NOT EXISTS last_modified_by uuid NOT NULL REFERENCES users(id);