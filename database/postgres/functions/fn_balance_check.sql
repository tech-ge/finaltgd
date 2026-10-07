CREATE OR REPLACE FUNCTION fn_balance_check(p_account_id INT)
RETURNS DECIMAL
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_in    DECIMAL(18,4);
    v_out   DECIMAL(18,4);
BEGIN
    SELECT COALESCE(SUM(amount), 0) INTO v_in
    FROM ledger_transfers
    WHERE to_account = p_account_id;

    SELECT COALESCE(SUM(amount), 0) INTO v_out
    FROM ledger_transfers
    WHERE from_account = p_account_id;

    RETURN v_in - v_out;
END;
$$;

COMMENT ON FUNCTION fn_balance_check IS 'Derive account balance from ledger entries. Never stored as a mutable column.';
