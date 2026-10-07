---
title: TechGeo Shadow Student
emoji: ""
colorFrom: gray
colorTo: blue
sdk: docker
pinned: false
---

# TechGeo Shadow Student

Local inference endpoint for the TechGeo Shadow Student model.

Endpoints:

    POST /infer    Run inference on a context payload
    GET  /health   Liveness probe
    GET  /version  Model version metadata

Environment variables:

    MODEL_PATH        Path to the LoRA checkpoint directory
    MODEL_BASE        Base model identifier
    HF_TOKEN          Hugging Face access token
    MAX_CONCURRENCY   Maximum simultaneous inference requests
