# UI_UX.md — Design System, Theme, Motion & UX Standards

[[SKILLS.md]](./SKILLS.md) | **You are here: UI/UX**

---

## Design Philosophy

1. **Instant feel**: Every interaction must respond in <100ms visually (even if data takes longer)
2. **Content-first**: Skeleton loaders match the exact layout of real content
3. **Smooth entry**: Pages animate in — no jarring flashes of content
4. **Progressive disclosure**: Show what's needed now; reveal complexity as needed
5. **Forgiveness**: Every destructive action has undo or confirmation

---

## Design Tokens (CSS Variables)

All visual values come from tokens. Never hardcode.

```css
/* styles/tokens.css */

:root {
  /* ── Brand ──────────────────────────────────────── */
  --brand-50:  #eff6ff;
  --brand-100: #dbeafe;
  --brand-200: #bfdbfe;
  --brand-300: #93c5fd;
  --brand-400: #60a5fa;
  --brand-500: #3b82f6;  /* primary */
  --brand-600: #2563eb;  /* primary hover */
  --brand-700: #1d4ed8;
  --brand-800: #1e40af;
  --brand-900: #1e3a8a;

  /* ── Neutral ─────────────────────────────────────── */
  --neutral-0:   #ffffff;
  --neutral-50:  #f8fafc;
  --neutral-100: #f1f5f9;
  --neutral-200: #e2e8f0;
  --neutral-300: #cbd5e1;
  --neutral-400: #94a3b8;
  --neutral-500: #64748b;
  --neutral-600: #475569;
  --neutral-700: #334155;
  --neutral-800: #1e293b;
  --neutral-900: #0f172a;
  --neutral-950: #020617;

  /* ── Semantic ────────────────────────────────────── */
  --success-50:  #f0fdf4;
  --success-500: #22c55e;
  --success-600: #16a34a;

  --warning-50:  #fffbeb;
  --warning-500: #f59e0b;
  --warning-600: #d97706;

  --error-50:   #fef2f2;
  --error-500:  #ef4444;
  --error-600:  #dc2626;

  --info-50:   #eff6ff;
  --info-500:  #3b82f6;

  /* ── Surface (Light Mode) ───────────────────────── */
  --bg-base:       var(--neutral-0);
  --bg-subtle:     var(--neutral-50);
  --bg-muted:      var(--neutral-100);
  --bg-emphasis:   var(--neutral-200);

  --text-primary:   var(--neutral-900);
  --text-secondary: var(--neutral-600);
  --text-tertiary:  var(--neutral-400);
  --text-inverse:   var(--neutral-0);

  --border-default: var(--neutral-200);
  --border-strong:  var(--neutral-300);
  --border-focus:   var(--brand-500);

  /* ── Spacing ─────────────────────────────────────── */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */

  /* ── Typography ──────────────────────────────────── */
  --font-sans: 'Inter Variable', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --font-display: 'Cal Sans', 'Inter Variable', sans-serif;

  --text-xs:   0.75rem;    /* 12px */
  --text-sm:   0.875rem;   /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg:   1.125rem;   /* 18px */
  --text-xl:   1.25rem;    /* 20px */
  --text-2xl:  1.5rem;     /* 24px */
  --text-3xl:  1.875rem;   /* 30px */
  --text-4xl:  2.25rem;    /* 36px */

  /* ── Radius ──────────────────────────────────────── */
  --radius-sm:  0.25rem;
  --radius-md:  0.375rem;
  --radius-lg:  0.5rem;
  --radius-xl:  0.75rem;
  --radius-2xl: 1rem;
  --radius-full: 9999px;

  /* ── Shadow ──────────────────────────────────────── */
  --shadow-sm:  0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl:  0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

  /* ── Motion ──────────────────────────────────────── */
  --duration-fast:   150ms;
  --duration-normal: 250ms;
  --duration-slow:   400ms;
  --ease-out:    cubic-bezier(0.0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Dark mode */
[data-theme="dark"] {
  --bg-base:       var(--neutral-950);
  --bg-subtle:     var(--neutral-900);
  --bg-muted:      var(--neutral-800);
  --bg-emphasis:   var(--neutral-700);

  --text-primary:   var(--neutral-50);
  --text-secondary: var(--neutral-400);
  --text-tertiary:  var(--neutral-600);
  --text-inverse:   var(--neutral-950);

  --border-default: var(--neutral-800);
  --border-strong:  var(--neutral-700);
}
```

