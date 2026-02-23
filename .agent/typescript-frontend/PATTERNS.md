# PATTERNS.md — Advanced Patterns, Anti-Patterns & Common Recipes

[[SKILLS.md]](./SKILLS.md) | **You are here: Patterns**

---

## Patterns Catalog

### 1. The `extractErrorMessage` Utility

Used in every service to normalize error messages:

```ts
// lib/utils.ts

import { AxiosError } from 'axios'

export function extractErrorMessage(err: unknown, fallback = 'An unexpected error occurred'): string {
  if (err instanceof AxiosError) {
    return err.response?.data?.error
      ?? err.response?.data?.message
      ?? err.message
      ?? fallback
  }
  if (err instanceof Error) return err.message
  return fallback
}
```

---

### 2. Conditional Rendering Without Nesting Hell

```tsx
// ✅ Early returns for states (clean, readable)
export function UserDetailContainer({ userId }: { userId: string }) {
  const { data: user, isLoading, isError, error } = useUserDetail(userId)

  if (isLoading) return <UserDetailSkeleton />
  if (isError)   return <ErrorState message={error?.message} />
  if (!user)     return <NotFoundState resource="User" />

  return <UserDetailView user={user} />
}

// ❌ Nested ternaries (unreadable)
return isLoading ? <Skeleton /> : isError ? <Error /> : !user ? <Empty /> : <View user={user} />
```

---

### 3. Server Component Data Fetching (for non-auth pages)

For public pages, use Next.js Server Components to fetch directly — bypasses client-side loading states:

```tsx
// app/(public)/blog/[slug]/page.tsx
// Server component — no 'use client'

import { notFound } from 'next/navigation'

async function getPost(slug: string) {
  const res = await fetch(`${process.env.FLASK_API_URL}/posts/${slug}`, {
    next: { revalidate: 3600 }, // ISR: revalidate every hour
  })
  if (!res.ok) return null
  return res.json()
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  if (!post) notFound()
  return <PostView post={post} />
}
```

---

### 4. useDebounce — Search Input Pattern

```ts
// hooks/ui/useDebounce.ts
import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

// Usage in search:
const [input, setInput] = useState('')
const search = useDebounce(input, 400)
const { data } = useUserList({ search }) // Only fires after 400ms of no typing
```

---

### 5. Infinite Scroll Pattern

```ts
// hooks/data/useInfiniteUsers.ts
import { useInfiniteQuery } from '@tanstack/react-query'
import { useRef, useEffect, useCallback } from 'react'

export function useInfiniteUsers() {
  const query = useInfiniteQuery({
    queryKey: ['users', 'infinite'],
    queryFn: ({ pageParam }) => userService.getList({ page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, perPage, total } = lastPage.data.pagination
      return page * perPage < total ? page + 1 : undefined
    },
  })

  // Intersection Observer for auto-load
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const handleIntersection = useCallback(([entry]: IntersectionObserverEntry[]) => {
    if (entry?.isIntersecting && query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage()
    }
  }, [query])

  useEffect(() => {
    const el = loadMoreRef.current
    if (!el) return
    const observer = new IntersectionObserver(handleIntersection, { threshold: 0.1 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [handleIntersection])

  const users = query.data?.pages.flatMap(p => p.data.items) ?? []

  return { ...query, users, loadMoreRef }
}
```

---

### 6. URL State Sync Pattern

For filters/search that should survive refresh and be shareable:

```ts
// hooks/ui/useUrlState.ts
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useTransition } from 'react'

export function useUrlState<T extends Record<string, string>>(defaults: T) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const state = Object.fromEntries(
    Object.entries(defaults).map(([key, defaultVal]) => [
      key,
      searchParams.get(key) ?? defaultVal,
    ])
  ) as T

  const setState = useCallback((updates: Partial<T>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, val]) => {
      if (val === defaults[key]) params.delete(key)
      else params.set(key, val as string)
    })
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }, [router, pathname, searchParams, defaults])

  return { state, setState, isPending }
}

// Usage:
const { state, setState } = useUrlState({ page: '1', search: '', status: '' })
```

---

