# Hugging Face AI Spaces

Three Spaces host model inference:

    shadow-student-space/     Internal reasoning model
    voice-clone-space/        Voice enrollment and synthesis
    speech-analytics-space/   Audio classification

## Deploy

    export HF_TOKEN=...
    bash scripts/deploy-huggingface.sh

## Endpoints

Each Space exposes GET /health and its own inference endpoint. The
orchestrator calls these endpoints via HTTPS.
