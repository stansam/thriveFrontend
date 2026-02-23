# NAMING.md — File, Variable, Component & Hook Naming Conventions

[[SKILLS.md]](./SKILLS.md) | **You are here: Naming**

---

## Core Naming Philosophy

- Names must be **self-documenting** — a reader should know what something does without reading the implementation
- Names must be **consistent** — the same pattern every time, no exceptions
- Names must be **searchable** — grep-friendly, predictable
- **No abbreviations** unless universally understood (`id`, `url`, `api`, `html`, `css`)

---

## File Naming

| Type | Convention | Example |
|------|-----------|---------|
| React Component | `PascalCase.tsx` | `UserProfile.tsx` |
| Component folder | `PascalCase/` | `UserProfile/` |
| Component index | `index.ts` | `index.ts` |
| Hook | `camelCase.ts` | `useAuth.ts` |
| Service | `camelCase.service.ts` | `auth.service.ts` |
| Store | `camelCase.store.ts` | `auth.store.ts` |
| Types file | `camelCase.types.ts` | `auth.types.ts` |
| Utility | `camelCase.ts` | `formatDate.ts` |
| Constants | `SCREAMING_SNAKE.ts` or `constants.ts` | `routes.ts` |
| Test (unit) | `ComponentName.test.tsx` | `UserProfile.test.tsx` |
| Test (E2E) | `feature.spec.ts` | `auth.spec.ts` |
| API route | `route.ts` (App Router standard) | `app/api/auth/login/route.ts` |
| Page | `page.tsx` | `app/dashboard/page.tsx` |
| Layout | `layout.tsx` | `app/(dashboard)/layout.tsx` |
| Loading | `loading.tsx` | `app/dashboard/loading.tsx` |
| Error | `error.tsx` | `app/dashboard/error.tsx` |
| Middleware | `middleware.ts` | `middleware.ts` (root) |
| Config | `camelCase.config.ts` | `query-client.config.ts` |
| CSS module | `ComponentName.module.css` | `UserProfile.module.css` |

---

## Variable & Function Naming

### Variables
```ts
// ✅ Descriptive, noun-based
const userProfile = await getUser(id)
const isLoading = true
const hasError = false
const shouldRedirect = !isAuthenticated

// ✅ Boolean prefix: is, has, should, can, will, did
const isAuthenticated: boolean
const hasPermission: boolean
const shouldShowModal: boolean
const canEditPost: boolean

// ❌ Vague, meaningless
const data = await getUser(id)
const flag = true
const temp = response.data
const x = 5
```

### Functions
```ts
// ✅ Verb-first: get, fetch, create, update, delete, handle, on, validate, transform, format
async function getUserById(id: string): Promise<ServiceResult<User>>
async function createProject(input: CreateProjectInput): Promise<ServiceResult<Project>>
function handleFormSubmit(event: React.FormEvent): void
function onUserClick(userId: string): void
function validateEmail(email: string): boolean
function formatCurrency(amount: number, currency: string): string
function transformApiUser(raw: RawApiUser): User

// ✅ Event handlers: on + Event
function onLoginSuccess(user: AuthUser): void
function onModalClose(): void
function onSearchChange(query: string): void

// ❌ Vague
async function getData()
function process(input: unknown)
function doStuff()
```

---

## Component Naming

```tsx
// ✅ PascalCase, descriptive, noun-based
export function UserProfileCard({ user }: UserProfileCardProps) {}
export function DashboardStatsWidget({ stats }: DashboardStatsWidgetProps) {}
export function AuthLoginForm({ onSuccess }: AuthLoginFormProps) {}

// ✅ Props interface: ComponentName + Props
interface UserProfileCardProps {
  user: User
  onEdit?: () => void
}

// ✅ HOC/wrapper: With prefix
export function withAuthGuard<T>(Component: React.ComponentType<T>) {}

// ✅ Context: Domain + Context
const AuthContext = createContext<AuthContextValue | null>(null)

// ✅ Provider: Domain + Provider
export function AuthProvider({ children }: WithChildren) {}
```

---

## Hook Naming

