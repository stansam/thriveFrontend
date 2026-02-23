# FEATURE_BUILD.md — Step-by-Step Feature Build Guide

[[SKILLS.md]](./SKILLS.md) | **You are here: Feature Build**

> This is the **agent execution playbook**. When asked to build any feature — a page, a CRUD section, a form, a data view — follow these steps in order without skipping.

---

## The 10-Step Feature Build Process

### Feature Scope Definition (Mental Model First)

Before writing a single line, answer:
1. What does the user **see**?
2. What does the user **do**?
3. What **data** is needed and from where?
4. What **mutations** can the user perform?
5. What are the **loading / empty / error** states?
6. Does this feature exist on **mobile** differently?
7. What **permissions** gate this feature?

---

### Step 1 — Define Types & Schemas

File: `types/<feature>.types.ts`

```ts
// Always start here. Everything else derives from types.
import { z } from 'zod'

export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().nullable(),
  status: z.enum(['active', 'archived', 'draft']),
  ownerId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const CreateProjectSchema = ProjectSchema.pick({
  name: true, description: true, status: true,
})

export const UpdateProjectSchema = CreateProjectSchema.partial()

export const ProjectListParamsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  perPage: z.coerce.number().min(1).max(100).default(20),
  search: z.string().default(''),
  status: z.enum(['active', 'archived', 'draft']).optional(),
})

export type Project = z.infer<typeof ProjectSchema>
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>
export type ProjectListParams = z.infer<typeof ProjectListParamsSchema>
```

---

### Step 2 — Add Query Keys

File: `config/query-keys.ts` — add entries:

```ts
projects: {
  all: () => ['projects'] as const,
  list: (params: ProjectListParams) => ['projects', 'list', params] as const,
  detail: (id: string) => ['projects', 'detail', id] as const,
},
```

---

### Step 3 — Build the Service

File: `services/project.service.ts`

```ts
import { apiClient } from './api.client'
import { ProjectSchema, ProjectListParamsSchema } from '@/types/project.types'
import { z } from 'zod'
import { ok, fail } from '@/lib/service-result'
import { API_ROUTES } from '@/config/routes'

const ProjectListResponseSchema = z.object({
  items: z.array(ProjectSchema),
  pagination: z.object({
    page: z.number(), perPage: z.number(), total: z.number(),
  }),
})

export const projectService = {
  async getList(params: ProjectListParams) {
    try {
      const res = await apiClient.get(API_ROUTES.projects.list, { params })
      const parsed = ProjectListResponseSchema.safeParse(res.data?.data)
      if (!parsed.success) return fail('Invalid project list data')
      return ok(parsed.data)
    } catch (err) { return fail(extractErrorMessage(err)) }
  },

  async getById(id: string) {
    try {
      const res = await apiClient.get(API_ROUTES.projects.detail(id))
      const parsed = ProjectSchema.safeParse(res.data?.data)
      if (!parsed.success) return fail('Invalid project data')
      return ok(parsed.data)
    } catch (err) { return fail(extractErrorMessage(err)) }
  },

  async create(input: CreateProjectInput) {
    try {
      const res = await apiClient.post(API_ROUTES.projects.list, input)
      const parsed = ProjectSchema.safeParse(res.data?.data)
      if (!parsed.success) return fail('Invalid response')
      return ok(parsed.data)
    } catch (err) { return fail(extractErrorMessage(err)) }
  },

  async update(id: string, input: UpdateProjectInput) {
    try {
      const res = await apiClient.patch(API_ROUTES.projects.detail(id), input)
      const parsed = ProjectSchema.safeParse(res.data?.data)
      if (!parsed.success) return fail('Invalid response')
      return ok(parsed.data)
    } catch (err) { return fail(extractErrorMessage(err)) }
  },

  async delete(id: string) {
    try {
      await apiClient.delete(API_ROUTES.projects.detail(id))
      return ok(undefined)
    } catch (err) { return fail(extractErrorMessage(err)) }
  },
}
```

---

### Step 4 — Build Data Hooks

File: `hooks/data/useProjectList.ts`, `useCreateProject.ts`, etc.

```ts
// hooks/data/useProjectList.ts
export function useProjectList(initial?: Partial<ProjectListParams>) {
  const [params, setParams] = useState<ProjectListParams>({
    page: 1, perPage: 20, search: '', ...initial,
  })

  const query = useQuery({
    queryKey: queryKeys.projects.list(params),
    queryFn: async () => {
      const result = await projectService.getList(params)
      if (!result.ok) throw new Error(result.error)
      return result.data
    },
    placeholderData: (prev) => prev,
  })

  return {
    ...query,
    params,
    setPage: (page: number) => setParams(p => ({ ...p, page })),
    setSearch: (search: string) => setParams(p => ({ ...p, page: 1, search })),
    setStatus: (status?: ProjectStatus) => setParams(p => ({ ...p, page: 1, status })),
  }
}

// hooks/data/useCreateProject.ts
export function useCreateProject() {
  const qc = useQueryClient()
  const { success, error } = useToast()

  return useMutation({
    mutationFn: async (input: CreateProjectInput) => {
      const result = await projectService.create(input)
      if (!result.ok) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.projects.all() })
      success({ title: 'Project created' })
    },
    onError: (err) => error({ title: 'Failed to create project', description: err.message }),
  })
}
```

