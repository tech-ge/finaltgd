# ADR 0004: AI Request-Only Protocol

## Status

Accepted.

## Context

Multiple AI agents operate on behalf of users and services. Without a
strict protocol, one agent could command another, creating unintended
cascades of action.

## Decision

Agents issue requests only. They never issue commands to other agents.
The receiving agent decides whether to fulfill or refuse.

## Consequences

Actions always pass through the receiving agent's policy. Cascades are
bounded. Audit trails reflect intent rather than instruction.

## Enforcement

services/ai-orchestrator/src/agent-to-agent/RefusalEngine.ts rejects any
message whose type is not in the request enum.
