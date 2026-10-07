CREATE TABLE IF NOT EXISTS audit_logs (
    log_id          BIGSERIAL PRIMARY KEY,
    actor_account   INT,
    actor_role      VARCHAR(20),
    action          VARCHAR(80) NOT NULL,
    target_type     VARCHAR(40),
    target_ref      VARCHAR(120),
    metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address      VARCHAR(45),
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_actor_time
    ON audit_logs (actor_account, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_action_time
    ON audit_logs (action, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_target
    ON audit_logs (target_type, target_ref);

COMMENT ON TABLE audit_logs IS 'Immutable trail of privileged actions. Rows are never updated or deleted.';
