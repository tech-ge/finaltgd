CREATE OR REPLACE VIEW vw_live_attendance AS
SELECT
    e.employee_id,
    e.full_name,
    e.role,
    o.business_name,
    al.clock_in_time,
    al.verification_status,
    al.verified_ip
FROM attendance_logs al
JOIN employees e ON e.employee_id = al.employee_id
JOIN organizations o ON o.org_id = e.org_id
WHERE al.clock_in_time >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
ORDER BY al.clock_in_time DESC;
