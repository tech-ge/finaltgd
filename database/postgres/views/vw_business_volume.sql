CREATE OR REPLACE VIEW vw_business_volume AS
SELECT
    la.account_id        AS business_account_id,
    la.owner_ref         AS business_ref,
    COUNT(lt.transfer_id) AS transfer_count,
    COALESCE(SUM(lt.amount), 0) AS total_volume,
    MAX(lt.created_at)   AS last_transfer_at
FROM ledger_accounts la
LEFT JOIN ledger_transfers lt
    ON lt.to_account = la.account_id
    AND lt.operation IN ('SEND_BUSINESS')
WHERE la.owner_type = 'BUSINESS'
GROUP BY la.account_id, la.owner_ref;
