INSERT INTO currency_rates (fiat_currency_code, fiat_per_one_tgd, is_active)
VALUES
    ('KES', 100.0000, TRUE),
    ('USD', 0.7800, TRUE),
    ('EUR', 0.7200, TRUE),
    ('GBP', 0.6200, TRUE),
    ('UGX', 2900.0000, TRUE),
    ('TZS', 1950.0000, TRUE)
ON CONFLICT (fiat_currency_code) DO NOTHING;
