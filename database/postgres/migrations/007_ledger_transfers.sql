CREATE TABLE IF NOT EXISTS ledger_transfers (
    transfer_id     BIGSERIAL PRIMARY KEY,
    operation       VARCHAR(30) NOT NULL
        CHECK (operation IN ('DEPOSIT_FIAT','SEND_INTERNAL','SEND_BUSINESS','ESCROW_LOCK','ESCROW_RELEASE','MOVE_TO_EARN')),
    from_account    INT REFERENCES ledger_accounts(account_id),
    to_account      INT NOT NULL REFERENCES ledger_accounts(account_id),
    amount          DECIMAL(18, 4) NOT NULL CHECK (amount > 0),
    currency_code   VARCHAR(10) NOT NULL DEFAULT 'TGD',
    reference       VARCHAR(100) NOT NULL UNIQUE,
    idempotency_key VARCHAR(100) NOT NULL UNIQUE,
    memo            TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_transfer_accounts CHECK (from_account IS NULL OR from_account <> to_account)
);

CREATE INDEX IF NOT EXISTS idx_transfers_from
    ON ledger_transfers (from_account, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_transfers_to
    ON ledger_transfers (to_account, created_at DESC);

COMMENT ON TABLE ledger_transfers IS 'Double-entry ledger transfers. Withdrawal is not a valid operation.';
