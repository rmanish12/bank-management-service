CREATE TABLE IF NOT EXISTS permissions (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	name varchar(50) NOT NULL,
	description varchar(255)
);