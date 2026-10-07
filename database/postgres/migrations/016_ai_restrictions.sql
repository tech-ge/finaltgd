CREATE TABLE IF NOT EXISTS ai_restrictions (
    restriction_id  BIGSERIAL PRIMARY KEY,
    account_id      INT NOT NULL,
    reason          VARCHAR(120) NOT NULL,
    starts_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ends_at         TIMESTAMP NOT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_restriction_window CHECK (ends_at > starts_at)
);

CREATE INDEX IF NOT EXISTS idx_ai_restrictions_account_active
    ON ai_restrictions (account_id, is_active) WHERE is_active = TRUE;

COMMENT ON TABLE ai_restrictions IS 'Two-day AI usage restrictions triggered by rule violations.';
