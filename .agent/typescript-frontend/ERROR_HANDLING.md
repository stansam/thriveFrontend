# ERROR_HANDLING.md — Error Handling Architecture

[[SKILLS.md]](./SKILLS.md) | **You are here: Error Handling**

---

## Error Hierarchy

```
Network Error
    └── AxiosError → caught in service → ServiceResult<never>
            └── hook maps to React Query error state
                    └── Container renders <ErrorState>

Validation Error
    └── Zod.safeParse fails → logged, mapped to ServiceResult<never>

Auth Error (401)
    └── AxiosError 401 → interceptor fires auth:unauthorized event
            └── AuthProvider clears user + redirects to login

Runtime Error
    └── React ErrorBoundary catches → shows fallback UI

Route Error
    └── Next.js error.tsx catches → shows error page
```

---

## Typed Error Classes

```ts
// lib/errors.ts

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode?: number
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class AuthError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 'AUTH_ERROR', 401)
    this.name = 'AuthError'
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public readonly fields?: Record<string, string[]>
  ) {
    super(message, 'VALIDATION_ERROR', 422)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404)
    this.name = 'NotFoundError'
  }
}
```

---

## Toast Notification System

```ts
// hooks/ui/useToast.ts — wraps sonner or radix toast

import { toast as sonnerToast } from 'sonner'

interface ToastOptions {
  title: string
  description?: string
  variant?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  action?: { label: string; onClick: () => void }
}

export function useToast() {
  function toast({ title, description, variant = 'info', duration, action }: ToastOptions) {
    const options = { description, duration, action }
    switch (variant) {
      case 'success': return sonnerToast.success(title, options)
      case 'error':   return sonnerToast.error(title, options)
      case 'warning': return sonnerToast.warning(title, options)
      default:        return sonnerToast(title, options)
    }
  }

  return { toast }
}
```

---

## Next.js Error Pages

```tsx
// app/error.tsx — catches runtime errors in route segments
'use client'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Route Error]', error)
    // logToErrorService(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold text-text-primary">Something went wrong</h2>
      <p className="text-sm text-text-secondary">{error.message}</p>
      <button onClick={reset} className="text-sm text-brand-500 hover:underline">
        Try again
      </button>
    </div>
  )
}

// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-text-primary">404</h1>
      <p className="mt-2 text-text-secondary">This page does not exist.</p>
      <Link href="/dashboard" className="mt-4 text-brand-500 hover:underline">
        Go to dashboard
      </Link>
    </div>
  )
}
```

---

## Error State Component

```tsx
// components/common/ErrorState/ErrorState.tsx

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-xl bg-error-50 p-4 text-error-500">
        <AlertCircleIcon className="h-8 w-8" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-text-primary">{title}</h3>
      {message && <p className="mt-1 text-sm text-text-secondary">{message}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 text-sm text-brand-500 hover:underline"
        >
          Try again
        </button>
      )}
    </div>
  )
}
```
