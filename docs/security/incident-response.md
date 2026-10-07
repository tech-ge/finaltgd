# Incident Response

## Severity Levels

    S1  Money loss, data breach, or service-wide outage
    S2  Degraded service or single-tenant data exposure
    S3  Minor bug or isolated anomaly

## First Response

    Identify. Confirm the incident.
    Contain. Stop the bleeding.
    Preserve. Snapshot logs and state.
    Notify. Alert the on-call lead.

## For Ledger Incidents

    Freeze the currency service via feature flag.
    Snapshot Postgres and the ledger Redis.
    Reconcile ledger entries against deposits.
    Publish a corrected ledger via an audit replay.

## For Identity Incidents

    Rotate KMS keys for the affected scope.
    Force re-authentication for affected accounts.
    Review traceback access logs for unauthorized reads.

## For AI Incidents

    Disable the affected Space.
    Review ai_events for the scope and pattern.
    Apply a global AI restriction if the pattern is systemic.

## Post Incident

    Write a blameless postmortem within 5 business days.
    File follow-up ADRs for structural fixes.
