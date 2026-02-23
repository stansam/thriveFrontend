# FORMS.md — Form Architecture

[[SKILLS.md]](./SKILLS.md) | **You are here: Forms**

---

## Stack: React Hook Form + Zod

Every form in the project follows this exact pattern. No exceptions.

```
Zod Schema (source of truth for validation)
    ↓
zodResolver (bridges Zod to RHF)
    ↓
useForm (RHF — manages state, errors, submission)
    ↓
FormField components (controlled via Controller)
    ↓
onSubmit → service call via mutation hook
```

---

## Canonical Form Pattern

```tsx
// components/features/auth/LoginForm/LoginForm.tsx

'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { LoginRequestSchema, type LoginRequest } from '@/types/auth.types'
import { useAuthLogin } from '@/hooks/auth/useAuth'
import { FormField } from '@/components/ui/FormField'
import { Button } from '@/components/ui/Button'

export function LoginForm() {
  const login = useAuthLogin()

  const form = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',        // validate on blur, not on every keystroke
  })

  async function onSubmit(data: LoginRequest) {
    await login.mutateAsync(data)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <div className="space-y-4">
        <FormField
          label="Email"
          error={form.formState.errors.email?.message}
          required
        >
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            {...form.register('email')}
            className="input"
            aria-describedby={form.formState.errors.email ? 'email-error' : undefined}
          />
        </FormField>

        <FormField
          label="Password"
          error={form.formState.errors.password?.message}
          required
        >
          <input
            type="password"
            autoComplete="current-password"
            {...form.register('password')}
            className="input"
          />
        </FormField>

        {/* Server error */}
        {login.isError && (
          <motion.p
            role="alert"
            className="text-sm text-error-600"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {login.error?.message}
          </motion.p>
        )}

        <Button
          type="submit"
          loading={login.isPending}
          disabled={!form.formState.isValid || login.isPending}
          className="w-full"
        >
          Sign in
        </Button>
      </div>
    </form>
  )
}
```

---

## FormField Wrapper Component

```tsx
// components/ui/FormField/FormField.tsx

interface FormFieldProps {
  label: string
  error?: string
  hint?: string
  required?: boolean
  children: React.ReactElement
}

export function FormField({ label, error, hint, required, children }: FormFieldProps) {
  const fieldId = React.useId()
  const errorId = `${fieldId}-error`
  const hintId = `${fieldId}-hint`

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={fieldId}
        className="block text-sm font-medium text-text-primary"
      >
        {label}
        {required && <span className="ml-1 text-error-500" aria-label="required">*</span>}
      </label>

      {React.cloneElement(children, {
        id: fieldId,
        'aria-invalid': error ? 'true' : undefined,
        'aria-describedby': [error && errorId, hint && hintId].filter(Boolean).join(' ') || undefined,
      })}

      {hint && !error && (
        <p id={hintId} className="text-xs text-text-tertiary">{hint}</p>
      )}

      {error && (
        <motion.p
          id={errorId}
          role="alert"
          className="text-xs text-error-600"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}
```

---

## Multi-Step Form Pattern

```tsx
// hooks/ui/useMultiStepForm.ts

import { useState } from 'react'

export function useMultiStepForm<T>(steps: number, initialData: T) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<T>(initialData)

  function updateData(partial: Partial<T>) {
    setData(prev => ({ ...prev, ...partial }))
  }

  return {
    step,
    totalSteps: steps,
    data,
    updateData,
    isFirst: step === 0,
    isLast: step === steps - 1,
    progress: ((step + 1) / steps) * 100,
    next: () => setStep(s => Math.min(s + 1, steps - 1)),
    prev: () => setStep(s => Math.max(s - 1, 0)),
    goTo: (s: number) => setStep(s),
  }
}
```

---

## Form Submission States

```tsx
// Every form must handle these 4 states:
// 1. Idle (default)
// 2. Submitting (pending)
// 3. Success
// 4. Error

{login.isIdle && <Button type="submit">Sign in</Button>}
{login.isPending && <Button loading disabled>Signing in…</Button>}
{login.isSuccess && <SuccessMessage />}
{login.isError && <ErrorAlert message={login.error.message} />}
```