---

## Tailwind Config

```ts
// tailwind.config.ts

import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './containers/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'var(--brand-50)',
          // ... map all tokens
          500: 'var(--brand-500)',
          600: 'var(--brand-600)',
        },
        bg: {
          base: 'var(--bg-base)',
          subtle: 'var(--bg-subtle)',
          muted: 'var(--bg-muted)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
        },
        border: {
          default: 'var(--border-default)',
          strong: 'var(--border-strong)',
          focus: 'var(--border-focus)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
        display: ['var(--font-display)'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      animation: {
        'fade-in': 'fadeIn var(--duration-normal) var(--ease-out)',
        'slide-up': 'slideUp var(--duration-normal) var(--ease-out)',
        'slide-down': 'slideDown var(--duration-normal) var(--ease-out)',
        'scale-in': 'scaleIn var(--duration-fast) var(--ease-spring)',
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        skeleton: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
} satisfies Config
```

---

## Page Transition & Smooth Entry

```tsx
// components/common/PageTransition/PageTransition.tsx
'use client'

import { motion } from 'framer-motion'
import type { WithChildren } from '@/types/common.types'

export function PageTransition({ children }: WithChildren) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.0, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}

// Staggered children animation
export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

export const fadeUpItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.0, 0, 0.2, 1] } },
}
```

---

## Skeleton Loading

Skeletons must MATCH the real layout exactly — not generic gray boxes:

```tsx
// components/features/users/UserCardSkeleton.tsx

export function UserCardSkeleton() {
  return (
    <div className="rounded-xl border border-border-default bg-bg-subtle p-4 animate-skeleton">
      {/* Avatar */}
      <div className="h-10 w-10 rounded-full bg-bg-emphasis" />
      {/* Name */}
      <div className="mt-3 h-4 w-32 rounded bg-bg-emphasis" />
      {/* Email */}
      <div className="mt-2 h-3 w-48 rounded bg-bg-emphasis" />
      {/* Badge */}
      <div className="mt-4 h-6 w-16 rounded-full bg-bg-emphasis" />
    </div>
  )
}
```

---

## Empty States

Every list/page that can be empty has a designed empty state:

```tsx
// components/common/EmptyState/EmptyState.tsx

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {icon && (
        <div className="mb-4 rounded-xl bg-bg-muted p-4 text-text-tertiary">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  )
}
```

---

## Accessibility Standards

```tsx
// Every interactive component must:

// 1. Be keyboard navigable
<button
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  tabIndex={0}
>

// 2. Have proper ARIA labels
<button aria-label="Delete user John Doe">
  <TrashIcon aria-hidden="true" />
</button>

// 3. Announce status changes
<div role="status" aria-live="polite" className="sr-only">
  {isLoading ? 'Loading...' : 'Data loaded'}
</div>

// 4. Have visible focus styles
// In globals.css:
// *:focus-visible {
//   outline: 2px solid var(--border-focus);
//   outline-offset: 2px;
// }

// 5. Semantic HTML hierarchy
<main>
  <section aria-labelledby="users-heading">
    <h2 id="users-heading">Users</h2>
    ...
  </section>
</main>
```

---

## Responsive Breakpoints

```ts
// lib/breakpoints.ts

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

// Mobile is < md (768px)
// Tablet is md-lg
// Desktop is > lg
```

```ts
// hooks/ui/useBreakpoint.ts

import { useState, useEffect } from 'react'
import { BREAKPOINTS } from '@/lib/breakpoints'

export function useBreakpoint() {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    setWidth(window.innerWidth)
    const handler = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return {
    isMobile: width < BREAKPOINTS.md,
    isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
    isDesktop: width >= BREAKPOINTS.lg,
    width,
  }
}
```
