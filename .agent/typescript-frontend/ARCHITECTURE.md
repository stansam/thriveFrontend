# ARCHITECTURE.md — Project Structure & Separation of Concerns

[[SKILLS.md]](./SKILLS.md) | **You are here: Architecture**

---

## Canonical Folder Structure

```
/
├── app/                          # Next.js App Router (routing only)
│   ├── (auth)/                   # Route group: unauthenticated pages
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/              # Route group: authenticated pages
│   │   ├── layout.tsx            # Auth guard + shell layout
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── api/                      # Next.js API routes (PROXY ONLY)
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── me/route.ts
│   │   └── [...proxy]/           # Wildcard proxy to Flask
│   │       └── route.ts
│   ├── layout.tsx                # Root layout
│   ├── not-found.tsx
│   └── error.tsx
│
├── components/                   # UI components only
│   ├── ui/                       # shadcn/ui base components (auto-generated, do not edit logic)
│   ├── common/                   # Shared across features
│   │   ├── AppShell/
│   │   ├── Navbar/
│   │   ├── Sidebar/
│   │   └── PageTransition/
│   └── features/                 # Feature-scoped components
│       ├── auth/
│       │   ├── LoginForm/
│       │   └── AuthGuard/
│       └── dashboard/
│           └── StatsCard/
│
├── containers/                   # Data containers (smart components)
│   ├── DashboardContainer.tsx
│   └── SettingsContainer.tsx
│
├── hooks/                        # Custom React hooks
│   ├── auth/
│   │   └── useAuth.ts
│   ├── data/
│   │   └── useDashboardData.ts
│   └── ui/
│       └── useBreakpoint.ts
│
├── services/                     # All API call logic
│   ├── api.client.ts             # Axios instance(s)
│   ├── auth.service.ts
│   └── dashboard.service.ts
│
├── stores/                       # Zustand global stores
│   ├── auth.store.ts
│   └── ui.store.ts
│
├── types/                        # All TypeScript types & Zod schemas
│   ├── auth.types.ts
│   ├── api.types.ts
│   ├── dashboard.types.ts
│   └── common.types.ts
│
├── lib/                          # Pure utility functions
│   ├── utils.ts                  # cn(), formatDate(), etc.
│   ├── constants.ts
│   └── validators.ts             # Shared Zod schemas
│
├── config/                       # App-level configuration
│   ├── routes.ts                 # Typed route constants
│   └── query-client.ts           # React Query client config
│
├── styles/                       # Global styles
│   ├── globals.css               # Tailwind base + CSS variables
│   └── tokens.css                # Design token overrides
│
├── public/                       # Static assets
├── middleware.ts                 # Auth middleware (route protection)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── .env.local                    # Never committed
```

---

## Layer Definitions & Rules

### Layer 1: `app/` — Routing Shell
- **Contains**: Page files (`page.tsx`), layouts (`layout.tsx`), loading/error states
- **Rule**: Pages are THIN. They import ONE container or ONE component. No logic.
- **Rule**: API routes are PROXY ONLY — they forward requests to Flask, handle cookies, nothing else
- **Forbidden**: Business logic, direct fetch calls in pages, inline data fetching in page components

```tsx
// ✅ Correct page.tsx
import { DashboardContainer } from '@/containers/DashboardContainer'

export default function DashboardPage() {
  return <DashboardContainer />
}

// ❌ Wrong — logic in page
export default function DashboardPage() {
  const [data, setData] = useState(null)
  useEffect(() => { fetch('/api/...').then(...) }, [])
  return <div>{data?.title}</div>
}
```

### Layer 2: `containers/` — Data Containers
- **Contains**: Components that own data fetching via hooks, coordinate multiple child components
- **Rule**: Containers use hooks to get data. They pass data as props to presentational components.
- **Rule**: One container per page/major feature section
- **Forbidden**: Inline styles, business logic, direct API calls

