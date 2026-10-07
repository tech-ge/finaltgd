FROM node:20-alpine AS base
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY services/ai-orchestrator/package.json ./services/ai-orchestrator/
COPY packages/common/package.json ./packages/common/
COPY packages/config/package.json ./packages/config/
COPY packages/db-clients/package.json ./packages/db-clients/
COPY packages/logger/package.json ./packages/logger/
RUN pnpm install --frozen-lockfile --prod=false

FROM deps AS build
COPY tsconfig.base.json ./
COPY packages ./packages
COPY services/ai-orchestrator ./services/ai-orchestrator
RUN pnpm --filter @techgeo/ai-orchestrator build

FROM base AS runtime
ENV NODE_ENV=production
COPY --from=build /app/services/ai-orchestrator/dist ./dist
COPY --from=build /app/services/ai-orchestrator/package.json ./
COPY --from=deps /app/node_modules ./node_modules
RUN addgroup -S app && adduser -S app -G app
USER app
EXPOSE 3001
CMD ["node", "dist/index.js"]
