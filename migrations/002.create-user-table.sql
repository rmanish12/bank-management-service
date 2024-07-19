CREATE TABLE IF NOT EXISTS users (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id integer DEFAULT nextval('user_id_seq'),
	password varchar(255) NOT NULL,
	is_active boolean DEFAULT TRUE,
	created_at timestamp DEFAULT now(),
	modified_at timestamp DEFAULT now()
);