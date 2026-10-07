CREATE TABLE IF NOT EXISTS identity_traceback (
    identity_id         BIGSERIAL PRIMARY KEY,
    account_id          INT NOT NULL UNIQUE,
    national_id_cipher  BYTEA NOT NULL,
    nationality_cipher  BYTEA NOT NULL,
    kms_key_id          VARCHAR(255) NOT NULL,
    verified_at         TIMESTAMP,
    dispute_record_id   BIGINT,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE identity_traceback IS 'Encrypted national identity records. Access requires dispute record and audit entry.';
