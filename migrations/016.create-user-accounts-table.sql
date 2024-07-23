CREATE TABLE IF NOT EXISTS user_accounts (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	account_number integer NOT NULL DEFAULT nextval('account_id_seq'),
	account_type uuid NOT NULL REFERENCES account_type(id),
	user_id uuid NOT NULL REFERENCES users(id),
	created_at timestamp DEFAULT now(),
	closed_at timestamp
);