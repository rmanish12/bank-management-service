CREATE TABLE IF NOT EXISTS rate_of_interest (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	min_days integer NOT NULL UNIQUE,
	max_days integer NOT NULL UNIQUE,
	interest_rate REAL NOT null
);

ALTER TABLE IF EXISTS rate_of_interest ADD COLUMN IF NOT EXISTS created_at timestamp DEFAULT now();
ALTER TABLE IF EXISTS rate_of_interest ADD COLUMN IF NOT EXISTS last_modified_at timestamp DEFAULT now();
ALTER TABLE IF EXISTS rate_of_interest ADD COLUMN IF NOT EXISTS created_by uuid NOT NULL REFERENCES users(id);
ALTER TABLE IF EXISTS rate_of_interest ADD COLUMN IF NOT EXISTS last_modified_by uuid NOT NULL REFERENCES users(id);