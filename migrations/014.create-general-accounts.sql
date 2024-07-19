CREATE TABLE IF NOT EXISTS general_accounts (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	account_type uuid NOT NULL REFERENCES account_type(id),
	account_id integer NOT NULL DEFAULT nextval('account_id_seq'),
	balance REAL DEFAULT 0.00
);