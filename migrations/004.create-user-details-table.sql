CREATE TABLE  IF NOT EXISTS user_details (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	email varchar(50) UNIQUE NOT NULL,
	first_name varchar(50) NOT NULL,
	last_name varchar(50),
	gender gender_enum NOT NULL,
	date_of_birth date
);