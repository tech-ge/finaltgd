CREATE TABLE IF NOT EXISTS employees (
    employee_id     SERIAL PRIMARY KEY,
    org_id          INT NOT NULL REFERENCES organizations(org_id) ON DELETE CASCADE,
    full_name       VARCHAR(100) NOT NULL,
    device_uuid     VARCHAR(255) NOT NULL UNIQUE,
    role            VARCHAR(20) NOT NULL CHECK (role IN ('CEO','ADMIN','SUPERVISOR','WORKER')),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_employees_org
    ON employees (org_id);

CREATE INDEX IF NOT EXISTS idx_employees_role
    ON employees (org_id, role);

COMMENT ON TABLE employees IS 'Workers and management bound to a single device fingerprint.';
