---
title: TechGeo Speech Analytics
emoji: ""
colorFrom: gray
colorTo: green
sdk: docker
pinned: false
---

# TechGeo Speech Analytics

On-device speech and breathing model export and inference endpoint.

Endpoints:

    POST /analyze   Analyze an audio segment for distress or fatigue
    GET  /health    Liveness probe

Models are exported to TFLite for on-device inference.
