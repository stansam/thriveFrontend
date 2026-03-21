# Phase 2: Component Decomposition & Deep Refactor

> Each component must be ≤ 80–85 lines. Sub-components/hooks live in co-located files
> within the same `_components/` subtree. All rules from `SKILLS.md` apply.

---

## Context

Phase 1 fixed architecture, TypeScript safety, metadata, dead code, naming, and hardcoded values.
Phase 2 addresses a different class of violations: **component size, single-responsibility, and
missing custom hooks**. Every file listed below exceeds 80–85 lines in its current form.

| File                    | Lines | Target                                    |
| ----------------------- | ----- | ----------------------------------------- |
| `book-flight-form.tsx`  | 432   | ≤ 80 (orchestrator) + sub-components      |
| `about-us-section.tsx`  | 430   | ≤ 80 (shell) + moved sub-components       |
| `navbar.tsx`            | 304   | ≤ 80 (orchestrator) + sub-components      |
| `featured-packages.tsx` | 252   | ≤ 80 (card-only) — data logic → container |

---

## Phase 2-A — `book-flight-form.tsx` Decomposition

**Current violations (COMPONENTS.md / CODE_STANDARDS.md):**

- 432 lines, single monolithic component (violates single-responsibility)
- `useEffect`-based location search is a side-effect pattern that belongs in a custom hook
- Two identical location-search dropdowns (duplication)
- `extractCode()` utility defined inline — should be a pure utility function
- Passenger counter duplicated for adults/children
- `onSubmit` URL-building logic is non-trivial and inline

**New file structure:**

```
src/app/(main)/_components/
├── book-flight-form.tsx          (≤70L — orchestrates form, imports all sub-parts)
├── _book-flight/
│   ├── use-location-search.ts    (≤50L — custom hook: debounce + fetch + state)
│   ├── location-input.tsx        (≤60L — single input + dropdown, accepts type prop)
│   ├── passenger-counter.tsx     (≤40L — adults/children counter UI)
│   ├── trip-type-toggle.tsx      (≤30L — round-trip / one-way radio group)
│   └── book-flight.constants.ts  (≤25L — CABIN_CLASS_MAP, CABIN_OPTIONS)
```

**Phase 2-A steps:**

1. **Extract `useLocationSearch(type, formSetValue)` hook** into `_book-flight/use-location-search.ts`
   - Owns: `searchValue`, `results`, `isSearching`, `showDropdown`, debounce `useEffect`, `handleSelect`
   - Returns: `{ inputValue, setInputValue, results, isSearching, showDropdown, setShowDropdown, handleSelect }`
   - Removes both `useEffect` blocks + 4 `useState` calls from the form component

2. **Extract `<LocationInput>` component** into `_book-flight/location-input.tsx`
   - Props: `type: 'from' | 'to'`, `control`, `form`, `debouncedValue`
   - Combines: `<Label>`, `<Input>`, `<MapPin>` icon, dropdown with `<Building>/<Plane>` icons
   - Eliminates the ~60-line duplication between "from" and "to" fields

3. **Extract `<PassengerCounter>` component** into `_book-flight/passenger-counter.tsx`
   - Props: `adults: number`, `children: number`, `onAdultsChange`, `onChildrenChange`
   - Renders both adult + child counters with `<Minus>/<Plus>` buttons
   - Removes ~40 highly-duplicated lines

4. **Extract `<TripTypeToggle>` component** into `_book-flight/trip-type-toggle.tsx`
   - Props: `control`
   - Renders the `<RadioGroup>` round-trip / one-way field

5. **Extract constants** into `_book-flight/book-flight.constants.ts`
   - `CABIN_CLASS_MAP: Record<string, string>` for the URL param mapping
   - `CABIN_OPTIONS: Array<{ value: string; label: string }>` for `<SelectItem>` rendering

6. **Rewrite `book-flight-form.tsx` as orchestrator** (≤70 lines)
   - Uses all extracted sub-components
   - `onSubmit` remains here (navigation concern)
   - Imports schema + types from existing `flight-form.types.ts`

---

## Phase 2-B — `about-us-section.tsx` Decomposition

**Current violations:**

