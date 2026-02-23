# TESTING.md — Testing Standards

[[SKILLS.md]](./SKILLS.md) | **You are here: Testing**

---

## Testing Philosophy

- **Test behavior, not implementation** — tests verify what a user sees/experiences, not how code is written internally
- **Test the contract** — services and hooks are tested against their input/output contracts
- **Integration > Unit** — prefer tests that exercise multiple layers together
- **E2E for critical paths** — auth flow, form submission, key user journeys

## Stack

```
Unit/Integration:   Vitest + React Testing Library
E2E:                Playwright
Mocking:            MSW (Mock Service Worker) for API mocking
Coverage:           Vitest v8 coverage
```

---

## Vitest Config

```ts
// vitest.config.ts

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
      exclude: [
        'app/api/**',           // proxy routes tested via E2E
        'components/ui/**',     // shadcn primitives
        '**/*.types.ts',
        '**/*.config.ts',
      ],
    },
  },
})
```

```ts
// tests/setup.ts

import '@testing-library/jest-dom'
import { server } from './mocks/server'

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

---

## MSW API Mocking

```ts
// tests/mocks/handlers.ts

import { http, HttpResponse } from 'msw'
import { mockUser, mockAuthResponse } from '../fixtures/auth.fixtures'

export const handlers = [
  // Auth
  http.post('/api/auth/login', () => {
    return HttpResponse.json({ success: true, data: mockAuthResponse })
  }),

  http.get('/api/auth/me', () => {
    return HttpResponse.json({ success: true, data: mockUser })
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ success: true })
  }),

  // Users
  http.get('/api/users', ({ request }) => {
    const url = new URL(request.url)
    const page = url.searchParams.get('page') ?? '1'
    return HttpResponse.json({
      success: true,
      data: { items: [mockUser], pagination: { page: +page, perPage: 20, total: 1 } },
    })
  }),
]

// tests/mocks/server.ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

---

## Component Tests

```tsx
// components/features/auth/LoginForm/LoginForm.test.tsx

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from './LoginForm'
import { TestProviders } from '@/tests/TestProviders'
import { server } from '@/tests/mocks/server'
import { http, HttpResponse } from 'msw'

function renderLoginForm() {
  return render(<LoginForm />, { wrapper: TestProviders })
}

describe('LoginForm', () => {
  it('renders email and password fields', () => {
    renderLoginForm()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('shows validation errors for invalid email', async () => {
    renderLoginForm()
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/email/i), 'notanemail')
    await user.tab()

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/invalid email/i)
    })
  })

  it('disables submit button while submitting', async () => {
    renderLoginForm()
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(screen.getByRole('button', { name: /sign in/i })).toBeDisabled()
  })

  it('shows server error message on failed login', async () => {
    server.use(
      http.post('/api/auth/login', () =>
        HttpResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
      )
    )

    renderLoginForm()
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/invalid credentials/i)
    })
  })
})
```

---

## Hook Tests

```ts
// hooks/data/useDashboardStats.test.ts

import { renderHook, waitFor } from '@testing-library/react'
import { useDashboardStats } from './useDashboardStats'
import { TestProviders } from '@/tests/TestProviders'
import { server } from '@/tests/mocks/server'
import { http, HttpResponse } from 'msw'
import { mockDashboardStats } from '@/tests/fixtures/dashboard.fixtures'

describe('useDashboardStats', () => {
  it('returns stats data on success', async () => {
    const { result } = renderHook(() => useDashboardStats(), {
      wrapper: TestProviders,
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockDashboardStats)
  })

  it('returns error state on API failure', async () => {
    server.use(
      http.get('/api/dashboard/stats', () =>
        HttpResponse.json({ success: false, error: 'Server error' }, { status: 500 })
      )
    )

    const { result } = renderHook(() => useDashboardStats(), {
      wrapper: TestProviders,
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
  })
})
```

---

## Service Tests

```ts
// services/auth.service.test.ts

import { authService } from './auth.service'
import { server } from '@/tests/mocks/server'
import { http, HttpResponse } from 'msw'

describe('authService.login', () => {
  it('returns ok result with user on success', async () => {
    const result = await authService.login({
      email: 'test@example.com',
      password: 'password123',
    })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.user.email).toBe('test@example.com')
    }
  })

  it('returns fail result on 401', async () => {
    server.use(
      http.post('/api/auth/login', () =>
        HttpResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
      )
    )

    const result = await authService.login({
      email: 'test@example.com',
      password: 'wrong',
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.code).toBe('401')
    }
  })
})
```

---

## E2E Tests (Playwright)

```ts
// tests/e2e/auth.spec.ts

import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('user can log in with valid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText('Welcome back')).toBeVisible()
  })

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Password').fill('wrongpassword')
    await page.getByRole('button', { name: 'Sign in' }).click()

    await expect(page.getByRole('alert')).toContainText(/invalid/i)
    await expect(page).toHaveURL('/login')
  })

  test('unauthenticated user is redirected to login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/login')
  })

  test('authenticated user is redirected from login to dashboard', async ({ page, context }) => {
    // Set auth cookie
    await context.addCookies([{ name: 'session', value: 'valid-session', url: 'http://localhost:3000' }])
    await page.goto('/login')
    await expect(page).toHaveURL('/dashboard')
  })
})
```

---

## Test Fixtures

```ts
// tests/fixtures/auth.fixtures.ts

import type { AuthUser, LoginResponse } from '@/types/auth.types'

export const mockUser: AuthUser = {
  id: 'usr_123e4567-e89b-12d3-a456-426614174000',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  permissions: ['profile:read', 'profile:write'],
}

export const mockAuthResponse: LoginResponse = {
  user: mockUser,
  message: 'Login successful',
}
```

---

## TestProviders Wrapper

```tsx
// tests/TestProviders.tsx

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { WithChildren } from '@/types/common.types'

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  })
}

export function TestProviders({ children }: WithChildren) {
  const queryClient = createTestQueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```