```ts
// Pattern: use + Domain + Action (action optional if it's just "data")

// Data fetching hooks
export function useUserProfile(userId: string)      // fetches user profile
export function useDashboardStats()                  // fetches dashboard stats
export function useProjectList(filters: Filters)     // fetches project list

// Auth hooks
export function useAuth()                            // current auth state
export function useAuthLogin()                       // login mutation
export function useAuthLogout()                      // logout mutation
export function useRequireAuth()                     // throws/redirects if unauth

// UI hooks
export function useBreakpoint()                      // current breakpoint
export function useLocalStorage<T>(key: string)     // typed localStorage
export function useDebounce<T>(value: T, ms: number)
export function useOutsideClick(ref, handler)
export function useKeyboard(key: string, handler)

// ❌ Bad hook names
export function useData()          // too vague
export function fetchUser()        // not prefixed with "use"
export function useDoLogin()       // "Do" is redundant
```

---

## Service Naming

```ts
// Pattern: Domain + Service object with methods

// auth.service.ts
export const authService = {
  login: async (input: LoginRequest): Promise<ServiceResult<LoginResponse>> => {},
  logout: async (): Promise<ServiceResult<void>> => {},
  getSession: async (): Promise<ServiceResult<AuthUser>> => {},
  register: async (input: RegisterRequest): Promise<ServiceResult<AuthUser>> => {},
}

// user.service.ts
export const userService = {
  getById: async (id: string): Promise<ServiceResult<User>> => {},
  getList: async (params: UserListParams): Promise<ServiceResult<PaginatedList<User>>> => {},
  update: async (id: string, input: UpdateUserInput): Promise<ServiceResult<User>> => {},
  delete: async (id: string): Promise<ServiceResult<void>> => {},
}
```

---

## Store Naming

```ts
// Pattern: use + Domain + Store

// auth.store.ts
export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  status: 'loading',
  setUser: (user: AuthUser) => set({ user, status: 'authenticated' }),
  clearUser: () => set({ user: null, status: 'unauthenticated' }),
}))

// ui.store.ts
export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: false,
  theme: 'system',
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  setTheme: (theme: Theme) => set({ theme }),
}))
```

---

## Type & Schema Naming

```ts
// Schemas: PascalCase + Schema suffix
export const UserSchema = z.object({...})
export const LoginRequestSchema = z.object({...})
export const PaginatedListSchema = z.object({...})

// Types: PascalCase, no suffix needed (inferred from schema)
export type User = z.infer<typeof UserSchema>
export type LoginRequest = z.infer<typeof LoginRequestSchema>

// Input types: Verb + Entity + Input
export type CreateUserInput = z.infer<typeof CreateUserInputSchema>
export type UpdateProjectInput = z.infer<typeof UpdateProjectInputSchema>

// Response types: Entity + Response
export type LoginResponse = z.infer<typeof LoginResponseSchema>
export type UserListResponse = z.infer<typeof UserListResponseSchema>

// Enum-like: PascalCase, values SCREAMING_SNAKE or lowercase-kebab
export const UserRoleSchema = z.enum(['admin', 'user', 'viewer'])
export type UserRole = z.infer<typeof UserRoleSchema>
// Usage: UserRole → 'admin' | 'user' | 'viewer'
```

---

## Route Constants

```ts
// config/routes.ts — typed route constants, never hardcode paths

export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  settings: {
    root: '/settings',
    profile: '/settings/profile',
    security: '/settings/security',
    notifications: '/settings/notifications',
  },
  users: {
    list: '/users',
    detail: (id: string) => `/users/${id}`,
    edit: (id: string) => `/users/${id}/edit`,
  },
} as const

// API routes
export const API_ROUTES = {
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    me: '/api/auth/me',
  },
  users: {
    list: '/api/users',
    detail: (id: string) => `/api/users/${id}`,
  },
} as const
```

---

## Test Naming

```ts
// Unit test: describe = Component/function name, it = behavior description
describe('UserProfileCard', () => {
  it('renders the user display name', () => {})
  it('calls onEdit when edit button is clicked', () => {})
  it('shows loading skeleton when isLoading is true', () => {})
  it('does not render delete button for non-admin users', () => {})
})

// Hook test
describe('useAuth', () => {
  it('returns unauthenticated state initially', () => {})
  it('updates user after successful login', () => {})
})

// E2E test: feature.spec.ts
// describe = feature flow
describe('Authentication Flow', () => {
  it('allows a user to log in with valid credentials', async () => {})
  it('shows error message for invalid credentials', async () => {})
  it('redirects to dashboard after successful login', async () => {})
})
```
