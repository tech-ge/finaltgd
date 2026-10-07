CREATE TABLE IF NOT EXISTS businesses (
    business_id     BIGSERIAL PRIMARY KEY,
    owner_account   INT NOT NULL,
    business_name   VARCHAR(120) NOT NULL UNIQUE,
    category        VARCHAR(60),
    address         TEXT,
    latitude        DECIMAL(10, 8),
    longitude       DECIMAL(11, 8),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_businesses_active
    ON businesses (is_active) WHERE is_active = TRUE;

COMMENT ON TABLE businesses IS 'Merchant businesses accepting TGD.';
