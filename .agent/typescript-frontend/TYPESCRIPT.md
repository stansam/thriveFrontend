# TYPESCRIPT.md — Strict Typing, Zod Schemas & Type Architecture

[[SKILLS.md]](./SKILLS.md) | **You are here: TypeScript**

---

## `tsconfig.json` — Canonical Strict Configuration

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## The Zod-First Principle

> **Rule**: Zod schemas are the single source of truth. TypeScript types are DERIVED from them.

```ts
// ✅ CORRECT: Define Zod schema first, derive type
import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: z.enum(['admin', 'user', 'viewer']),
  createdAt: z.string().datetime(),
  avatar: z.string().url().nullable(),
})

export type User = z.infer<typeof UserSchema>

// ❌ WRONG: Separate type + schema (they'll drift)
export type User = {
  id: string
  email: string
  // ...
}
export const UserSchema = z.object({ /* ...duplicated */ })
```

---

## Schema File Structure

Each domain has one types file. Structure within that file:

```ts
// types/auth.types.ts

import { z } from 'zod'

// ─── Request Schemas ────────────────────────────────────────────
export const LoginRequestSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const RegisterRequestSchema = LoginRequestSchema.extend({
  name: z.string().min(1, 'Name is required').max(100),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

// ─── Response Schemas ───────────────────────────────────────────
export const AuthUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['admin', 'user', 'viewer']),
  permissions: z.array(z.string()),
})

export const LoginResponseSchema = z.object({
  user: AuthUserSchema,
  message: z.string(),
})

// ─── Inferred Types ─────────────────────────────────────────────
export type LoginRequest = z.infer<typeof LoginRequestSchema>
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>
export type AuthUser = z.infer<typeof AuthUserSchema>
export type LoginResponse = z.infer<typeof LoginResponseSchema>

// ─── Discriminated Unions ───────────────────────────────────────
export const AuthStateSchema = z.discriminatedUnion('status', [
  z.object({ status: z.literal('authenticated'), user: AuthUserSchema }),
  z.object({ status: z.literal('unauthenticated') }),
  z.object({ status: z.literal('loading') }),
])

export type AuthState = z.infer<typeof AuthStateSchema>
```

---

## API Response Wrapper

All API responses from the Flask backend should conform to this envelope:

```ts
// types/api.types.ts

import { z } from 'zod'

export const ApiSuccessSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    message: z.string().optional(),
  })

export const ApiErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  code: z.string().optional(),
  details: z.record(z.string(), z.array(z.string())).optional(),
})

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.discriminatedUnion('success', [
    ApiSuccessSchema(dataSchema),
    ApiErrorSchema,
  ])

export type ApiSuccess<T> = { success: true; data: T; message?: string }
export type ApiError = z.infer<typeof ApiErrorSchema>
export type ApiResponse<T> = ApiSuccess<T> | ApiError
```

---

## Generic Service Return Type

```ts
// lib/service-result.ts

export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: string }

export function ok<T>(data: T): ServiceResult<T> {
  return { ok: true, data }
}

export function fail(error: string, code?: string): ServiceResult<never> {
  return { ok: false, error, code }
}
```

---

## Strict Component Props Patterns

```ts
// ✅ Always explicit, never infer from usage
interface UserCardProps {
  user: User
  onEdit: (userId: string) => void
  onDelete: (userId: string) => Promise<void>
  isLoading?: boolean
  className?: string
}

// ✅ Use discriminated unions for conditional props
type ButtonProps =
  | { variant: 'link'; href: string; onClick?: never }
  | { variant: 'button'; href?: never; onClick: () => void }

// ✅ Extend HTML element props correctly
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

// ❌ Never use `any`
interface BadProps {
  data: any  // FORBIDDEN
  handler: Function  // FORBIDDEN
  config: object  // FORBIDDEN
}
```

---

## Utility Types in Practice

```ts
// Commonly needed — define in lib/types.ts

/** Make specific keys required */
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>

/** Strict record with known keys */
export type StrictRecord<K extends string, V> = Record<K, V>

/** Awaited return type of async function */
export type AsyncReturnType<T extends (...args: unknown[]) => Promise<unknown>> =
  Awaited<ReturnType<T>>

/** Component with children */
export type WithChildren<T = unknown> = T & { children: React.ReactNode }

/** Nullable fields */
export type Nullable<T> = { [K in keyof T]: T[K] | null }

/** Deep partial */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

/** Route params */
export type PageProps<P = Record<string, string>, S = Record<string, string>> = {
  params: P
  searchParams: S
}
```

---

## Runtime Validation at Boundaries

Validate at every data boundary — never trust external data:

```ts
// services/user.service.ts

import { UserSchema } from '@/types/user.types'

export async function getUser(id: string) {
  const response = await apiClient.get(`/api/users/${id}`)
  
  // Validate the response at runtime
  const parsed = UserSchema.safeParse(response.data)
  
  if (!parsed.success) {
    // Log the Zod error in dev, return typed failure
    console.error('[getUser] Validation failed:', parsed.error.format())
    return fail('Invalid user data from server')
  }
  
  return ok(parsed.data)
}
```

---

## Environment Variable Types

```ts
// types/env.d.ts — augment process.env

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Server-only (never NEXT_PUBLIC_)
      FLASK_API_URL: string
      SESSION_SECRET: string
      NODE_ENV: 'development' | 'production' | 'test'
      
      // Public (safe to expose)
      NEXT_PUBLIC_APP_NAME: string
      NEXT_PUBLIC_APP_URL: string
    }
  }
}

export {} // Make it a module
```

---

## Forbidden Patterns

```ts
// ❌ Never use `any`
const data: any = response.data

// ❌ Never use non-null assertion without a comment
const user = session.user!  // forbidden without // reason: guaranteed by middleware

// ❌ Never use `as` for type narrowing without validation
const user = response.data as User  // use Zod.parse() instead

// ❌ Never use `Function` type
const handler: Function = () => {}  // use explicit signature

// ❌ Never ignore TypeScript errors
// @ts-ignore  // forbidden — use @ts-expect-error with explanation if truly needed

// ✅ If a type assertion is truly necessary, document why
const canvas = document.getElementById('canvas') as HTMLCanvasElement
// ^ Safe: we control the DOM and know this element exists and is a canvas
```
