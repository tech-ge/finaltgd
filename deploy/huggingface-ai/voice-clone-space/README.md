---
title: TechGeo Voice Clone
emoji: ""
colorFrom: gray
colorTo: purple
sdk: docker
pinned: false
---

# TechGeo Voice Clone

Voice enrollment and text-to-speech endpoint.

Endpoints:

    POST /enroll    Register a voice fingerprint for an account
    POST /synthesize Generate speech from text using the enrolled voice
    GET  /health    Liveness probe

All voice data is scoped to a single account ID. No cross-account access.
