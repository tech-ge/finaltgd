-- Development seed. Never run in production.
-- Creates demo ledger accounts for the demo employees.

INSERT INTO ledger_accounts (owner_type, owner_ref, currency_code)
VALUES
    ('USER', 'demo-user-1', 'TGD'),
    ('USER', 'demo-user-2', 'TGD'),
    ('BUSINESS', 'demo-business-1', 'TGD')
ON CONFLICT (owner_type, owner_ref, currency_code) DO NOTHING;

COMMENT ON TABLE fiat_deposits IS 'Fiat on-ramp records. Gateway reference is unique.';
