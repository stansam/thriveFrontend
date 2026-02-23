# AUTH.md — Authentication Architecture

[[SKILLS.md]](./SKILLS.md) | **You are here: Auth**

---

## Auth Architecture Overview

```
┌─────────────────────────────────────────────────┐
│  Flask Backend                                  │
│  - flask-login manages server-side session      │
│  - Sets httpOnly session cookie on login        │
│  - Exposes /auth/login, /auth/logout, /auth/me  │
└───────────────┬─────────────────────────────────┘
                │ httpOnly cookie (browser can't read JS)
┌───────────────▼─────────────────────────────────┐
│  Next.js API Proxy (/api/auth/*)                │
│  - Forwards auth calls to Flask                 │
│  - Manages cookie forwarding                    │
│  - Validates responses with Zod                 │
└───────────────┬─────────────────────────────────┘
                │
┌───────────────▼─────────────────────────────────┐
│  middleware.ts                                  │
│  - Checks session cookie on EVERY request       │
│  - Redirects to /login if missing               │
│  - Redirects to /dashboard if already logged in │
└───────────────┬─────────────────────────────────┘
                │
┌───────────────▼─────────────────────────────────┐
│  AuthProvider (client context)                  │
│  - Fetches /api/auth/me on mount                │
│  - Stores user in Zustand                       │
│  - Listens for auth:unauthorized event          │
└───────────────┬─────────────────────────────────┘
                │
        useAuth() hook (everywhere in app)
```

---

## Zustand Auth Store

```ts
// stores/auth.store.ts

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { AuthUser } from '@/types/auth.types'

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

interface AuthStore {
  user: AuthUser | null
  status: AuthStatus
  // Actions
  setUser: (user: AuthUser) => void
  clearUser: () => void
  setLoading: () => void
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      user: null,
      status: 'loading',

      setUser: (user) => set({ user, status: 'authenticated' }, false, 'auth/setUser'),
      clearUser: () => set({ user: null, status: 'unauthenticated' }, false, 'auth/clearUser'),
      setLoading: () => set({ status: 'loading' }, false, 'auth/setLoading'),
    }),
    { name: 'AuthStore' }
  )
)
```

---

## Auth Provider

```tsx
// components/common/AuthProvider/AuthProvider.tsx

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth.store'
import { authService } from '@/services/auth.service'
import { ROUTES } from '@/config/routes'
import type { WithChildren } from '@/types/common.types'

export function AuthProvider({ children }: WithChildren) {
  const { setUser, clearUser, setLoading } = useAuthStore()
  const router = useRouter()

  // Bootstrap: check session on mount
  useEffect(() => {
    async function bootstrapAuth() {
      setLoading()
      const result = await authService.getSession()

      if (result.ok) {
        setUser(result.data)
      } else {
        clearUser()
      }
    }

    bootstrapAuth()
  }, [setUser, clearUser, setLoading])

  // Listen for 401 events from axios interceptor
  useEffect(() => {
    function handleUnauthorized() {
      clearUser()
      router.push(ROUTES.login)
    }

    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
  }, [clearUser, router])

  return <>{children}</>
}
```

---

## useAuth Hook

```ts
// hooks/auth/useAuth.ts

import { useAuthStore } from '@/stores/auth.store'
import { authService } from '@/services/auth.service'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/config/routes'
import { useMutation } from '@tanstack/react-query'

export function useAuth() {
  const { user, status, setUser, clearUser } = useAuthStore()
  const router = useRouter()

  const isAuthenticated = status === 'authenticated'
  const isLoading = status === 'loading'

  return {
    user,
    status,
    isAuthenticated,
    isLoading,
  }
}

export function useAuthLogin() {
  const { setUser } = useAuthStore()
  const router = useRouter()

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (result) => {
      if (result.ok) {
        setUser(result.data.user)
        router.push(ROUTES.dashboard)
      }
    },
  })
}

export function useAuthLogout() {
  const { clearUser } = useAuthStore()
  const router = useRouter()

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      clearUser()
      router.push(ROUTES.login)
    },
    onError: () => {
      // Still clear locally even if server fails
      clearUser()
      router.push(ROUTES.login)
    },
  })
}
```

---

## AuthGuard Component

```tsx
// components/features/auth/AuthGuard/AuthGuard.tsx

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/auth/useAuth'
import { ROUTES } from '@/config/routes'
import { FullPageSpinner } from '@/components/common/FullPageSpinner'
import type { WithChildren } from '@/types/common.types'

interface AuthGuardProps extends WithChildren {
  requiredRole?: 'admin' | 'user' | 'viewer'
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { status, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace(ROUTES.login)
    }
    if (
      status === 'authenticated' &&
      requiredRole &&
      user?.role !== requiredRole &&
      user?.role !== 'admin'
    ) {
      router.replace(ROUTES.dashboard) // redirect to allowed page
    }
  }, [status, user, requiredRole, router])

  if (status === 'loading') return <FullPageSpinner />
  if (status === 'unauthenticated') return null

  return <>{children}</>
}
```

---

## Dashboard Layout with Auth Guard

```tsx
// app/(dashboard)/layout.tsx

import { AuthGuard } from '@/components/features/auth/AuthGuard'
import { AppShell } from '@/components/common/AppShell'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  )
}
```

---

## useRequireAuth — Imperative Guard

```ts
// hooks/auth/useRequireAuth.ts
// Use in containers that should only render for authenticated users

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './useAuth'
import { ROUTES } from '@/config/routes'

export function useRequireAuth() {
  const { status, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace(ROUTES.login)
    }
  }, [status, router])

  return { user, isLoading: status === 'loading' }
}
```

---

## Permission / Role Utilities

```ts
// lib/permissions.ts

import type { AuthUser } from '@/types/auth.types'

type Permission = string

export function hasRole(user: AuthUser | null, role: AuthUser['role']): boolean {
  if (!user) return false
  if (user.role === 'admin') return true
  return user.role === role
}

export function hasPermission(user: AuthUser | null, permission: Permission): boolean {
  if (!user) return false
  if (user.role === 'admin') return true
  return user.permissions.includes(permission)
}

export function hasAnyPermission(user: AuthUser | null, permissions: Permission[]): boolean {
  return permissions.some(p => hasPermission(user, p))
}
```

```tsx
// Usage in component
import { hasPermission } from '@/lib/permissions'
import { useAuth } from '@/hooks/auth/useAuth'

function AdminPanel() {
  const { user } = useAuth()

  if (!hasPermission(user, 'admin:panel:view')) return null

  return <div>Admin content</div>
}
```

---

## Session Refresh Strategy

```ts
// hooks/auth/useSessionRefresh.ts
// Periodically verify session is still valid

import { useEffect } from 'react'
import { useAuth } from './useAuth'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'

const REFRESH_INTERVAL = 5 * 60 * 1000 // 5 minutes

export function useSessionRefresh() {
  const { isAuthenticated } = useAuth()
  const { clearUser } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) return

    const interval = setInterval(async () => {
      const result = await authService.getSession()
      if (!result.ok && result.code === '401') {
        clearUser()
      }
    }, REFRESH_INTERVAL)

    return () => clearInterval(interval)
  }, [isAuthenticated, clearUser])
}
```
