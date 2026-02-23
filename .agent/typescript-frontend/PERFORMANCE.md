# PERFORMANCE.md — Performance & Optimization

[[SKILLS.md]](./SKILLS.md) | **You are here: Performance**

---

## Core Web Vitals Targets

| Metric | Target | Description |
|--------|--------|-------------|
| LCP | < 2.5s | Largest Contentful Paint |
| INP | < 200ms | Interaction to Next Paint |
| CLS | < 0.1 | Cumulative Layout Shift |
| FCP | < 1.8s | First Contentful Paint |
| TTFB | < 800ms | Time to First Byte |

---

## Code Splitting

```tsx
// Lazy load heavy feature components
import dynamic from 'next/dynamic'

// Only loads when rendered
const HeavyChart = dynamic(() => import('@/components/features/analytics/HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,  // for browser-only libraries
})

// Lazy load modals (never in initial bundle)
const DeleteConfirmModal = dynamic(
  () => import('@/components/common/DeleteConfirmModal').then(m => m.DeleteConfirmModal)
)
```

---

## Image Optimization

```tsx
// Always use next/image, never <img>
import Image from 'next/image'

// ✅ Correct
<Image
  src={user.avatar}
  alt={`${user.name}'s avatar`}
  width={40}
  height={40}
  className="rounded-full"
  priority={isAboveFold}  // Only for LCP images
/>

// For dynamic sizes:
<div className="relative h-48 w-full">
  <Image src={cover} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
</div>
```

---

## React Performance Patterns

```tsx
// 1. Memoize expensive computations
const sortedUsers = useMemo(
  () => [...users].sort((a, b) => a.name.localeCompare(b.name)),
  [users]
)

// 2. Stable callbacks
const handleDelete = useCallback(
  (id: string) => deleteUser.mutate(id),
  [deleteUser]
)

// 3. Avoid unnecessary re-renders with memo
export const UserCard = React.memo(function UserCard({ user, onEdit }: UserCardProps) {
  // Only re-renders when user or onEdit changes
})

// 4. Defer non-critical updates
const [searchQuery, setSearchQuery] = useState('')
const deferredQuery = useDeferredValue(searchQuery)
// Use deferredQuery for the expensive filtered list

// 5. useTransition for non-urgent state updates
const [isPending, startTransition] = useTransition()
startTransition(() => setFilter(newFilter))
```

---

## Bundle Analysis

```json
// package.json scripts
{
  "analyze": "ANALYZE=true next build",
  "perf": "next build && npx lighthouse http://localhost:3000 --output=json"
}
```

```ts
// next.config.ts
import bundleAnalyzer from '@next/bundle-analyzer'
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })
export default withBundleAnalyzer(nextConfig)
```

---

## React Query Caching Strategy

```ts
// Per-query stale time based on data volatility

// Static/rarely changes: long stale time
useQuery({ queryKey: [...], staleTime: 1000 * 60 * 60 }) // 1 hour

// Regular data: default 5 minutes
useQuery({ queryKey: [...], staleTime: 1000 * 60 * 5 })

// Real-time/live data: 0 stale time + polling
useQuery({ queryKey: [...], staleTime: 0, refetchInterval: 5000 })

// Prefetch on hover for instant navigation
queryClient.prefetchQuery({
  queryKey: queryKeys.users.detail(userId),
  queryFn: () => userService.getById(userId),
  staleTime: 10 * 1000,
})
```