```tsx
// ✅ Correct container
export function DashboardContainer() {
  const { data, isLoading, error } = useDashboardData()
  const { user } = useAuth()

  if (isLoading) return <DashboardSkeleton />
  if (error) return <ErrorState error={error} />
  if (!data) return <EmptyState />

  return <DashboardView data={data} user={user} />
}
```

### Layer 3: `components/` — Pure UI
- **Contains**: Presentational components, receive props, emit events via callbacks
- **Rule**: No data fetching. No stores. No side effects beyond user interaction.
- **Rule**: Feature components go in `components/features/<feature>/`, shared go in `components/common/`
- **Forbidden**: `useQuery`, `useMutation`, `fetch`, `axios` imports

### Layer 4: `hooks/` — Data & UI Logic
- **Contains**: Custom hooks that call services, manage local state, derive computed values
- **Rule**: Hooks wrap React Query. They translate service responses to UI-ready shapes.
- **Rule**: Named `use<Domain><Action>` (e.g. `useDashboardData`, `useAuthLogin`)

### Layer 5: `services/` — API Communication
- **Contains**: Functions that call the Next.js proxy. Returns typed promises.
- **Rule**: All backend communication originates here. 
- **Rule**: Every function is typed with Zod-inferred request/response types
- **Forbidden**: UI logic, toast calls, navigation calls

### Layer 6: `stores/` — Global Client State
- **Contains**: Zustand stores for UI state and non-server state (e.g. auth user, theme, sidebar open)
- **Rule**: Server state (remote data) lives in React Query, NOT Zustand
- **Rule**: Zustand is for: auth session, UI preferences, temporary cross-component state

### Layer 7: `types/` — Type Definitions
- **Contains**: Zod schemas + inferred TypeScript types for every domain
- **Rule**: Types are inferred FROM Zod schemas — never write a type that has a corresponding Zod schema separately
- **Rule**: One file per domain (`auth.types.ts`, `dashboard.types.ts`)

---

## Data Flow Diagram

```
Page (thin)
  └── Container (data coordination)
        ├── useXxxData() hook
        │     └── xxxService.getXxx()
        │           └── apiClient.get('/api/xxx')  ← Next.js proxy
        │                 └── Flask backend (httpOnly cookie auth)
        └── <XxxView data={...} />  ← pure presentational
              └── <XxxCard />, <XxxList />, etc.
```

---

## Module Import Aliases

Always use aliases. Configure in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/hooks/*": ["./hooks/*"],
      "@/services/*": ["./services/*"],
      "@/stores/*": ["./stores/*"],
      "@/types/*": ["./types/*"],
      "@/lib/*": ["./lib/*"],
      "@/config/*": ["./config/*"],
      "@/containers/*": ["./containers/*"]
    }
  }
}
```

**Import order** (enforced by ESLint):
1. React / Next.js
2. Third-party libraries
3. `@/types`
4. `@/lib`, `@/config`
5. `@/services`, `@/stores`
6. `@/hooks`
7. `@/containers`
8. `@/components`
9. Relative imports
10. Style imports

---

## File Colocation Rule

When a component, its hook, its types, and its test are tightly coupled to ONE feature:

```
components/features/UserProfile/
  ├── UserProfile.tsx          # Component
  ├── UserProfile.types.ts     # Local types (if not shared)
  ├── UserProfile.test.tsx     # Unit test
  └── index.ts                 # Re-export
```

When types/hooks are shared across features → move to `/types`, `/hooks`.

---

## `middleware.ts` — Route Protection Architecture

```ts
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login', '/register', '/forgot-password']
const AUTH_COOKIE = 'session' // httpOnly cookie set by proxy

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublicPath = PUBLIC_PATHS.some(p => pathname.startsWith(p))
  const hasSession = request.cookies.has(AUTH_COOKIE)

  if (!isPublicPath && !hasSession) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isPublicPath && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
}
```
