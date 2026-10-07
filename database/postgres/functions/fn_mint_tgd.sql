CREATE OR REPLACE FUNCTION fn_mint_tgd(
    p_account_id        INT,
    p_fiat_amount       DECIMAL,
    p_fiat_currency     VARCHAR,
    p_gateway_reference VARCHAR,
    p_gateway_name      VARCHAR
) RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    v_rate          DECIMAL(18,4);
    v_tgd           DECIMAL(18,4);
    v_deposit_id    BIGINT;
    v_treasury_id   INT;
BEGIN
    IF p_fiat_amount <= 0 THEN
        RAISE EXCEPTION 'fiat_amount_must_be_positive';
    END IF;

    SELECT fiat_per_one_tgd INTO v_rate
    FROM currency_rates
    WHERE fiat_currency_code = p_fiat_currency
      AND is_active = TRUE;

    IF v_rate IS NULL THEN
        RAISE EXCEPTION 'no_active_rate_for_currency: %', p_fiat_currency;
    END IF;

    v_tgd := ROUND(p_fiat_amount / v_rate, 4);

    SELECT account_id INTO v_treasury_id
    FROM ledger_accounts
    WHERE owner_type = 'TREASURY' AND currency_code = 'TGD'
    LIMIT 1;

    IF v_treasury_id IS NULL THEN
        RAISE EXCEPTION 'treasury_account_missing';
    END IF;

    INSERT INTO fiat_deposits (
        account_id, fiat_amount, fiat_currency, applied_rate, tgd_credited,
        gateway_reference, gateway_name, status
    ) VALUES (
        p_account_id, p_fiat_amount, p_fiat_currency, v_rate, v_tgd,
        p_gateway_reference, p_gateway_name, 'CONFIRMED'
    )
    ON CONFLICT (gateway_reference) DO NOTHING
    RETURNING deposit_id INTO v_deposit_id;

    IF v_deposit_id IS NULL THEN
        SELECT deposit_id INTO v_deposit_id
        FROM fiat_deposits
        WHERE gateway_reference = p_gateway_reference;
        RETURN v_deposit_id;
    END IF;

    PERFORM fn_atomic_transfer(
        'DEPOSIT_FIAT',
        v_treasury_id,
        p_account_id,
        v_tgd,
        'deposit:' || p_gateway_reference,
        'deposit:' || p_gateway_reference,
        'Minted from fiat deposit'
    );

    RETURN v_deposit_id;
END;
$$;

COMMENT ON FUNCTION fn_mint_tgd IS 'Mint TGD from a confirmed fiat deposit. Idempotent on gateway reference.';
