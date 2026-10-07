CREATE TABLE IF NOT EXISTS rbac_roles (
    role_id         SERIAL PRIMARY KEY,
    role_name       VARCHAR(20) NOT NULL UNIQUE
        CHECK (role_name IN ('CEO','ADMIN','SUPERVISOR','WORKER')),
    description     TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rbac_permissions (
    permission_id   SERIAL PRIMARY KEY,
    role_id         INT NOT NULL REFERENCES rbac_roles(role_id) ON DELETE CASCADE,
    resource        VARCHAR(60) NOT NULL,
    action          VARCHAR(20) NOT NULL,
    UNIQUE (role_id, resource, action)
);

INSERT INTO rbac_roles (role_name, description) VALUES
    ('CEO', 'Create Admins, view all organization data'),
    ('ADMIN', 'Create Supervisors, view team data'),
    ('SUPERVISOR', 'Create Workers, view live attendance'),
    ('WORKER', 'View own attendance only')
ON CONFLICT (role_name) DO NOTHING;

COMMENT ON TABLE rbac_roles IS 'Static role definitions. Enum-backed.';
