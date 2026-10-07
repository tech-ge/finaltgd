CREATE TABLE IF NOT EXISTS escrow_transactions (
    escrow_id           BIGSERIAL PRIMARY KEY,
    reference           VARCHAR(100) NOT NULL UNIQUE,
    from_account        INT NOT NULL REFERENCES ledger_accounts(account_id),
    to_account          INT NOT NULL REFERENCES ledger_accounts(account_id),
    escrow_account      INT NOT NULL REFERENCES ledger_accounts(account_id),
    amount              DECIMAL(18, 4) NOT NULL CHECK (amount > 0),
    currency_code       VARCHAR(10) NOT NULL DEFAULT 'TGD',
    state               VARCHAR(20) NOT NULL DEFAULT 'LOCKED'
        CHECK (state IN ('LOCKED','RELEASED','CANCELLED','EXPIRED')),
    release_latitude    DECIMAL(10, 8),
    release_longitude   DECIMAL(11, 8),
    release_radius_m    INT DEFAULT 50 CHECK (release_radius_m > 0),
    release_biometric   BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at          TIMESTAMP,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_escrow_state
    ON escrow_transactions (state);

CREATE INDEX IF NOT EXISTS idx_escrow_expires
    ON escrow_transactions (expires_at) WHERE state = 'LOCKED';

COMMENT ON TABLE escrow_transactions IS 'Conditional settlement holds. Release requires GPS plus biometric.';