- 430 lines, one file contains 3 different abstractions
- `StatCounter` (lines 383–429) is a self-contained animated counter — should be its own file
- `ServiceItem` (lines 337–372) is a feature sub-component — should be its own file
- `StatCounterProps` uses `React.ReactNode` — should use `type ReactNode` import
- Module-level SERVICES/STATS constants contain inline JSX (icons) — JSX at module scope causes TS1128 risk
- Hardcoded brand colours (`#88734C`, `#202e44`, `#A9BBC8`) — should be CSS custom properties or `cn()` tokens

**New file structure:**

```
src/app/(main)/_components/blocks/
├── about-us-section.tsx          (≤75L — layout shell only)
├── _about-us/
│   ├── service-item.tsx          (≤45L — single service card with motion)
│   ├── stat-counter.tsx          (≤55L — animated spring counter)
│   ├── ceo-portrait.tsx          (≤35L — Image + overlay + floating accents)
│   └── about-us.constants.ts     (≤40L — SERVICES & STATS typed arrays, NO inline JSX)
```

**Phase 2-B steps:**

1. **Create `about-us.constants.ts`** — typed static data, no inline JSX
   - `SERVICES`: replace icon JSX with `iconName: string` (mapped in `ServiceItem`)
   - `STATS`: same pattern — icon as string
   - Define `ServiceData` and `StatData` interfaces

2. **Create `<ServiceItem>` in `_about-us/service-item.tsx`**
   - Accepts `ServiceData` props (with `iconName: string`, maps to Lucide)
   - Self-contained Framer Motion animations
   - Fix `delay` prop (currently passed but animation disabled — reconcile or remove)

3. **Create `<StatCounter>` in `_about-us/stat-counter.tsx`**
   - Move from lines 383–429, fix `React.ReactNode` → `ReactNode`
   - Self-contained spring animation, `useSpring`, `useInView`, `useTransform`

4. **Create `<CeoPortrait>` in `_about-us/ceo-portrait.tsx`**
   - Move the center-column image block (lines 211–260)
   - Props: `y1`, `y2` (parallax motion values)

5. **Simplify animation variants in `about-us-section.tsx`**
   - The current `containerVariants`/`itemVariants` have all transitions set to 0 — they are effectively
     no-ops. Either restore real animations or remove them entirely to simplify the component.

6. **Rewrite `about-us-section.tsx` shell** (≤75 lines)
   - Owns: parallax scroll setup, `isInView`, layout grid
   - Composes: `<ServiceItem>`, `<StatCounter>`, `<CeoPortrait>`, mission/vision cards

---

## Phase 2-C — `navbar.tsx` Decomposition

**Current violations:**

- 304 lines, contains 3 distinct UI regions
- `MobileNav` is already a sub-component but defined in the same file — extract to own file
- `NotificationBell` (lines 186–227 — dropdown + notification items) should be its own component
- `UserMenu` (lines 230–268 — avatar + dropdown) should be its own component
- Hardcoded notification data (still in `useState` — Phase 1 partially addressed this)
- `navLinks` array defined inside render function — should be module-level constant
- Missing `aria-label` on notification bell button

**New file structure:**

```
src/app/(main)/_components/blocks/
├── navbar.tsx                    (≤60L — top strip + header shell)
├── _navbar/
│   ├── mobile-nav.tsx            (≤50L — Popover-based mobile menu)
│   ├── notification-bell.tsx     (≤55L — DropdownMenu with bell icon)
│   ├── user-menu.tsx             (≤45L — Avatar dropdown)
│   └── navbar.constants.ts       (≤20L — NAV_LINKS constant)
```

**Phase 2-C steps:**

1. **Extract `<MobileNav>` to `_navbar/mobile-nav.tsx`**
   - Move lines 44–83 verbatim, fix key `index` → `link.href` (stable key)
   - Props: `links: NavItem[]`

2. **Extract `<NotificationBell>` to `_navbar/notification-bell.tsx`**
   - Props: `notifications`, `onMarkRead`, `onMarkAllRead`, `onViewAll`
   - Contains: bell button, badge, dropdown menu with notification items
   - Removes ~40 lines from navbar

3. **Extract `<UserMenu>` to `_navbar/user-menu.tsx`**
   - Props: `user`, `onLogout`
   - Contains: Avatar trigger, dropdown with dashboard/settings/logout items
   - Removes ~40 lines from navbar

4. **Extract constants to `_navbar/navbar.constants.ts`**
   - `NAV_LINKS: NavItem[]` — remove from inside render

