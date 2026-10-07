# ADR 0006: 2-Day AI Restriction

## Status

Accepted.

## Context

Users may attempt to abuse the AI assistant. Graduated consequences are
more proportionate than immediate lockout.

## Decision

A rule violation triggers a 2-day restriction on AI usage. Emergency
functions remain available during restriction.

## Consequences

Normal usage resumes after 2 days without manual intervention. Repeat
violations extend the restriction.

## Enforcement

services/ai-orchestrator/src/rules-engine/AiRestrictionScheduler.ts
writes the restriction window to ai_restrictions and consults it on
every non-emergency request.
