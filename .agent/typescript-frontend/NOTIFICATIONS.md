# NOTIFICATIONS.md — Toast, Alerts & Notification Patterns

[[SKILLS.md]](./SKILLS.md) | **You are here: Notifications**

---

## Notification Stack

```
Sonner (toast library) — transient, ephemeral feedback
Alert components     — inline, persistent contextual info
Notification center  — in-app persistent notifications
```

---

## Sonner Setup

```tsx
// app/layout.tsx (root)
import { Toaster } from 'sonner'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="bottom-right"
          expand={false}
          richColors
          closeButton
          toastOptions={{
            duration: 4000,
            classNames: {
              toast: 'font-sans text-sm',
              title: 'font-medium',
            },
          }}
        />
      </body>
    </html>
  )
}
```

---

## useToast Hook

```ts
// hooks/ui/useToast.ts

import { toast as t } from 'sonner'

interface ToastInput {
  title: string
  description?: string
  duration?: number
  action?: { label: string; onClick: () => void }
}

export function useToast() {
  return {
    success: (input: ToastInput) => t.success(input.title, {
      description: input.description,
      duration: input.duration,
      action: input.action ? { label: input.action.label, onClick: input.action.onClick } : undefined,
    }),
    error: (input: ToastInput) => t.error(input.title, {
      description: input.description,
      duration: input.duration ?? 6000, // errors stay longer
    }),
    warning: (input: ToastInput) => t.warning(input.title, {
      description: input.description,
    }),
    info: (input: ToastInput) => t(input.title, {
      description: input.description,
    }),
    loading: (title: string) => t.loading(title),
    dismiss: (id?: string | number) => t.dismiss(id),
    promise: t.promise,
  }
}
```

---

## Promise Toast Pattern

For async operations, use promise toasts — they handle loading/success/error automatically:

```ts
// In a mutation's onMutate / onSuccess:
const { promise } = useToast()

// Option 1: wrap the entire operation
promise(
  userService.update(id, data),
  {
    loading: 'Saving changes…',
    success: 'Changes saved successfully',
    error: (err) => `Failed to save: ${err.message}`,
  }
)

// Option 2: via React Query mutation
useMutation({
  mutationFn: (input) => userService.update(id, input),
  onMutate: () => {
    const toastId = toast.loading('Saving…')
    return { toastId }
  },
  onSuccess: (_, __, context) => {
    toast.dismiss(context?.toastId)
    toast.success({ title: 'Saved successfully' })
  },
  onError: (error, _, context) => {
    toast.dismiss(context?.toastId)
    toast.error({ title: 'Failed to save', description: error.message })
  },
})
```

---

## Inline Alert Component

```tsx
// components/ui/Alert/Alert.tsx

import { cva, type VariantProps } from 'class-variance-authority'
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const alertVariants = cva(
  'relative flex gap-3 rounded-lg border p-4 text-sm',
  {
    variants: {
      variant: {
        info:    'border-info-200 bg-info-50 text-info-800',
        success: 'border-success-200 bg-success-50 text-success-800',
        warning: 'border-warning-200 bg-warning-50 text-warning-800',
        error:   'border-error-200 bg-error-50 text-error-800',
      },
    },
    defaultVariants: { variant: 'info' },
  }
)

const icons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
}

interface AlertProps extends VariantProps<typeof alertVariants> {
  title?: string
  children?: React.ReactNode
  onDismiss?: () => void
  className?: string
}

export function Alert({ variant = 'info', title, children, onDismiss, className }: AlertProps) {
  const Icon = icons[variant ?? 'info']

  return (
    <div className={cn(alertVariants({ variant }), className)} role="alert">
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <div className="flex-1">
        {title && <p className="font-medium">{title}</p>}
        {children && <p className={cn(title && 'mt-1', 'text-sm opacity-90')}>{children}</p>}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="shrink-0 rounded p-0.5 opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
```

---

## Banner Component (page-level alerts)

```tsx
// components/common/Banner/Banner.tsx
// Used for: maintenance warnings, feature announcements, required actions

interface BannerProps {
  message: string
  action?: { label: string; href?: string; onClick?: () => void }
  variant?: 'info' | 'warning' | 'error'
  dismissKey?: string  // localStorage key to remember dismissal
}

export function Banner({ message, action, variant = 'info', dismissKey }: BannerProps) {
  const [dismissed, setDismissed] = useState(() =>
    dismissKey ? localStorage.getItem(`banner-dismissed:${dismissKey}`) === '1' : false
  )

  function dismiss() {
    if (dismissKey) localStorage.setItem(`banner-dismissed:${dismissKey}`, '1')
    setDismissed(true)
  }

  if (dismissed) return null

  const colors = {
    info:    'bg-brand-500 text-white',
    warning: 'bg-warning-500 text-white',
    error:   'bg-error-500 text-white',
  }

  return (
    <motion.div
      className={cn('flex items-center justify-center gap-3 px-4 py-2.5 text-sm', colors[variant])}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
    >
      <span>{message}</span>
      {action && (
        action.href ? (
          <Link href={action.href} className="underline font-medium hover:no-underline">
            {action.label}
          </Link>
        ) : (
          <button onClick={action.onClick} className="underline font-medium hover:no-underline">
            {action.label}
          </button>
        )
      )}
      <button onClick={dismiss} className="ml-2 opacity-75 hover:opacity-100" aria-label="Dismiss banner">
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}
```
