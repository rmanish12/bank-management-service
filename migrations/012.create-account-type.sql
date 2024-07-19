CREATE TABLE IF NOT EXISTS account_type (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	name varchar(50) UNIQUE NOT NULL,
	description varchar(255),
	created_at timestamp DEFAULT now(),
	modified_at timestamp DEFAULT now(),
	created_by uuid NOT NULL REFERENCES users(id),
	last_modified_by uuid NOT NULL REFERENCES users(id)
);