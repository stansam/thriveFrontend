# SECURITY.md — Security Architecture

[[SKILLS.md]](./SKILLS.md) | **You are here: Security**

---

## Security Principles

1. **Never trust client input** — validate with Zod at every proxy route
2. **Never expose secrets** — all `FLASK_API_URL`, `SESSION_SECRET` are server-only env vars
3. **httpOnly cookies only** — session tokens are never accessible to JavaScript
4. **SameSite cookies** — prevent CSRF on session cookies
5. **CSP headers** — Content Security Policy on every response
6. **Rate limiting** — auth endpoints are rate-limited at the proxy
7. **Input sanitization** — sanitize before rendering user-generated content

---

## Security Headers

```ts
// next.config.ts

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",  // adjust for prod
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join('; ')
  },
]

const nextConfig = {
  async headers() {
    return [
      { source: '/(.*)', headers: securityHeaders },
    ]
  },
}
```

---

## Cookie Security

```ts
// Cookies set by the proxy MUST have these attributes:

response.cookies.set('session', token, {
  httpOnly: true,                                    // NO JS access
  secure: process.env.NODE_ENV === 'production',    // HTTPS only in prod
  sameSite: 'lax',                                  // CSRF protection
  path: '/',
  maxAge: 60 * 60 * 24 * 7,                        // 7 days
})
```

---

## Rate Limiting at Proxy

```ts
// lib/rate-limit.ts — Simple in-memory rate limiter (use Redis in production)

const rateLimit = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = rateLimit.get(key)

  if (!entry || entry.resetAt < now) {
    rateLimit.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1 }
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  entry.count++
  return { allowed: true, remaining: maxRequests - entry.count }
}

// Usage in auth routes:
const ip = request.ip ?? 'unknown'
const { allowed } = checkRateLimit(`login:${ip}`, 5, 60_000) // 5/minute
if (!allowed) {
  return NextResponse.json({ error: 'Too many attempts' }, { status: 429 })
}
```

---

## Input Sanitization

```ts
// lib/sanitize.ts
// Use DOMPurify for user-generated HTML content

import DOMPurify from 'isomorphic-dompurify'

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [],
  })
}

// Never use dangerouslySetInnerHTML without sanitizing
// ❌ <div dangerouslySetInnerHTML={{ __html: userContent }} />
// ✅ <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(userContent) }} />
```

---

## Env Var Security Rules

```
RULE 1: NEXT_PUBLIC_ prefix = visible in browser bundle. NEVER put secrets here.
RULE 2: All backend URLs, API keys, secrets = server-only (no NEXT_PUBLIC_)
RULE 3: Validate env vars at startup

// lib/env.ts — Validate at startup
import { z } from 'zod'

const ServerEnvSchema = z.object({
  FLASK_API_URL: z.string().url(),
  SESSION_SECRET: z.string().min(32),
  NODE_ENV: z.enum(['development', 'production', 'test']),
})

const ClientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string(),
})

// Only call on server
export function validateServerEnv() {
  const result = ServerEnvSchema.safeParse(process.env)
  if (!result.success) {
    throw new Error(`Invalid server environment: ${result.error.message}`)
  }
  return result.data
}
```

---

## CSRF Protection

Since the proxy uses `SameSite=lax` cookies, CSRF attacks from other origins are blocked for state-changing requests. For extra protection on sensitive endpoints:

```ts
// Generate a CSRF token on session creation, store in non-httpOnly cookie
// Client reads it and sends as X-CSRF-Token header
// Proxy verifies it matches the session's CSRF token

// In proxy route handler:
const csrfToken = request.headers.get('X-CSRF-Token')
const sessionCsrf = extractCsrfFromSession(request.cookies.get('session'))
if (csrfToken !== sessionCsrf) {
  return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
}
```