---

### Step 5 — Build the Container

File: `containers/ProjectListContainer.tsx`

```tsx
'use client'

export function ProjectListContainer() {
  const list = useProjectList()
  const createProject = useCreateProject()
  const deleteProject = useDeleteProject()
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)

  if (list.isLoading) return <ProjectListSkeleton />
  if (list.isError) return <ErrorState message={list.error?.message} onRetry={list.refetch} />

  return (
    <>
      <PageHeader
        title="Projects"
        description="Manage your projects"
        action={
          <Button onClick={() => setCreateOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
            New project
          </Button>
        }
      />

      <ProjectListView
        projects={list.data?.items ?? []}
        pagination={list.data?.pagination}
        params={list.params}
        onPageChange={list.setPage}
        onSearchChange={list.setSearch}
        onDelete={setDeleteTarget}
      />

      {/* Modals */}
      <CreateProjectModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={createProject.mutate}
        isSubmitting={createProject.isPending}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteProject.mutate(deleteTarget!.id)}
        title={`Delete "${deleteTarget?.name}"?`}
        description="This project and all its data will be permanently deleted."
        isLoading={deleteProject.isPending}
      />
    </>
  )
}
```

---

### Step 6 — Build Presentational Components

Files: `components/features/projects/ProjectListView/`, `ProjectCard/`, etc.

Rules:
- Accept all data as props
- Emit all actions as typed callback props  
- Handle mobile layout if UX differs (see MOBILE.md)
- Implement skeleton counterparts (see UI_UX.md)

---

### Step 7 — Build Forms

Files: `components/features/projects/CreateProjectForm/`

Follow FORMS.md exactly:
- Zod schema first (reuse from types file)
- `useForm` + `zodResolver`
- All four states: idle, submitting, success, error
- `FormField` wrapper for every input

---

### Step 8 — Add Route & Page

Files: `app/(dashboard)/projects/page.tsx`

```tsx
// page.tsx — thin shell only
import { ProjectListContainer } from '@/containers/ProjectListContainer'
import { PageTransition } from '@/components/common/PageTransition'

export const metadata = { title: 'Projects — MyApp' }

export default function ProjectsPage() {
  return (
    <PageTransition>
      <ProjectListContainer />
    </PageTransition>
  )
}
```

Add to route constants: `config/routes.ts`

---

### Step 9 — Add to Navigation

Update `components/common/Sidebar/Sidebar.tsx` NAV_ITEMS and `MobileBottomNav` if it's a primary destination.

---

### Step 10 — Write Tests

Priority order:
1. **Service tests** — test ok/fail paths against MSW handlers
2. **Container tests** — test loading/error/empty/populated states
3. **Form tests** — test validation, submission, server errors
4. **E2E test** — happy path + key error path

See TESTING.md for patterns.

---

## Feature Checklist

Before marking a feature complete, verify:

```
Types
  [ ] Zod schemas defined for all data shapes
  [ ] TypeScript types inferred (not duplicated)
  [ ] Request/response schemas cover API contract

Service
  [ ] All CRUD operations implemented
  [ ] Runtime Zod validation on responses
  [ ] ServiceResult return type (ok/fail)
  [ ] Error messages are user-friendly strings

Hooks
  [ ] Query hooks with correct staleTime
  [ ] Mutation hooks with cache invalidation
  [ ] Loading/error/empty states surfaced

Container
  [ ] Uses only hooks (no direct service calls)
  [ ] Handles loading/error/empty explicitly
  [ ] Passes only needed props to views
  [ ] Auth-gated if required

Components
  [ ] No data fetching (pure props)
  [ ] Skeleton component matches real layout
  [ ] Mobile layout handled (or confirmed same)
  [ ] All interactive elements keyboard-accessible
  [ ] ARIA labels on icon buttons
  [ ] Empty state designed (not "No data" text)

Forms
  [ ] Zod validation with user-friendly messages
  [ ] Server errors displayed
  [ ] Submit disabled when invalid or loading
  [ ] All four states: idle/loading/success/error

Security
  [ ] Route protected by middleware + AuthGuard
  [ ] Permission check if role-restricted
  [ ] No sensitive data in client state

Tests
  [ ] Service: ok and fail paths
  [ ] Component: renders/interactions
  [ ] E2E: happy path

Navigation
  [ ] Page title set via metadata
  [ ] Breadcrumbs added if nested
  [ ] Added to sidebar/nav if primary destination
```
