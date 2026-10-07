CREATE TABLE IF NOT EXISTS voice_profiles (
    voice_id            BIGSERIAL PRIMARY KEY,
    account_id          INT NOT NULL UNIQUE,
    fingerprint_cipher  BYTEA NOT NULL,
    kms_key_id          VARCHAR(255) NOT NULL,
    enrolled_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE
);

COMMENT ON TABLE voice_profiles IS 'Per-account voice fingerprints. Raw audio is never stored here.';
