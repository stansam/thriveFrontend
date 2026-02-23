# DATA_FLOW.md — Data Flow, React Query, Hooks & State

[[SKILLS.md]](./SKILLS.md) | **You are here: Data Flow**

---

## The Data Flow Hierarchy

```
Component (UI only)
    ↑ props
Container (coordinates data)
    ↑ uses
Custom Hook (useXxxData)
    ↑ uses
React Query (useQuery / useMutation)
    ↑ calls
Service (xxxService.getXxx)
    ↑ calls
apiClient (axios)
    ↑ calls
Next.js API Route (proxy)
    ↑ calls
Flask Backend
```

**The rule**: Data flows up through props. Actions flow down through callbacks. API calls only happen through services. Never skip a layer.

---

## React Query Configuration

```ts
// config/query-client.config.ts

import { QueryClient } from '@tanstack/react-query'

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,         // 5 minutes
        gcTime: 1000 * 60 * 30,            // 30 minutes
        retry: (failureCount, error) => {
          // Don't retry on 4xx errors
          if (error instanceof Error && 'status' in error) {
            const status = (error as { status: number }).status
            if (status >= 400 && status < 500) return false
          }
          return failureCount < 2
        },
        refetchOnWindowFocus: false,       // Prevent jarring refetches
        refetchOnMount: true,
      },
      mutations: {
        retry: false,
      },
    },
  })
}
```

```tsx
// app/layout.tsx
'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { createQueryClient } from '@/config/query-client.config'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
```

---

## Query Key Factory Pattern

Centralized, typed query key management:

```ts
// config/query-keys.ts

export const queryKeys = {
  // Auth
  auth: {
    session: () => ['auth', 'session'] as const,
  },

  // Users
  users: {
    all: () => ['users'] as const,
    list: (params: UserListParams) => ['users', 'list', params] as const,
    detail: (id: string) => ['users', 'detail', id] as const,
  },

  // Dashboard
  dashboard: {
    stats: () => ['dashboard', 'stats'] as const,
    recentActivity: (userId: string) => ['dashboard', 'activity', userId] as const,
  },

  // Projects
  projects: {
    all: () => ['projects'] as const,
    list: (filters: ProjectFilters) => ['projects', 'list', filters] as const,
    detail: (id: string) => ['projects', 'detail', id] as const,
    members: (projectId: string) => ['projects', 'members', projectId] as const,
  },
} as const
```

---

## Data Hook Patterns

### Fetch Hook (useQuery)

```ts
// hooks/data/useDashboardStats.ts

import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services/dashboard.service'
import { queryKeys } from '@/config/query-keys'

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: async () => {
      const result = await dashboardService.getStats()
      if (!result.ok) throw new Error(result.error)
      return result.data
    },
    staleTime: 1000 * 60 * 2, // 2 minutes for stats
  })
}

// Usage in container:
// const { data, isLoading, error } = useDashboardStats()
```

### List Hook with Pagination

```ts
// hooks/data/useUserList.ts

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { userService } from '@/services/user.service'
import { queryKeys } from '@/config/query-keys'
import type { UserListParams } from '@/types/user.types'

export function useUserList(initialParams?: Partial<UserListParams>) {
  const [params, setParams] = useState<UserListParams>({
    page: 1,
    perPage: 20,
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...initialParams,
  })

  const query = useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: async () => {
      const result = await userService.getList(params)
      if (!result.ok) throw new Error(result.error)
      return result.data
    },
    placeholderData: (prev) => prev, // Keep previous data while fetching
  })

  return {
    ...query,
    params,
    setPage: (page: number) => setParams(p => ({ ...p, page })),
    setSearch: (search: string) => setParams(p => ({ ...p, page: 1, search })),
    setSort: (sortBy: string, sortOrder: 'asc' | 'desc') =>
      setParams(p => ({ ...p, sortBy, sortOrder })),
  }
}
```

### Mutation Hook

```ts
// hooks/data/useCreateUser.ts

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/user.service'
import { queryKeys } from '@/config/query-keys'
import { useToast } from '@/hooks/ui/useToast'
import type { CreateUserInput } from '@/types/user.types'

export function useCreateUser() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (input: CreateUserInput) => {
      const result = await userService.create(input)
      if (!result.ok) throw new Error(result.error)
      return result.data
    },
    onSuccess: (newUser) => {
      // Invalidate and refetch list
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() })

      // Optimistically add to cache
      queryClient.setQueryData(queryKeys.users.detail(newUser.id), newUser)

      toast({ title: 'User created successfully', variant: 'success' })
    },
    onError: (error) => {
      toast({ title: 'Failed to create user', description: error.message, variant: 'error' })
    },
  })
}
```

### Optimistic Update Pattern

```ts
// hooks/data/useUpdateUser.ts

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/user.service'
import { queryKeys } from '@/config/query-keys'
import type { User, UpdateUserInput } from '@/types/user.types'

export function useUpdateUser(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UpdateUserInput) => {
      const result = await userService.update(userId, input)
      if (!result.ok) throw new Error(result.error)
      return result.data
    },
    onMutate: async (input) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({ queryKey: queryKeys.users.detail(userId) })

      // Snapshot previous value
      const previousUser = queryClient.getQueryData<User>(queryKeys.users.detail(userId))

      // Optimistically update
      queryClient.setQueryData<User>(queryKeys.users.detail(userId), (old) =>
        old ? { ...old, ...input } : old
      )

      return { previousUser }
    },
    onError: (_, __, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(queryKeys.users.detail(userId), context.previousUser)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(userId) })
    },
  })
}
```

---

## Container Pattern

```tsx
// containers/UserListContainer.tsx

'use client'

import { useUserList } from '@/hooks/data/useUserList'
import { useCreateUser } from '@/hooks/data/useCreateUser'
import { UserListView } from '@/components/features/users/UserListView'
import { UserListSkeleton } from '@/components/features/users/UserListSkeleton'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'

export function UserListContainer() {
  const {
    data,
    isLoading,
    isError,
    error,
    params,
    setPage,
    setSearch,
    setSort,
  } = useUserList()

  const createUser = useCreateUser()

  if (isLoading) return <UserListSkeleton />
  if (isError) return <ErrorState message={error?.message} />
  if (!data?.items.length) return <EmptyState title="No users found" />

  return (
    <UserListView
      users={data.items}
      pagination={data.pagination}
      params={params}
      onPageChange={setPage}
      onSearchChange={setSearch}
      onSortChange={setSort}
      onCreateUser={createUser.mutate}
      isCreating={createUser.isPending}
    />
  )
}
```

---

## Zustand — What Goes Here

```ts
// stores/ui.store.ts — UI state only

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface UIStore {
  // Sidebar
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void

  // Theme
  theme: Theme
  setTheme: (theme: Theme) => void

  // Command palette
  commandPaletteOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: 'system',
      commandPaletteOpen: false,

      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
      setTheme: (theme) => set({ theme }),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
    }),
    {
      name: 'ui-preferences',
      partialize: (state) => ({ theme: state.theme, sidebarOpen: state.sidebarOpen }),
    }
  )
)
```

---

## What Goes Where: State Decision Tree

```
Is this data from the server?
├── YES → React Query (useQuery / useMutation)
│         Don't put it in Zustand. React Query IS your cache.
└── NO → Is it needed across many unrelated components?
         ├── YES → Zustand store
         └── NO → Is it only used in one component tree?
                  ├── YES → useState or useReducer locally
                  └── NO → React Context (for DI, not state)
```
