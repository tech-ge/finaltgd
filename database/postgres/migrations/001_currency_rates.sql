CREATE TABLE IF NOT EXISTS currency_rates (
    rate_id             SERIAL PRIMARY KEY,
    fiat_currency_code  VARCHAR(3) NOT NULL UNIQUE,
    fiat_per_one_tgd    DECIMAL(18, 4) NOT NULL CHECK (fiat_per_one_tgd > 0),
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    last_updated        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_currency_rates_active
    ON currency_rates (is_active) WHERE is_active = TRUE;

COMMENT ON TABLE currency_rates IS 'Fiat-to-TGD conversion ratios. One row per fiat currency.';
