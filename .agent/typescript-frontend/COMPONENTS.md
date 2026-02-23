# COMPONENTS.md — Component Design & Patterns

[[SKILLS.md]](./SKILLS.md) | **You are here: Components**

---

## Component Classification

| Type | Location | Has Data? | Has Side Effects? |
|------|----------|-----------|-------------------|
| Page shell | `app/*/page.tsx` | No | No |
| Container | `containers/` | Via hooks | Yes (mutations) |
| Feature component | `components/features/` | Props only | Callbacks only |
| Common component | `components/common/` | Props only | Callbacks only |
| UI primitive | `components/ui/` | Props only | No |

---

## The Pure Component Rule

Feature and common components are PURE — same props = same output.

```tsx
// ✅ Pure: no fetching, no stores, no routing
interface UserCardProps {
  user: User
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  isDeleting?: boolean
}

export function UserCard({ user, onEdit, onDelete, isDeleting }: UserCardProps) {
  return (
    <div className="...">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={() => onEdit(user.id)}>Edit</button>
      <button onClick={() => onDelete(user.id)} disabled={isDeleting}>
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  )
}

// ❌ Impure: fetches its own data
export function UserCard({ userId }: { userId: string }) {
  const { data } = useQuery(...)  // FORBIDDEN in feature component
  ...
}
```

---

## Composition over Configuration

Prefer composing small components over `if/else` in one big component:

```tsx
// ✅ Composition
<Button>
  <Button.Icon><TrashIcon /></Button.Icon>
  <Button.Label>Delete</Button.Label>
</Button>

// ❌ Configuration hell
<Button icon={<TrashIcon />} iconPosition="left" showLabel={true} label="Delete" />
```

---

## Compound Component Pattern

```tsx
// components/ui/Card/Card.tsx

interface CardProps {
  className?: string
  children: React.ReactNode
}

function Card({ className, children }: CardProps) {
  return (
    <div className={cn('rounded-xl border border-border-default bg-bg-base shadow-sm', className)}>
      {children}
    </div>
  )
}

function CardHeader({ className, children }: CardProps) {
  return (
    <div className={cn('border-b border-border-default px-6 py-4', className)}>
      {children}
    </div>
  )
}

function CardBody({ className, children }: CardProps) {
  return <div className={cn('px-6 py-4', className)}>{children}</div>
}

function CardFooter({ className, children }: CardProps) {
  return (
    <div className={cn('border-t border-border-default px-6 py-4', className)}>
      {children}
    </div>
  )
}

// Attach sub-components
Card.Header = CardHeader
Card.Body = CardBody
Card.Footer = CardFooter

export { Card }

// Usage:
// <Card>
//   <Card.Header><h2>Title</h2></Card.Header>
//   <Card.Body>Content</Card.Body>
//   <Card.Footer>Actions</Card.Footer>
// </Card>
```

---

## Button Component

```tsx
// components/ui/Button/Button.tsx

import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary: 'bg-brand-500 text-white hover:bg-brand-600 shadow-sm',
        secondary: 'bg-bg-muted text-text-primary hover:bg-bg-emphasis border border-border-default',
        ghost: 'text-text-secondary hover:bg-bg-muted hover:text-text-primary',
        danger: 'bg-error-500 text-white hover:bg-error-600',
        outline: 'border border-border-default bg-transparent text-text-primary hover:bg-bg-muted',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-4',
        lg: 'h-11 px-6 text-base',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  asChild?: boolean
}

export function Button({
  className,
  variant,
  size,
  loading,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Spinner className="h-4 w-4" aria-hidden />
      ) : leftIcon ? (
        <span aria-hidden>{leftIcon}</span>
      ) : null}
      {children}
      {!loading && rightIcon && <span aria-hidden>{rightIcon}</span>}
    </button>
  )
}
```

---

## List Rendering with Virtualization

For lists > 50 items, use virtual rendering:

```tsx
import { useVirtualizer } from '@tanstack/react-virtual'

export function VirtualUserList({ users }: { users: User[] }) {
  const parentRef = React.useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: users.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64, // estimated row height in px
    overscan: 5,
  })

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div style={{ height: virtualizer.getTotalSize() + 'px', position: 'relative' }}>
        {virtualizer.getVirtualItems().map(item => (
          <div
            key={item.key}
            style={{
              position: 'absolute',
              top: item.start + 'px',
              width: '100%',
              height: item.size + 'px',
            }}
          >
            <UserRow user={users[item.index]!} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## Error Boundary

```tsx
// components/common/ErrorBoundary/ErrorBoundary.tsx
'use client'

import React from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info)
    // Send to error tracking service
  }

  render() {
    if (this.state.error) {
      const Fallback = this.props.fallback ?? DefaultErrorFallback
      return (
        <Fallback
          error={this.state.error}
          reset={() => this.setState({ error: null })}
        />
      )
    }
    return this.props.children
  }
}

function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <p className="text-sm text-text-secondary">Something went wrong: {error.message}</p>
      <button onClick={reset} className="mt-4 text-sm text-brand-500 hover:underline">
        Try again
      </button>
    </div>
  )
}
```
