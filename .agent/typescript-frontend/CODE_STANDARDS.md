# CODE_STANDARDS.md — Code Standards & ESLint

[[SKILLS.md]](./SKILLS.md) | **You are here: Code Standards**

---

## ESLint Configuration

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/strict-type-checked"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/consistent-type-imports": ["error", { "prefer": "type-imports" }],
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "import/order": ["error", { "groups": ["builtin","external","internal","parent","sibling","index"], "newlines-between": "always" }],
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

## Prettier

```json
{ "semi": false, "singleQuote": true, "tabWidth": 2, "trailingComma": "es5", "printWidth": 100, "plugins": ["prettier-plugin-tailwindcss"] }
```

## Forbidden Patterns

```ts
// ❌ FORBIDDEN
const x: any = value
// @ts-ignore
export default function() {}   // anonymous exports

// ✅ REQUIRED
const x: SpecificType = value
// @ts-expect-error: [reason]
export default function NamedPage() {}
export function NamedComponent() {}
```

## cn() Utility

```ts
// lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Import Order (enforced)

1. React / Next.js
2. Third-party libraries  
3. `@/types`
4. `@/lib`, `@/config`
5. `@/services`, `@/stores`
6. `@/hooks`
7. `@/containers`
8. `@/components`
9. Relative (max 1 level up)
10. Style imports

Always use `import type` for type-only imports.
