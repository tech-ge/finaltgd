CREATE TABLE IF NOT EXISTS family_circles (
    circle_id       BIGSERIAL PRIMARY KEY,
    owner_account   INT NOT NULL,
    circle_name     VARCHAR(120) NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS family_members (
    member_id       BIGSERIAL PRIMARY KEY,
    circle_id       BIGINT NOT NULL REFERENCES family_circles(circle_id) ON DELETE CASCADE,
    account_id      INT NOT NULL,
    role            VARCHAR(30) NOT NULL DEFAULT 'MEMBER'
        CHECK (role IN ('OWNER','MEMBER','GUARDIAN')),
    joined_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (circle_id, account_id)
);

COMMENT ON TABLE family_circles IS 'Group of accounts that can receive emergency announcements.';