### 7. Render Prop for Shared Logic

```tsx
// When a hook has complex logic that multiple components share:

interface DataFetcherProps<T> {
  queryKey: unknown[]
  queryFn: () => Promise<T>
  children: (props: { data: T; isLoading: boolean; error: Error | null }) => React.ReactNode
}

function DataFetcher<T>({ queryKey, queryFn, children }: DataFetcherProps<T>) {
  const { data, isLoading, error } = useQuery({ queryKey, queryFn })
  return <>{children({ data: data as T, isLoading, error: error as Error | null })}</>
}
```

---

### 8. Typed Event Bus Pattern

For cross-component communication without prop drilling:

```ts
// lib/event-bus.ts
type EventMap = {
  'user:updated': { userId: string }
  'project:deleted': { projectId: string }
  'auth:expired': undefined
}

class EventBus {
  private listeners = new Map<string, Set<Function>>()

  on<K extends keyof EventMap>(event: K, handler: (data: EventMap[K]) => void) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set())
    this.listeners.get(event)!.add(handler)
    return () => this.off(event, handler)
  }

  off<K extends keyof EventMap>(event: K, handler: Function) {
    this.listeners.get(event)?.delete(handler)
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]) {
    this.listeners.get(event)?.forEach(h => h(data))
  }
}

export const eventBus = new EventBus()
```

---

### 9. Portal Pattern for Tooltips & Popovers

Always use Radix UI primitives — they handle portaling, focus trapping, and a11y.

```tsx
import * as Tooltip from '@radix-ui/react-tooltip'

export function TooltipWrapper({ content, children }: { content: string; children: React.ReactNode }) {
  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="z-50 rounded-lg bg-neutral-900 px-2.5 py-1.5 text-xs text-white shadow-lg animate-fade-in"
            sideOffset={4}
          >
            {content}
            <Tooltip.Arrow className="fill-neutral-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
```

---

## Anti-Patterns (Never Do These)

### ❌ God Container
```tsx
// WRONG: one container doing everything
function GodContainer() {
  const users = useUserList()
  const projects = useProjectList()
  const stats = useDashboardStats()
  const notifications = useNotifications()
  // 200 more lines of jsx...
}

// CORRECT: split into focused containers per section
function DashboardPage() {
  return (
    <div>
      <StatsContainer />
      <RecentProjectsContainer />
      <TeamMembersContainer />
    </div>
  )
}
```

### ❌ Prop Drilling Beyond 2 Levels
```tsx
// If you're passing props through 3+ levels, use a hook/store instead
// WRONG:
<A userId={userId}> → <B userId={userId}> → <C userId={userId}> → uses it

// CORRECT: read from hook at point of use
// In component C:
const { user } = useAuth() // or useUserDetail(id)
```

### ❌ useEffect for Derived State
```tsx
// WRONG
const [fullName, setFullName] = useState('')
useEffect(() => { setFullName(`${first} ${last}`) }, [first, last])

// CORRECT
const fullName = `${first} ${last}` // just compute it
```

### ❌ Fetching in useEffect
```tsx
// WRONG
useEffect(() => {
  fetch('/api/users').then(r => r.json()).then(setUsers)
}, [])

// CORRECT
const { data: users } = useQuery({ queryKey: ['users'], queryFn: userService.getList })
```

### ❌ Mutating State Directly
```tsx
// WRONG (Zustand)
set(state => { state.users.push(newUser) }) // direct mutation

// CORRECT
set(state => ({ users: [...state.users, newUser] })) // new array
```

### ❌ Importing from barrel files in the same feature
```ts
// WRONG: circular dependency risk
import { UserCard } from '@/components/features/users' // barrel

// CORRECT: direct import
import { UserCard } from '@/components/features/users/UserCard'
```

---

## Common Recipes

### Format currency
```ts
export function formatCurrency(amount: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
}
```

### Truncate text
```ts
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}
```

### Sleep for testing
```ts
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
```

### Copy to clipboard
```ts
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
```

### Pluralize
```ts
export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return count === 1 ? `${count} ${singular}` : `${count} ${plural}`
}
```
