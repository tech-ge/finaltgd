CREATE OR REPLACE FUNCTION fn_escrow_lock(
    p_from_account      INT,
    p_to_account        INT,
    p_amount            DECIMAL,
    p_reference         VARCHAR,
    p_idempotency_key   VARCHAR,
    p_release_lat       DECIMAL DEFAULT NULL,
    p_release_lon       DECIMAL DEFAULT NULL,
    p_release_radius_m  INT DEFAULT 50,
    p_expires_in_hours  INT DEFAULT 72
) RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    v_escrow_account INT;
    v_escrow_id      BIGINT;
BEGIN
    IF p_amount <= 0 THEN
        RAISE EXCEPTION 'amount_must_be_positive';
    END IF;

    SELECT account_id INTO v_escrow_account
    FROM ledger_accounts
    WHERE owner_type = 'ESCROW' AND currency_code = 'TGD'
    LIMIT 1;

    IF v_escrow_account IS NULL THEN
        RAISE EXCEPTION 'escrow_account_missing';
    END IF;

    INSERT INTO escrow_transactions (
        reference, from_account, to_account, escrow_account, amount,
        release_latitude, release_longitude, release_radius_m, expires_at
    ) VALUES (
        p_reference, p_from_account, p_to_account, v_escrow_account, p_amount,
        p_release_lat, p_release_lon, p_release_radius_m,
        CURRENT_TIMESTAMP + (p_expires_in_hours || ' hours')::INTERVAL
    )
    ON CONFLICT (reference) DO NOTHING
    RETURNING escrow_id INTO v_escrow_id;

    IF v_escrow_id IS NULL THEN
        SELECT escrow_id INTO v_escrow_id
        FROM escrow_transactions
        WHERE reference = p_reference;
        RETURN v_escrow_id;
    END IF;

    PERFORM fn_atomic_transfer(
        'ESCROW_LOCK',
        p_from_account,
        v_escrow_account,
        p_amount,
        'escrow-lock:' || p_reference,
        'escrow-lock:' || p_idempotency_key,
        'Funds held pending release conditions'
    );

    RETURN v_escrow_id;
END;
$$;

COMMENT ON FUNCTION fn_escrow_lock IS 'Hold funds in escrow. Release requires GPS and biometric confirmation.';
