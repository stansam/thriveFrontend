# PROJECT_INIT.md — Complete Project Initialization Guide

[[SKILLS.md]](./SKILLS.md) | **You are here: Project Init**

> Run this when creating a project from scratch. Execute every step in order.

---

## Phase 1 — Scaffold

```bash
# Create Next.js project
pnpm create next-app@latest my-app \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*"

cd my-app

# Core dependencies
pnpm add \
  zustand \
  @tanstack/react-query \
  @tanstack/react-query-devtools \
  @tanstack/react-virtual \
  @tanstack/react-table \
  axios \
  zod \
  react-hook-form \
  @hookform/resolvers \
  framer-motion \
  sonner \
  class-variance-authority \
  clsx \
  tailwind-merge \
  lucide-react \
  @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu \
  @radix-ui/react-tooltip \
  @radix-ui/react-popover \
  isomorphic-dompurify

# Dev dependencies
pnpm add -D \
  vitest \
  @vitejs/plugin-react \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  msw \
  vite-tsconfig-paths \
  @playwright/test \
  @types/dompurify \
  prettier \
  prettier-plugin-tailwindcss \
  eslint-plugin-import \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  husky \
  lint-staged \
  @next/bundle-analyzer

# Init shadcn
pnpm dlx shadcn@latest init
# Choose: Default style, Neutral base, CSS variables: yes

# Add shadcn components
pnpm dlx shadcn@latest add button input label badge card dropdown-menu dialog tooltip

# Setup Husky
pnpm exec husky init
echo 'pnpm exec lint-staged' > .husky/pre-commit
```

---

## Phase 2 — Configure TypeScript

Replace `tsconfig.json` with the canonical config from TYPESCRIPT.md.

---

## Phase 3 — Configure ESLint & Prettier

Create `.eslintrc.json` and `.prettierrc` from CODE_STANDARDS.md.

Add to `package.json`:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext .ts,.tsx --max-warnings 0",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "analyze": "ANALYZE=true next build"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

---

## Phase 4 — Create Folder Structure

```bash
mkdir -p \
  app/\(auth\)/login \
  app/\(auth\)/register \
  app/\(dashboard\)/dashboard \
  app/\(dashboard\)/settings \
  app/api/auth/login \
  app/api/auth/logout \
  app/api/auth/me \
  app/api/\[...proxy\] \
  components/ui \
  components/common/AppShell \
  components/common/Sidebar \
  components/common/Topbar \
  components/common/MobileBottomNav \
  components/common/PageTransition \
  components/common/ErrorBoundary \
  components/common/ErrorState \
  components/common/EmptyState \
  components/features/auth \
  containers \
  hooks/auth \
  hooks/data \
  hooks/ui \
  services \
  stores \
  types \
  lib \
  config \
  styles \
  tests/mocks \
  tests/fixtures \
  tests/e2e
```

---

## Phase 5 — Core Files

Create these files in order:

### 1. `types/common.types.ts`
```ts
import type React from 'react'
export type WithChildren<T = unknown> = T & { children: React.ReactNode }
export type Nullable<T> = { [K in keyof T]: T[K] | null }
export type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] }
```

### 2. `lib/utils.ts`
```ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }
export function formatDate(date: string | Date, opts?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', ...opts }).format(new Date(date))
}
```

### 3. `lib/service-result.ts`
(from TYPESCRIPT.md — the ServiceResult pattern)

### 4. `lib/errors.ts`
(from ERROR_HANDLING.md)

### 5. `config/routes.ts`
(from NAMING.md)

### 6. `config/query-keys.ts`
(from DATA_FLOW.md — initial skeleton, expand per feature)

### 7. `config/query-client.config.ts`
(from DATA_FLOW.md)

### 8. `types/auth.types.ts`
(from TYPESCRIPT.md)

### 9. `types/api.types.ts`
(from TYPESCRIPT.md)

### 10. `types/env.d.ts`
(from TYPESCRIPT.md)

### 11. `.env.example` + `.env.local`
(from ENV_CONFIG.md)

### 12. `lib/env.server.ts`
(from ENV_CONFIG.md)

### 13. `services/api.client.ts`
(from API_PROXY.md)

### 14. `services/auth.service.ts`
(from API_PROXY.md)

### 15. `stores/auth.store.ts`
(from AUTH.md)

### 16. `stores/ui.store.ts`
(from DATA_FLOW.md)

### 17. `middleware.ts`
(from ARCHITECTURE.md)

### 18. `app/api/auth/login/route.ts`
### 19. `app/api/auth/logout/route.ts`
### 20. `app/api/auth/me/route.ts`
### 21. `app/api/[...proxy]/route.ts`
(all from API_PROXY.md)

### 22. `hooks/auth/useAuth.ts`
(from AUTH.md)

### 23. `components/common/AuthProvider/AuthProvider.tsx`
(from AUTH.md)

### 24. `styles/tokens.css` + `styles/globals.css`
(from UI_UX.md)

### 25. `tailwind.config.ts`
(from UI_UX.md)

### 26. `next.config.ts`
```ts
import bundleAnalyzer from '@next/bundle-analyzer'
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}
export default withBundleAnalyzer(nextConfig)
```
(security headers from SECURITY.md)

### 27. `vitest.config.ts`
(from TESTING.md)

### 28. `tests/setup.ts`
(from TESTING.md)

### 29. `tests/mocks/handlers.ts` + `tests/mocks/server.ts`
(from TESTING.md)

### 30. `tests/TestProviders.tsx`
(from TESTING.md)

---

## Phase 6 — App Shell

Build in order:
1. `components/common/PageTransition/` (from UI_UX.md)
2. `components/common/ThemeToggle/` (from APP_SHELL.md)
3. `components/common/Sidebar/` (from APP_SHELL.md)
4. `components/common/Topbar/` (from APP_SHELL.md)
5. `components/common/MobileBottomNav/` (from APP_SHELL.md)
6. `components/common/AppShell/` (from APP_SHELL.md)
7. `components/common/ErrorBoundary/` (from COMPONENTS.md)
8. `components/common/ErrorState/` (from ERROR_HANDLING.md)
9. `components/common/EmptyState/` (from UI_UX.md)
10. `components/ui/Button/` (from COMPONENTS.md)
11. `components/ui/FormField/` (from FORMS.md)
12. `components/common/PageHeader/` (from APP_SHELL.md)

---

## Phase 7 — Auth Pages

1. `app/(auth)/login/page.tsx`
2. `components/features/auth/LoginForm/`
3. `app/(auth)/register/page.tsx`
4. `components/features/auth/AuthGuard/`
5. `app/(dashboard)/layout.tsx`

---

## Phase 8 — Root Layout & Providers

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { Providers } from '@/components/common/Providers'
import { AuthProvider } from '@/components/common/AuthProvider'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: { default: process.env.NEXT_PUBLIC_APP_NAME!, template: `%s — ${process.env.NEXT_PUBLIC_APP_NAME}` },
  description: 'Your application description',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Providers>
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  )
}
```

---

## Phase 9 — Verification

```bash
# Type check — must pass with 0 errors
pnpm type-check

# Lint — must pass with 0 warnings
pnpm lint

# Tests — must all pass
pnpm test

# Build — must succeed
pnpm build
```

All four must be green before the project is considered initialized.

---

## Phase 10 — Git Setup

```bash
git init
echo ".env.local\n.env.production\n.env.*.local\n.next\nnode_modules\ncoverage\ntest-results\nplaywright-report" >> .gitignore
git add .
git commit -m "feat: initialize project scaffold"
```
