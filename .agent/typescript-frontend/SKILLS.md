# SKILLS.md — The Ultimate Next.js TypeScript Skill

> **Your Instruction**: This is your master reference. Before touching ANY file in a Next.js TypeScript project, read this file first, then follow the `[[REF]]` pointers to the relevant sub-skill. You are operating as a **senior frontend engineer** with architectural authority. Every decision you make must reflect production-grade quality, security, scalability, and exceptional UX.

---

## 📁 Skill Map

### Foundation

| File                                     | Domain                                                   |
| ---------------------------------------- | -------------------------------------------------------- |
| [ARCHITECTURE.md](./ARCHITECTURE.md)     | Project structure, folder layout, separation of concerns |
| [TYPESCRIPT.md](./TYPESCRIPT.md)         | Strict typing, schemas, Zod, interfaces, generics        |
| [NAMING.md](./NAMING.md)                 | File, variable, component, hook, type naming conventions |
| [CODE_STANDARDS.md](./CODE_STANDARDS.md) | ESLint, Prettier, import order, forbidden patterns       |
| [ENV_CONFIG.md](./ENV_CONFIG.md)         | Environment variables, runtime config, secrets           |
| [SECURITY.md](./SECURITY.md)             | XSS, CSRF, headers, env, input sanitization              |

### Data & Logic

| File                                     | Domain                                                  |
| ---------------------------------------- | ------------------------------------------------------- |
| [DATA_FLOW.md](./DATA_FLOW.md)           | Data containers, hooks, services, state, React Query    |
| [API_PROXY.md](./API_PROXY.md)           | Next.js API routes as proxy to Flask backend, auth flow |
| [AUTH.md](./AUTH.md)                     | Authentication, flask-login, session, protected routes  |
| [FORMS.md](./FORMS.md)                   | Form architecture, react-hook-form, Zod validation      |
| [ERROR_HANDLING.md](./ERROR_HANDLING.md) | Error boundaries, typed errors, toasts, logging         |

### UI & Components

| File                                   | Domain                                              |
| -------------------------------------- | --------------------------------------------------- |
| [COMPONENTS.md](./COMPONENTS.md)       | Component design, patterns, composition, props      |
| [APP_SHELL.md](./APP_SHELL.md)         | AppShell, Sidebar, Topbar, mobile nav, theme toggle |
| [UI_UX.md](./UI_UX.md)                 | Design system, theme, tokens, motion, accessibility |
| [MOBILE.md](./MOBILE.md)               | Mobile-first, separate mobile flows, touch patterns |
| [MODALS.md](./MODALS.md)               | Modals, dialogs, drawers, confirm dialogs           |
| [TABLES.md](./TABLES.md)               | Data tables, sorting, filtering, pagination         |
| [NOTIFICATIONS.md](./NOTIFICATIONS.md) | Toast, inline alerts, banners, notification center  |

### Build & Quality

| File                               | Domain                                                  |
| ---------------------------------- | ------------------------------------------------------- |
| [PERFORMANCE.md](./PERFORMANCE.md) | Code splitting, caching, image optimization, Web Vitals |
| [TESTING.md](./TESTING.md)         | Unit, integration, E2E testing standards                |
| [PATTERNS.md](./PATTERNS.md)       | Advanced patterns, anti-patterns, common recipes        |

### Execution Guides

| File                                   | Domain                                               |
| -------------------------------------- | ---------------------------------------------------- |
| [PROJECT_INIT.md](./PROJECT_INIT.md)   | Complete project initialization from zero to running |
| [FEATURE_BUILD.md](./FEATURE_BUILD.md) | Step-by-step playbook for building any new feature   |

---

## 🧠 Your Mental Model

When given any task (build, fix, modify, extend), you MUST execute this mental checklist:

### Step 1 — Classify the Task

```
Is this:
  A) A new project scaffold?        → Start with ARCHITECTURE.md
  B) A new feature/page?            → ARCHITECTURE → DATA_FLOW → COMPONENTS → UI_UX
  C) An API integration?            → API_PROXY → AUTH → DATA_FLOW
  D) A UI/UX change?                → UI_UX → COMPONENTS → MOBILE
  E) A bug fix?                     → ERROR_HANDLING → TYPESCRIPT → relevant domain
  F) Auth work?                     → AUTH → API_PROXY → SECURITY
  G) A form?                        → FORMS → TYPESCRIPT → COMPONENTS
  H) Performance work?              → PERFORMANCE → DATA_FLOW
  I) Test writing?                  → TESTING → relevant domain
```

