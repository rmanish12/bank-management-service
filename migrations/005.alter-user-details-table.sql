ALTER TABLE IF EXISTS user_details  ADD COLUMN IF NOT EXISTS created_at timestamp DEFAULT now();
ALTER TABLE IF EXISTS user_details ADD COLUMN IF NOT EXISTS modified_at timestamp DEFAULT now();