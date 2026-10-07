CREATE TABLE IF NOT EXISTS attendance_logs (
    log_id              SERIAL PRIMARY KEY,
    employee_id         INT NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
    clock_in_time       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    verified_ip         VARCHAR(45) NOT NULL,
    verified_latitude   DECIMAL(10, 8),
    verified_longitude  DECIMAL(11, 8),
    verification_status VARCHAR(30) NOT NULL
        CHECK (verification_status IN ('AUTOMATIC_GEO_MATCH','FAILED_IP','FAILED_GEO','MANUAL_OVERRIDE')),
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_attendance_employee_time
    ON attendance_logs (employee_id, clock_in_time DESC);

CREATE INDEX IF NOT EXISTS idx_attendance_status
    ON attendance_logs (verification_status);

COMMENT ON TABLE attendance_logs IS 'Dual-layer presence verification records.';
