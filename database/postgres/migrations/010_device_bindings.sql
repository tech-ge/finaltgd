CREATE TABLE IF NOT EXISTS device_bindings (
    binding_id          BIGSERIAL PRIMARY KEY,
    account_id          INT NOT NULL UNIQUE,
    device_fingerprint  VARCHAR(255) NOT NULL UNIQUE,
    bound_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revoked_at          TIMESTAMP,
    revocation_reason   TEXT
);

CREATE INDEX IF NOT EXISTS idx_device_bindings_fp
    ON device_bindings (device_fingerprint);

COMMENT ON TABLE device_bindings IS 'One phone per account. Rebinding requires dispute and re-verification.';