### Step 2 — Enforce Non-Negotiables

Every output MUST satisfy ALL of the following:

- [ ] Strict TypeScript — no `any`, no implicit types, no type assertions without comment
- [ ] Zod schema defined for every data shape crossing a boundary (API in/out, forms, env)
- [ ] No business logic in components — components are pure UI + event delegation
- [ ] No direct `fetch` calls from components — always through service layer
- [ ] No secrets in client-side code — ever
- [ ] Every route/page has an auth guard if it requires authentication
- [ ] Mobile and desktop flows are handled (not just responsive CSS)
- [ ] Every async operation has loading, error, and empty states
- [ ] Accessibility: semantic HTML, ARIA where needed, keyboard navigable
- [ ] All colors/spacing/typography from design tokens only

### Step 3 — Output Quality Bar

Before outputting any code, ask:

- Would a senior engineer be proud to commit this?
- Is this the cleanest, most readable version of this code?
- Are edge cases handled?
- Is this consistent with the rest of the codebase patterns?

---

## 🏗️ Project Technology Stack

```
Framework:        Next.js 14+ (App Router)
Language:         TypeScript 5+ (strict mode)
Styling:          Tailwind CSS v3 + CSS Variables design tokens
UI Components:    shadcn/ui (customized) + Radix UI primitives
State:            Zustand (client global) + React Query (server state)
Forms:            React Hook Form + Zod resolvers
Schema/Validation:Zod
HTTP Client:      Axios (typed instances) via service layer
Auth:             Custom session via Next.js API proxy → Flask-Login
Animation:        Framer Motion
Testing:          Vitest + React Testing Library + Playwright (E2E)
Linting:          ESLint (strict) + Prettier
Git Hooks:        Husky + lint-staged
Package Manager:  pnpm
```

---

## 📐 Golden Rules (Never Violate)

1. **Components never call APIs** — they call hooks, hooks call services, services call the proxy
2. **Types live in `/types`** — never inline complex types in component files
3. **Zod schemas are the source of truth** — TypeScript types are inferred FROM Zod, not written separately
4. **One concern per file** — a file that validates AND transforms AND renders is a violation
5. **The proxy is the only exit** — all backend calls go through `/api/*` Next.js routes
6. **Mobile is a first-class citizen** — not an afterthought. Separate components where UX diverges
7. **Error states are features** — every loading/error/empty state is designed, not thrown together
8. **Tokens, not values** — never hardcode `#3b82f6` or `16px` — use design tokens
9. **Test the contract, not the implementation** — tests verify behavior, not internal details
10. **Security is architecture** — not a layer added on top

---

## 🚀 Quick-Start Your Commands

### "Build a new project from scratch"

→ **PROJECT_INIT.md** (full walkthrough) + ARCHITECTURE.md + AUTH.md + APP_SHELL.md

### "Add a new feature/page/CRUD section"

→ **FEATURE_BUILD.md** (step-by-step checklist) → TYPESCRIPT.md → DATA_FLOW.md → COMPONENTS.md

### "Add a form with validation"

→ FORMS.md → TYPESCRIPT.md → ERROR_HANDLING.md → NOTIFICATIONS.md

### "Add a data table with sorting/pagination"

→ TABLES.md → DATA_FLOW.md → TYPESCRIPT.md

### "Add a modal / confirm dialog"

→ MODALS.md → COMPONENTS.md → PATTERNS.md

### "Fix a bug"

→ ERROR_HANDLING.md → TYPESCRIPT.md → PATTERNS.md (anti-patterns section)

### "Optimize performance"

→ PERFORMANCE.md → DATA_FLOW.md → COMPONENTS.md

### "Add authentication / protect a route"

→ AUTH.md → API_PROXY.md → SECURITY.md → MIDDLEWARE (in ARCHITECTURE.md)

### "Improve mobile experience"

→ MOBILE.md → UI_UX.md → APP_SHELL.md

### "Add toast notifications / alerts"

→ NOTIFICATIONS.md → ERROR_HANDLING.md

### "Set up tests for a feature"

→ TESTING.md → PATTERNS.md (fixtures section)

### "Review code quality"

→ CODE_STANDARDS.md → PATTERNS.md (anti-patterns) → TYPESCRIPT.md
