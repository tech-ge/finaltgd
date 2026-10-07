# ADR 0005: Voice Vault Per Account

## Status

Accepted.

## Context

The assistant clones the user's voice. Voice data is biometric and
irreversible if leaked.

## Decision

Voice fingerprints are stored in a per-account vault, encrypted with a
per-account key. No cross-account access is possible.

## Consequences

Compromise of one account does not expose others. Recovery requires
re-enrollment with biometric verification.

## Enforcement

services/assistant/src/voice-clone/VoiceVault.ts enforces the account
scope on every read and write.
