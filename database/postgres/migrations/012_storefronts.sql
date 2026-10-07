CREATE TABLE IF NOT EXISTS storefronts (
    storefront_id   BIGSERIAL PRIMARY KEY,
    business_id     BIGINT NOT NULL REFERENCES businesses(business_id) ON DELETE CASCADE,
    slug            VARCHAR(120) NOT NULL UNIQUE,
    display_name    VARCHAR(120) NOT NULL,
    is_published    BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_storefronts_business
    ON storefronts (business_id);

COMMENT ON TABLE storefronts IS 'Public storefront configuration for a business.';
