# ENV_CONFIG.md — Environment & Configuration

[[SKILLS.md]](./SKILLS.md) | **You are here: Env Config**

---

## Environment Files

```
.env.local          ← local dev secrets (never commit)
.env.development    ← dev defaults (can commit, no secrets)
.env.production     ← production defaults (no secrets, CI injects)
.env.test           ← test environment
.env.example        ← template for onboarding (always commit)
```

## .env.example Template

```bash
# .env.example — copy to .env.local and fill in

# ── Server-side only (NEVER prefix with NEXT_PUBLIC_) ──────────
FLASK_API_URL=http://localhost:5000
SESSION_SECRET=change-me-to-a-32-char-random-string
NODE_ENV=development

# ── Public (safe to expose to browser) ────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=MyApp
```

## Runtime Env Validation

```ts
// lib/env.server.ts — validate on server startup
import { z } from 'zod'

const ServerEnvSchema = z.object({
  FLASK_API_URL: z.string().url('FLASK_API_URL must be a valid URL'),
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 chars'),
  NODE_ENV: z.enum(['development', 'production', 'test']),
})

export const serverEnv = (() => {
  const result = ServerEnvSchema.safeParse(process.env)
  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format())
    process.exit(1)
  }
  return result.data
})()
```
