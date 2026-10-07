CREATE TABLE IF NOT EXISTS fiat_deposits (
    deposit_id          SERIAL PRIMARY KEY,
    account_id          INT NOT NULL,
    fiat_amount         DECIMAL(18, 2) NOT NULL CHECK (fiat_amount > 0),
    fiat_currency       VARCHAR(3) NOT NULL DEFAULT 'KES',
    applied_rate        DECIMAL(18, 4) NOT NULL CHECK (applied_rate > 0),
    tgd_credited        DECIMAL(18, 4) NOT NULL CHECK (tgd_credited > 0),
    gateway_reference   VARCHAR(100) NOT NULL UNIQUE,
    gateway_name        VARCHAR(30) NOT NULL,
    status              VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED'
        CHECK (status IN ('PENDING','CONFIRMED','FAILED','REVERSED')),
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_deposits_account
    ON fiat_deposits (account_id, created_at DESC);

COMMENT ON TABLE fiat_deposits IS 'Fiat on-ramp records. Gateway reference is unique to guard against duplicates.';
