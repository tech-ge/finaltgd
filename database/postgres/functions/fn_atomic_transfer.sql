CREATE OR REPLACE FUNCTION fn_atomic_transfer(
    p_operation         VARCHAR,
    p_from_account      INT,
    p_to_account        INT,
    p_amount            DECIMAL,
    p_reference         VARCHAR,
    p_idempotency_key   VARCHAR,
    p_memo              TEXT DEFAULT NULL
) RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    v_transfer_id BIGINT;
BEGIN
    IF p_operation NOT IN ('DEPOSIT_FIAT','SEND_INTERNAL','SEND_BUSINESS','ESCROW_LOCK','ESCROW_RELEASE','MOVE_TO_EARN') THEN
        RAISE EXCEPTION 'operation_not_allowed: %', p_operation;
    END IF;

    IF p_operation = 'DEPOSIT_FIAT' THEN
        RAISE EXCEPTION 'deposit_fiat_must_use_fn_mint_tgd';
    END IF;

    IF p_amount <= 0 THEN
        RAISE EXCEPTION 'amount_must_be_positive';
    END IF;

    IF p_from_account = p_to_account THEN
        RAISE EXCEPTION 'from_and_to_must_differ';
    END IF;

    INSERT INTO ledger_transfers (
        operation, from_account, to_account, amount, reference, idempotency_key, memo
    ) VALUES (
        p_operation, p_from_account, p_to_account, p_amount, p_reference, p_idempotency_key, p_memo
    )
    ON CONFLICT (idempotency_key) DO NOTHING
    RETURNING transfer_id INTO v_transfer_id;

    IF v_transfer_id IS NULL THEN
        SELECT transfer_id INTO v_transfer_id
        FROM ledger_transfers
        WHERE idempotency_key = p_idempotency_key;
    END IF;

    RETURN v_transfer_id;
END;
$$;

COMMENT ON FUNCTION fn_atomic_transfer IS 'Insert a double-entry ledger transfer. Withdrawal is not an allowed operation.';
