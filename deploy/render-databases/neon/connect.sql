-- Neon connection template. Replace placeholders before running.
-- Always use the pooled connection string for application traffic.
--
--   POSTGRES_URL=postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require
--
-- Verify SSL is required at the connection string level. Neon enforces
-- TLS on every connection.

SELECT current_database(), current_user, version();
