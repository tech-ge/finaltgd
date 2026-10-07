# Hosting Map

| Source                              | Host           | Workload          |
|-------------------------------------|----------------|-------------------|
| apps/user-app                       | Expo EAS       | Mobile build      |
| apps/assistant-app                  | Expo EAS       | Mobile build      |
| apps/business-portal                | Vercel         | Web dashboard     |
| apps/admin-console                  | Vercel         | Web dashboard     |
| apps/laptop-mirror                  | Vercel         | Web viewer        |
| services/gateway                    | Render         | REST entry        |
| services/currency                   | Render         | Ledger            |
| services/identity                   | Render         | Identity          |
| services/maps                       | Render         | Routing           |
| services/attendance                 | Render         | Presence          |
| services/health                     | Render         | Vitals            |
| services/business                   | Render         | SaaS              |
| services/admin                      | Render         | RBAC              |
| services/ai-orchestrator            | Zeabur         | Always-on AI      |
| services/assistant                  | Zeabur         | Always-on voice   |
| services/gateway/websocket          | Zeabur         | Always-on streams |
| ai/shadow-student                   | Hugging Face   | Model inference   |
| ai/voice                            | Hugging Face   | Voice clone       |
| ai/speech                           | Hugging Face   | Audio analytics   |
| database/postgres                   | Neon           | Managed Postgres  |
| database/mongo                      | MongoDB Atlas  | Managed Mongo     |
| database/redis (ledger)             | Upstash        | Locks, noeviction |
| database/redis (cache)              | Zeabur         | Cache, LRU        |
| deploy/cloudflare-edge              | Cloudflare     | Edge rate limit   |
