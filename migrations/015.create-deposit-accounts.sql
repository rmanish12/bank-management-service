CREATE TABLE IF NOT EXISTS deposit_accounts (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	account_type uuid NOT NULL REFERENCES account_type(id),
	account_id integer NOT NULL DEFAULT nextval('account_id_seq'),
	start_date date NOT NULL,
	maturity_date date NOT NULL,
	start_balance REAL NOT NULL,
	maturity_balance REAL NOT null
);