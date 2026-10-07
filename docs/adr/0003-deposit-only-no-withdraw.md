# ADR 0003: Deposit Only, No Withdrawal

## Status

Accepted.

## Context

TechGeo operates a closed-loop internal ledger denominated in TGD. Value
enters through fiat deposit and leaves only through merchant settlement
or inter-account transfer within the ecosystem.

## Decision

The system exposes no withdrawal operation. There is no route, no service
method, no SQL function, and no SDK method for withdrawal.

## Consequences

Fiat on-ramp exists via M-Pesa and bank ingestion. Fiat off-ramp is
intentionally absent. Merchants settle through internal TGD transfer.

## Enforcement

services/currency/src/ledger/policy.ts enumerates allowed operations.
Any pull request that introduces a withdrawal path must be rejected.
