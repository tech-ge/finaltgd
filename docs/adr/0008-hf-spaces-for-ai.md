# ADR 0008: Hugging Face Spaces for AI

## Status

Accepted.

## Context

Model inference requires GPU access and specialized runtimes. Running
this on the same hosts as the API would complicate deployment and
inflate cost.

## Decision

Host model inference on Hugging Face Spaces. The API calls the Space
via HTTPS.

## Consequences

Model lifecycle is decoupled from API lifecycle. Spaces scale
independently. The API tolerates Space cold starts via a fallback path.

## Enforcement

services/ai-orchestrator/src/routing/HfSpaceClient.ts is the only
component that talks to Spaces. Other services call the orchestrator.