5. **Rewrite `navbar.tsx` as orchestrator** (≤60 lines)
   - Top strip (whatsapp bar) stays here — it's layout-level
   - Composes `<NotificationBell>`, `<UserMenu>`, `<MobileNav>`
   - Notification state managed here OR moved to a `useNotifications` hook

6. **Add `aria-label` to notification bell button** (accessibility gap)

---

## Phase 2-D — `featured-packages.tsx` Decomposition

**Current violations:**

- 252 lines — already has a parallel container (`featured-packages-container.tsx`) that duplicates its logic
- The two files (`featured-packages.tsx` vs `_containers/featured-packages-container.tsx`) now coexist
  doing similar things — one must be the source of truth
- `featured-packages.tsx` still has `priority` on ALL images (LCP issue — fixed in container, not here)
- Inline commented-out JSX at line 180 (`// <AlertCircle ...>`)
- Itinerary/inclusion `idx`/`i` keys (index-based — unstable)
- `PackageCard` JSX (lines 161–230) is a large anonymous JSX block — should be a named component

**Decision:** `featured-packages.tsx` is a **legacy component** that should be fully deprecated in
favour of `_containers/featured-packages-container.tsx`. If nothing else imports it,
delete it. If it IS still imported somewhere, create a `<PackageCard>` component and strip the
data-fetching / carousel logic (which lives in the container).

**New file structure:**

```
src/app/(main)/_components/
├── _package-card/
│   ├── package-card.tsx          (≤80L — pure presentational card, accepts PackageDTO prop)
│   └── package-inclusions.tsx    (≤30L — inclusions list with Check icons)
```

**Phase 2-D steps:**

1. **Audit imports** — find every file that imports `FeaturedPackages` from `featured-packages.tsx`

2. **If zero imports:** delete `featured-packages.tsx` (container already replaces it)

3. **If imports exist:** extract `<PackageCard>` to `_package-card/package-card.tsx`
   - Props: `package: PackageDTO`, `isSaved?: boolean`, `isAuthenticated?: boolean`, `onView: () => void`
   - Purely presentational — no hooks, no router
   - Fix: `priority` only on first card (prop `isPriority?: boolean`)
   - Fix: stable keys for itineraries and inclusions

4. **Extract `<PackageInclusions>` to `_package-card/package-inclusions.tsx`**
   - Props: `inclusions: PackageDTO['inclusions']`
   - Renders the "What's Included" list

5. **Remove `featured-packages.tsx`** (or shrink to ≤80L orchestrator that uses `<PackageCard>`)

---

## Cross-Cutting Fixes (All Phases)

| Issue                                     | Fix                                               | Applies To                          |
| ----------------------------------------- | ------------------------------------------------- | ----------------------------------- |
| Index-based keys (`key={index}`)          | Use stable identifiers (`slug`, `iataCode`, `id`) | featured-packages, navbar, about-us |
| `React.ReactNode` (namespace)             | Use `type ReactNode` named import                 | about-us-section line 376           |
| Inline JSX in module-scope constants      | Use `iconName: string` + icon map in component    | about-us-section SERVICES/STATS     |
| Hard-coded brand hex values               | Move to CSS vars or Tailwind design tokens        | about-us-section                    |
| Missing `aria-label` on icon buttons      | Add `aria-label` to all icon-only buttons         | navbar notification bell            |
| Commented-out JSX                         | Delete it                                         | featured-packages line 180          |
| `React` namespace import (`import React`) | Named imports only                                | navbar line 5                       |

---

## Execution Order

| Phase | Component               | Priority   | Reason                                              |
| ----- | ----------------------- | ---------- | --------------------------------------------------- |
| 2-A   | `book-flight-form.tsx`  | **HIGH**   | Most lines, most duplication, hooks missing         |
| 2-C   | `navbar.tsx`            | **HIGH**   | 304L, 3 distinct regions clearly needing extraction |
| 2-B   | `about-us-section.tsx`  | **MEDIUM** | 430L but sub-components already exist in-file       |
| 2-D   | `featured-packages.tsx` | **LOW**    | Deprecation candidate (container already exists)    |

---

## Verification Per Phase

For each phase:

1. `npx tsc --noEmit` → 0 errors
2. Dev server compiles without error
3. Visually confirm UI unchanged at `localhost:3000`
4. Run ESLint: `npx eslint src/app/\(main\)/ --max-warnings=0`
