CREATE TABLE IF NOT EXISTS deposit_accounts (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	account_id uuid NOT NULL REFERENCES user_accounts(id),
	start_date date NOT NULL,
	maturity_date date NOT NULL,
	start_balance REAL NOT NULL,
	maturity_balance REAL NOT null
);

ALTER TABLE IF EXISTS deposit_accounts ADD COLUMN IF NOT EXISTS interest_rate REAL NOT NULL;