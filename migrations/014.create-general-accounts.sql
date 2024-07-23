CREATE TABLE IF NOT EXISTS general_accounts (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	account_id uuid NOT NULL REFERENCES user_accounts(id),
	balance REAL DEFAULT 0.00
);