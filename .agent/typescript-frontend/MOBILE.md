# MOBILE.md — Mobile-First & Separate Mobile Flows

[[SKILLS.md]](./SKILLS.md) | **You are here: Mobile**

---

## Mobile Philosophy

Mobile is NOT just "smaller desktop". When UX diverges significantly:
- Create separate mobile components (`UserCard.mobile.tsx`)
- Use the `useBreakpoint` hook to render the correct component
- Never force desktop UX onto mobile with just `hidden md:block`

## Mobile Component Convention

```tsx
// Pattern for components with diverging mobile/desktop UX

// components/features/users/UserCard/
//   UserCard.tsx           ← exports the smart wrapper
//   UserCard.desktop.tsx   ← desktop layout
//   UserCard.mobile.tsx    ← mobile layout (swipeable, tap-friendly)
//   index.ts

// UserCard.tsx
'use client'
import { useBreakpoint } from '@/hooks/ui/useBreakpoint'
import { UserCardDesktop } from './UserCard.desktop'
import { UserCardMobile } from './UserCard.mobile'
import type { UserCardProps } from './UserCard.types'

export function UserCard(props: UserCardProps) {
  const { isMobile } = useBreakpoint()
  return isMobile ? <UserCardMobile {...props} /> : <UserCardDesktop {...props} />
}
```

## Mobile UX Requirements

- **Touch targets**: minimum 44×44px for all interactive elements
- **Tap feedback**: every button has active state (`active:scale-95`)
- **Swipe gestures**: lists support swipe-to-action where appropriate
- **Bottom navigation**: mobile nav is at the bottom, not top sidebar
- **No hover-only UX**: every hover interaction has a tap equivalent
- **Keyboard avoidance**: forms scroll to keep inputs above keyboard
- **Pull to refresh**: long lists support pull-to-refresh

```tsx
// Mobile bottom navigation
export function MobileBottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 border-t border-border-default bg-bg-base md:hidden">
      {NAV_ITEMS.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex flex-1 flex-col items-center justify-center gap-1 text-xs',
            pathname === item.href ? 'text-brand-500' : 'text-text-tertiary'
          )}
        >
          <item.Icon className="h-5 w-5" aria-hidden />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}
```

## Mobile Form Patterns

```tsx
// Mobile inputs need explicit inputMode for correct keyboard type
<input inputMode="email" type="email" />
<input inputMode="numeric" type="number" />
<input inputMode="tel" type="tel" />

// Use native selects on mobile (better UX than custom dropdowns)
// Detect mobile and swap component
```
