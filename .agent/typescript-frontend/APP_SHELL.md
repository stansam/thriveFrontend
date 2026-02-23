# APP_SHELL.md — Application Shell, Layout & Navigation Patterns

[[SKILLS.md]](./SKILLS.md) | **You are here: App Shell**

---

## Shell Architecture

The shell is the persistent chrome around authenticated pages: sidebar, topbar, content area, mobile nav. It lives in `app/(dashboard)/layout.tsx` and renders once — pages slot into `{children}`.

```
┌──────────────────────────────────────────────────────┐
│  Topbar (fixed, 56px)                                │
├──────────────┬───────────────────────────────────────┤
│              │                                       │
│  Sidebar     │   <PageTransition>                    │
│  (240px,     │     {children}  ← page content        │
│  collapsible)│   </PageTransition>                   │
│              │                                       │
└──────────────┴───────────────────────────────────────┘
  [Mobile: bottom nav replaces sidebar]
```

---

## AppShell Component

```tsx
// components/common/AppShell/AppShell.tsx
'use client'

import { useUIStore } from '@/stores/ui.store'
import { Sidebar } from '@/components/common/Sidebar'
import { Topbar } from '@/components/common/Topbar'
import { MobileBottomNav } from '@/components/common/MobileBottomNav'
import { PageTransition } from '@/components/common/PageTransition'
import { cn } from '@/lib/utils'
import type { WithChildren } from '@/types/common.types'

export function AppShell({ children }: WithChildren) {
  const sidebarOpen = useUIStore(s => s.sidebarOpen)

  return (
    <div className="flex h-screen overflow-hidden bg-bg-subtle">
      {/* Sidebar — desktop only */}
      <Sidebar />

      {/* Main content area */}
      <div
        className={cn(
          'flex flex-1 flex-col overflow-hidden transition-all duration-300',
          'md:ml-0',  // sidebar is in flow on desktop
        )}
      >
        <Topbar />

        <main
          id="main-content"
          className="flex-1 overflow-y-auto px-4 py-6 md:px-6 lg:px-8"
          // Bottom padding for mobile nav
          style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))' }}
        >
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav />
    </div>
  )
}
```

---

## Sidebar Component

```tsx
// components/common/Sidebar/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '@/stores/ui.store'
import { useAuth } from '@/hooks/auth/useAuth'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/config/routes'
import {
  LayoutDashboard, Users, Settings, ChevronLeft, LogOut
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', href: ROUTES.dashboard, icon: LayoutDashboard },
  { label: 'Users', href: ROUTES.users.list, icon: Users },
  { label: 'Settings', href: ROUTES.settings.root, icon: Settings },
] as const

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useUIStore()
  const { user } = useAuth()
  const pathname = usePathname()

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 64 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="hidden h-screen flex-col border-r border-border-default bg-bg-base md:flex"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex h-14 items-center justify-between px-4">
          <AnimatePresence mode="wait">
            {sidebarOpen && (
              <motion.span
                key="logo-text"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="font-display text-lg font-semibold text-text-primary"
              >
                {process.env.NEXT_PUBLIC_APP_NAME}
              </motion.span>
            )}
          </AnimatePresence>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-1.5 text-text-tertiary hover:bg-bg-muted hover:text-text-primary transition-colors"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <motion.div animate={{ rotate: sidebarOpen ? 0 : 180 }} transition={{ duration: 0.25 }}>
              <ChevronLeft className="h-4 w-4" />
            </motion.div>
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 space-y-1 px-2 py-4">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
                    : 'text-text-secondary hover:bg-bg-muted hover:text-text-primary'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                <AnimatePresence mode="wait">
                  {sidebarOpen && (
                    <motion.span
                      key={`label-${label}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )
          })}
        </nav>

        {/* User footer */}
        <div className="border-t border-border-default p-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 shrink-0 rounded-full bg-brand-100 flex items-center justify-center">
              <span className="text-xs font-semibold text-brand-600">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <AnimatePresence mode="wait">
              {sidebarOpen && (
                <motion.div
                  key="user-info"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="min-w-0 flex-1"
                >
                  <p className="truncate text-sm font-medium text-text-primary">{user?.name}</p>
                  <p className="truncate text-xs text-text-tertiary">{user?.role}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
        )}
      </AnimatePresence>
    </>
  )
}
```

---

## Topbar Component

```tsx
// components/common/Topbar/Topbar.tsx
'use client'

