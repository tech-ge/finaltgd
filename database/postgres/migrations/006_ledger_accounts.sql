CREATE TABLE IF NOT EXISTS ledger_accounts (
    account_id      SERIAL PRIMARY KEY,
    owner_type      VARCHAR(20) NOT NULL CHECK (owner_type IN ('USER','BUSINESS','TREASURY','ESCROW')),
    owner_ref       VARCHAR(100) NOT NULL,
    currency_code   VARCHAR(10) NOT NULL DEFAULT 'TGD',
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (owner_type, owner_ref, currency_code)
);

CREATE INDEX IF NOT EXISTS idx_ledger_accounts_owner
    ON ledger_accounts (owner_type, owner_ref);

COMMENT ON TABLE ledger_accounts IS 'Accounts participating in the TGD ledger.';
