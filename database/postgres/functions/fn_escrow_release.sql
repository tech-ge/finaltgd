CREATE OR REPLACE FUNCTION fn_escrow_release(
    p_escrow_id         BIGINT,
    p_release_lat       DECIMAL,
    p_release_lon       DECIMAL,
    p_biometric_ok      BOOLEAN,
    p_idempotency_key   VARCHAR
) RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    v_row           escrow_transactions%ROWTYPE;
    v_within_radius BOOLEAN;
BEGIN
    SELECT * INTO v_row
    FROM escrow_transactions
    WHERE escrow_id = p_escrow_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'escrow_not_found: %', p_escrow_id;
    END IF;

    IF v_row.state <> 'LOCKED' THEN
        RAISE EXCEPTION 'escrow_not_locked: state=%', v_row.state;
    END IF;

    IF NOT p_biometric_ok THEN
        RAISE EXCEPTION 'biometric_required';
    END IF;

    IF v_row.release_latitude IS NOT NULL AND v_row.release_longitude IS NOT NULL THEN
        v_within_radius := (
            6371000 * acos(
                cos(radians(v_row.release_latitude)) * cos(radians(p_release_lat)) *
                cos(radians(p_release_lon) - radians(v_row.release_longitude)) +
                sin(radians(v_row.release_latitude)) * sin(radians(p_release_lat))
            )
        ) <= v_row.release_radius_m;

        IF NOT v_within_radius THEN
            RAISE EXCEPTION 'release_outside_radius';
        END IF;
    END IF;

    UPDATE escrow_transactions
    SET state = 'RELEASED',
        release_biometric = TRUE,
        updated_at = CURRENT_TIMESTAMP
    WHERE escrow_id = p_escrow_id;

    PERFORM fn_atomic_transfer(
        'ESCROW_RELEASE',
        v_row.escrow_account,
        v_row.to_account,
        v_row.amount,
        'escrow-release:' || v_row.reference,
        'escrow-release:' || p_idempotency_key,
        'Released on condition match'
    );

    RETURN p_escrow_id;
END;
$$;

COMMENT ON FUNCTION fn_escrow_release IS 'Release escrow to recipient after GPS and biometric verification.';