import { useUIStore } from '@/stores/ui.store'
import { useAuth } from '@/hooks/auth/useAuth'
import { useAuthLogout } from '@/hooks/auth/useAuth'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { Menu, Bell, Search } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { ROUTES } from '@/config/routes'

export function Topbar() {
  const { toggleSidebar } = useUIStore()
  const { user } = useAuth()
  const logout = useAuthLogout()

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border-default bg-bg-base px-4 md:px-6">
      {/* Left: burger (mobile) */}
      <button
        onClick={toggleSidebar}
        className="rounded-lg p-1.5 text-text-tertiary hover:bg-bg-muted md:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Center: search (desktop) */}
      <div className="hidden md:flex flex-1 max-w-md">
        <button
          className="flex w-full items-center gap-2 rounded-lg border border-border-default bg-bg-subtle px-3 py-1.5 text-sm text-text-tertiary hover:border-border-strong transition-colors"
          aria-label="Search"
          onClick={() => useUIStore.getState().setCommandPaletteOpen(true)}
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search…</span>
          <kbd className="ml-auto text-xs text-text-tertiary">⌘K</kbd>
        </button>
      </div>

      {/* Right: actions + user */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        <button className="relative rounded-lg p-1.5 text-text-tertiary hover:bg-bg-muted" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-brand-500" aria-hidden />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-600 hover:bg-brand-200 transition-colors"
              aria-label="User menu"
            >
              {user?.name.charAt(0).toUpperCase()}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-text-primary">{user?.name}</p>
              <p className="text-xs text-text-tertiary truncate">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={ROUTES.settings.profile}>Profile settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout.mutate()}
              className="text-error-600 focus:text-error-600"
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
```

---

## Mobile Bottom Navigation

```tsx
// components/common/MobileBottomNav/MobileBottomNav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Settings } from 'lucide-react'
import { ROUTES } from '@/config/routes'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Home', href: ROUTES.dashboard, icon: LayoutDashboard },
  { label: 'Users', href: ROUTES.users.list, icon: Users },
  { label: 'Settings', href: ROUTES.settings.root, icon: Settings },
] as const

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex h-16 border-t border-border-default bg-bg-base md:hidden"
      aria-label="Mobile navigation"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}
    >
      {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors',
              isActive ? 'text-brand-500' : 'text-text-tertiary'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon
              className={cn('h-5 w-5 transition-transform', isActive && 'scale-110')}
              aria-hidden
            />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
```

---

## Page Header Pattern

```tsx
// components/common/PageHeader/PageHeader.tsx

interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
  breadcrumbs?: Array<{ label: string; href?: string }>
}

export function PageHeader({ title, description, action, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {breadcrumbs && (
        <nav className="mb-2 flex items-center gap-1 text-xs text-text-tertiary" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.label} className="flex items-center gap-1">
              {i > 0 && <span aria-hidden>/</span>}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-text-secondary transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-text-secondary">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-text-secondary">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  )
}
```

---

## Theme Toggle

```tsx
// components/common/ThemeToggle/ThemeToggle.tsx
'use client'

import { useEffect } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useUIStore } from '@/stores/ui.store'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

type Theme = 'light' | 'dark' | 'system'

export function ThemeToggle() {
  const { theme, setTheme } = useUIStore()

  useEffect(() => {
    const root = document.documentElement
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = theme === 'dark' || (theme === 'system' && systemDark)
    root.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [theme])

  const Icon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-lg p-1.5 text-text-tertiary hover:bg-bg-muted" aria-label="Toggle theme">
          <Icon className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(['light', 'dark', 'system'] as Theme[]).map(t => (
          <DropdownMenuItem key={t} onClick={() => setTheme(t)} className="capitalize gap-2">
            {t === 'light' ? <Sun className="h-3.5 w-3.5" /> : t === 'dark' ? <Moon className="h-3.5 w-3.5" /> : <Monitor className="h-3.5 w-3.5" />}
            {t}
            {theme === t && <span className="ml-auto text-brand-500">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```
