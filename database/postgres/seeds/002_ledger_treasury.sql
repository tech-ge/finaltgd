INSERT INTO ledger_accounts (owner_type, owner_ref, currency_code)
VALUES
    ('TREASURY', 'techgeo-primary-treasury', 'TGD'),
    ('ESCROW', 'techgeo-primary-escrow', 'TGD')
ON CONFLICT (owner_type, owner_ref, currency_code) DO NOTHING;
