INSERT INTO rbac_permissions (role_id, resource, action)
SELECT r.role_id, p.resource, p.action
FROM rbac_roles r
CROSS JOIN (VALUES
    ('admin', 'create'),
    ('admin', 'remove'),
    ('supervisor', 'create'),
    ('worker', 'create'),
    ('organization', 'read'),
    ('organization', 'update'),
    ('attendance', 'read'),
    ('attendance', 'approve'),
    ('ledger', 'read'),
    ('ledger', 'send')
) AS p(resource, action)
WHERE r.role_name = 'CEO'
ON CONFLICT (role_id, resource, action) DO NOTHING;

INSERT INTO rbac_permissions (role_id, resource, action)
SELECT r.role_id, p.resource, p.action
FROM rbac_roles r
CROSS JOIN (VALUES
    ('supervisor', 'create'),
    ('worker', 'create'),
    ('organization', 'read'),
    ('attendance', 'read'),
    ('attendance', 'approve'),
    ('ledger', 'read')
) AS p(resource, action)
WHERE r.role_name = 'ADMIN'
ON CONFLICT (role_id, resource, action) DO NOTHING;

INSERT INTO rbac_permissions (role_id, resource, action)
SELECT r.role_id, p.resource, p.action
FROM rbac_roles r
CROSS JOIN (VALUES
    ('worker', 'create'),
    ('attendance', 'read'),
    ('attendance', 'approve')
) AS p(resource, action)
WHERE r.role_name = 'SUPERVISOR'
ON CONFLICT (role_id, resource, action) DO NOTHING;

INSERT INTO rbac_permissions (role_id, resource, action)
SELECT r.role_id, p.resource, p.action
FROM rbac_roles r
CROSS JOIN (VALUES
    ('attendance', 'read')
) AS p(resource, action)
WHERE r.role_name = 'WORKER'
ON CONFLICT (role_id, resource, action) DO NOTHING;
