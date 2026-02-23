# API_PROXY.md — Next.js API Proxy to Flask Backend

[[SKILLS.md]](./SKILLS.md) | **You are here: API Proxy**

---

## Proxy Architecture Overview

```
Browser (client)
    │
    │  fetch('/api/auth/login', { credentials: 'include' })
    ▼
Next.js API Routes (/app/api/*)
    │  ← Sets/reads httpOnly cookies
    │  ← Validates request shape with Zod
    │  ← Forwards to Flask with server-side credentials
    ▼
Flask Backend (internal network only)
    │  ← flask-login session management
    ▼
Response → Next.js → strips sensitive fields → Browser
```

**Why this pattern?**
- Flask backend is NEVER directly accessible from the browser
- Session cookies are httpOnly — JavaScript cannot read them
- The proxy can transform, validate, and sanitize both requests and responses
- CORS is handled internally — no cross-origin issues
- Rate limiting, logging, and auth injection happen in one place

---

## Axios Client Instance

```ts
// services/api.client.ts

import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

// Client-side instance (calls Next.js proxy)
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? '',
  withCredentials: true,          // Send cookies
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',  // Helps identify AJAX requests
  },
  timeout: 15_000,
})

// Request interceptor: attach CSRF token if present
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof document !== 'undefined') {
    const csrfToken = getCsrfToken()  // read from meta tag or cookie
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken
    }
  }
  return config
})

// Response interceptor: handle 401 globally
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear auth store and redirect to login
      // Import dynamically to avoid circular deps
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:unauthorized'))
      }
    }
    return Promise.reject(error)
  }
)

// Server-side instance (proxy → Flask) — used ONLY in API routes
export function createServerApiClient(cookieHeader?: string) {
  return axios.create({
    baseURL: process.env.FLASK_API_URL,  // internal URL, never exposed
    headers: {
      'Content-Type': 'application/json',
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    timeout: 30_000,
  })
}
```

---

## Generic Proxy Route Handler

```ts
// app/api/[...proxy]/route.ts
// Catches all /api/* routes not explicitly defined and forwards to Flask

import { NextRequest, NextResponse } from 'next/server'
import { createServerApiClient } from '@/services/api.client'
import { AxiosError } from 'axios'

const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const
type AllowedMethod = typeof ALLOWED_METHODS[number]

async function handler(request: NextRequest, { params }: { params: { proxy: string[] } }) {
  const method = request.method as AllowedMethod

  if (!ALLOWED_METHODS.includes(method)) {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const path = '/' + params.proxy.join('/')
  const searchParams = request.nextUrl.searchParams.toString()
  const url = searchParams ? `${path}?${searchParams}` : path

  const cookieHeader = request.headers.get('cookie') ?? undefined
  const flaskClient = createServerApiClient(cookieHeader)

  try {
    let requestBody: unknown = undefined
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      requestBody = await request.json().catch(() => undefined)
    }

    const flaskResponse = await flaskClient.request({
      method,
      url,
      data: requestBody,
    })

    const response = NextResponse.json(flaskResponse.data, {
      status: flaskResponse.status,
    })

    // Forward Set-Cookie headers from Flask to browser
    const setCookieHeader = flaskResponse.headers['set-cookie']
    if (setCookieHeader) {
      const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader]
      cookies.forEach(cookie => {
        response.headers.append('Set-Cookie', cookie)
      })
    }

    return response
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      return NextResponse.json(err.response.data, { status: err.response.status })
    }

    console.error(`[Proxy] ${method} ${path} failed:`, err)
    return NextResponse.json(
      { success: false, error: 'Internal proxy error' },
      { status: 502 }
    )
  }
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const PATCH = handler
export const DELETE = handler
```

---

## Explicit Auth Routes

For auth, use explicit (not wildcard) routes for clarity and security:

```ts
// app/api/auth/login/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createServerApiClient } from '@/services/api.client'
import { LoginRequestSchema } from '@/types/auth.types'
import { AxiosError } from 'axios'

export async function POST(request: NextRequest) {
  // 1. Parse and validate request body
  const body = await request.json().catch(() => null)

  if (!body) {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    )
  }

  const parsed = LoginRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation failed',
        details: parsed.error.format(),
      },
      { status: 422 }
    )
  }

  // 2. Forward to Flask
  const flaskClient = createServerApiClient()

  try {
    const flaskResponse = await flaskClient.post('/auth/login', parsed.data)

    const response = NextResponse.json(
      { success: true, data: flaskResponse.data },
      { status: 200 }
    )

    // 3. Set httpOnly cookie from Flask session
    const setCookie = flaskResponse.headers['set-cookie']
    if (setCookie) {
      const cookies = Array.isArray(setCookie) ? setCookie : [setCookie]
      cookies.forEach(c => response.headers.append('Set-Cookie', c))
    }

    return response
  } catch (err) {
    if (err instanceof AxiosError && err.response?.status === 401) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Login failed. Please try again.' },
      { status: 500 }
    )
  }
}
```

```ts
// app/api/auth/logout/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createServerApiClient } from '@/services/api.client'

export async function POST(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie') ?? undefined
  const flaskClient = createServerApiClient(cookieHeader)

  try {
    await flaskClient.post('/auth/logout')
  } catch {
    // Proceed with local logout even if Flask fails
  }

  const response = NextResponse.json({ success: true }, { status: 200 })

  // Clear the session cookie
  response.cookies.set('session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
    path: '/',
  })

  return response
}
```

```ts
// app/api/auth/me/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createServerApiClient } from '@/services/api.client'
import { AuthUserSchema } from '@/types/auth.types'
import { AxiosError } from 'axios'

export async function GET(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie') ?? undefined
  const flaskClient = createServerApiClient(cookieHeader)

  try {
    const response = await flaskClient.get('/auth/me')
    const parsed = AuthUserSchema.safeParse(response.data)

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 })
    }

    return NextResponse.json({ success: true, data: parsed.data }, { status: 200 })
  } catch (err) {
    if (err instanceof AxiosError && err.response?.status === 401) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ success: false, error: 'Session check failed' }, { status: 500 })
  }
}
```

---

## Request Headers Strategy

```ts
// Security headers added by proxy to every Flask request

const FORWARDED_HEADERS = [
  'accept-language',
  'user-agent',
] as const

function buildFlaskHeaders(request: NextRequest, extra?: Record<string, string>) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Forwarded-For': request.ip ?? 'unknown',
    'X-Real-IP': request.ip ?? 'unknown',
    ...extra,
  }

  FORWARDED_HEADERS.forEach(h => {
    const value = request.headers.get(h)
    if (value) headers[h] = value
  })

  return headers
}
```

---

## Service Layer (calls the proxy)

```ts
// services/auth.service.ts

import { apiClient } from './api.client'
import { LoginRequestSchema, LoginResponseSchema, AuthUserSchema } from '@/types/auth.types'
import type { LoginRequest, LoginResponse, AuthUser } from '@/types/auth.types'
import type { ServiceResult } from '@/lib/service-result'
import { ok, fail } from '@/lib/service-result'
import { API_ROUTES } from '@/config/routes'
import { AxiosError } from 'axios'

export const authService = {
  async login(input: LoginRequest): Promise<ServiceResult<LoginResponse>> {
    try {
      const response = await apiClient.post(API_ROUTES.auth.login, input)
      const parsed = LoginResponseSchema.safeParse(response.data?.data)

      if (!parsed.success) return fail('Invalid response from server')
      return ok(parsed.data)
    } catch (err) {
      if (err instanceof AxiosError) {
        return fail(err.response?.data?.error ?? 'Login failed', String(err.response?.status))
      }
      return fail('Network error')
    }
  },

  async logout(): Promise<ServiceResult<void>> {
    try {
      await apiClient.post(API_ROUTES.auth.logout)
      return ok(undefined)
    } catch {
      return fail('Logout failed')
    }
  },

  async getSession(): Promise<ServiceResult<AuthUser>> {
    try {
      const response = await apiClient.get(API_ROUTES.auth.me)
      const parsed = AuthUserSchema.safeParse(response.data?.data)

      if (!parsed.success) return fail('Invalid session data')
      return ok(parsed.data)
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 401) {
        return fail('Unauthenticated', '401')
      }
      return fail('Session check failed')
    }
  },
}
```
