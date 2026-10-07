# Hosting on Hugging Face Spaces

## Provision

Create three Spaces: shadow-student, voice-clone, speech-analytics.
Set SDK to Docker. Set HF_TOKEN.

## Deploy

    bash scripts/deploy-huggingface.sh

The script uploads each space in deploy/huggingface-ai.

## Environment

Each Space has its own environment variable set. Common variables:

    MODEL_PATH
    MODEL_BASE
    HF_TOKEN
    MAX_CONCURRENCY

## Cold Starts

Free Spaces sleep after inactivity. The orchestrator tolerates cold
starts by falling back to the next model in the chain.
