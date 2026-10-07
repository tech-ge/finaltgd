CREATE OR REPLACE VIEW vw_user_balances AS
SELECT
    la.account_id,
    la.owner_type,
    la.owner_ref,
    la.currency_code,
    fn_balance_check(la.account_id) AS balance
FROM ledger_accounts la
WHERE la.owner_type IN ('USER','BUSINESS');
