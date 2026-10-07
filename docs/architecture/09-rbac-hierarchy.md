# RBAC Hierarchy

## Roles

    CEO
    Admin
    Supervisor
    Worker

## Creation

Only a CEO can create an Admin. Only an Admin can create a Supervisor.
Only a Supervisor can create a Worker. Workers cannot create other users.

## Permissions

CEO

    Create and remove Admins
    View all data within the organization
    Configure organization-wide policies

Admin

    Create and remove Supervisors
    View all data within assigned teams
    Configure team-level policies

Supervisor

    Create and remove Workers
    View live attendance for assigned workers
    Approve attendance corrections

Worker

    View own attendance
    Request corrections
    No visibility into other workers

## Enforcement

Role is encoded in the JWT. The gateway verifies role on every request.
Services re-verify role on any operation that mutates data.
