CREATE TABLE IF NOT EXISTS organizations (
    org_id              SERIAL PRIMARY KEY,
    manager_name        VARCHAR(100) NOT NULL,
    business_name       VARCHAR(100) NOT NULL UNIQUE,
    office_latitude     DECIMAL(10, 8) NOT NULL CHECK (office_latitude BETWEEN -90 AND 90),
    office_longitude    DECIMAL(11, 8) NOT NULL CHECK (office_longitude BETWEEN -180 AND 180),
    office_static_ip    VARCHAR(45) NOT NULL,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_organizations_ip
    ON organizations (office_static_ip);

COMMENT ON TABLE organizations IS 'Business organizations with registered office location and gateway IP.';
