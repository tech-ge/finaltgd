-- Development seed. Never run in production.
-- Creates a demo organization with a fixed gateway IP.

INSERT INTO organizations
    (manager_name, business_name, office_latitude, office_longitude, office_static_ip)
VALUES
    ('Demo Manager', 'TechGeo Demo Org', -1.29210000, 36.82190000, '203.0.113.10')
ON CONFLICT (business_name) DO NOTHING;

INSERT INTO employees (org_id, full_name, device_uuid, role)
SELECT o.org_id, 'Demo CEO', 'demo-ceo-device', 'CEO'
FROM organizations o
WHERE o.business_name = 'TechGeo Demo Org'
ON CONFLICT (device_uuid) DO NOTHING;

INSERT INTO employees (org_id, full_name, device_uuid, role)
SELECT o.org_id, 'Demo Admin', 'demo-admin-device', 'ADMIN'
FROM organizations o
WHERE o.business_name = 'TechGeo Demo Org'
ON CONFLICT (device_uuid) DO NOTHING;

INSERT INTO employees (org_id, full_name, device_uuid, role)
SELECT o.org_id, 'Demo Supervisor', 'demo-supervisor-device', 'SUPERVISOR'
FROM organizations o
WHERE o.business_name = 'TechGeo Demo Org'
ON CONFLICT (device_uuid) DO NOTHING;

INSERT INTO employees (org_id, full_name, device_uuid, role)
SELECT o.org_id, 'Demo Worker', 'demo-worker-device', 'WORKER'
FROM organizations o
WHERE o.business_name = 'TechGeo Demo Org'
ON CONFLICT (device_uuid) DO NOTHING;
