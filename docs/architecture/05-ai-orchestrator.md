# AI Orchestrator

## Purpose

Route AI requests to the correct model and enforce access policy.

## Context Broker

The broker receives a request from a service and returns a scoped context
object. The scope is defined per request type:

    balance.read        returns current balance only
    activity.read       returns last N activity events
    location.read       returns current coarse position
    microphone.read     returns a transcribed snippet, not raw audio

Every scope request is logged with the caller, the target account, and
the granted fields.

## Agent-to-Agent Protocol

Agents may issue requests to other agents. They never issue commands.

A request envelope contains: from_agent, to_agent, intent, payload, and a
signature. The receiving agent evaluates intent against its policy. If the
intent is not in the allowed set, the receiving agent returns a refusal.

## Rules Engine

Every user has a rule_breach counter. When the counter exceeds the
threshold, the user's AI access is restricted for 2 days. During
restriction, the assistant still handles emergencies but does not perform
routine tasks.

## Routing

The orchestrator selects a model based on intent:

    shadow-student      for internal context reasoning
    voice-clone         for speech synthesis
    speech-analytics    for audio classification

If the primary model is unavailable, the orchestrator falls back to the
next model in the chain.
