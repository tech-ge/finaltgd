# Deploy

Every subfolder maps to a single host. Push the folder contents to that
host. Do not mix host configs.

    local-dev/            Docker Compose for the development laptop
    render-backend/       Render Blueprint and Dockerfiles
    render-databases/     Neon, MongoDB Atlas, Upstash configs
    zeabur-services/      Zeabur always-on services and Redis add-on
    huggingface-ai/       Hugging Face Spaces for model inference
    vercel-frontend/      Vercel config for web dashboards
    cloudflare-edge/      Cloudflare Worker for rate limiting
    mobile-builds/        Expo EAS build profiles

See docs/guides/deployment.md for the order of operations.
