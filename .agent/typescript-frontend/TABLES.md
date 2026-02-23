# TABLES.md — Data Tables, Sorting, Filtering & Pagination

[[SKILLS.md]](./SKILLS.md) | **You are here: Tables**

---

## Table Architecture

For data tables, use **TanStack Table v8** — fully typed, headless, composable.

```
useDataTable (hook)
    ├── useReactTable (TanStack)
    ├── column definitions (typed)
    └── DataTable component (renders)
```

---

## Column Definition Pattern

```tsx
// components/features/users/UserTable/columns.tsx

import type { ColumnDef } from '@tanstack/react-table'
import type { User } from '@/types/user.types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'
import { MoreHorizontal, ArrowUpDown } from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

interface ColumnActions {
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

export function getUserColumns({ onEdit, onDelete }: ColumnActions): ColumnDef<User>[] {
  return [
    // Checkbox select column
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          aria-label="Select all"
          className="rounded"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          aria-label={`Select ${row.original.name}`}
          className="rounded"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      size: 48,
      enableSorting: false,
    },

    // Name with avatar
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 text-xs font-medium text-text-secondary hover:text-text-primary"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="h-3 w-3" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-600">
            {row.original.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">{row.original.name}</p>
            <p className="text-xs text-text-tertiary">{row.original.email}</p>
          </div>
        </div>
      ),
    },

    // Role badge
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const roleColors = {
          admin: 'bg-error-50 text-error-600',
          user: 'bg-brand-50 text-brand-600',
          viewer: 'bg-neutral-100 text-neutral-600',
        } as const
        return (
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${roleColors[row.original.role]}`}>
            {row.original.role}
          </span>
        )
      },
      filterFn: (row, columnId, filterValues: string[]) =>
        filterValues.length === 0 || filterValues.includes(row.getValue(columnId)),
    },

    // Date
    {
      accessorKey: 'createdAt',
      header: 'Joined',
      cell: ({ row }) => (
        <span className="text-sm text-text-secondary">
          {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(
            new Date(row.original.createdAt)
          )}
        </span>
      ),
    },

    // Actions
    {
      id: 'actions',
      size: 48,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Row actions">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(row.original)}>Edit</DropdownMenuItem>
            <DropdownMenuItem
              className="text-error-600"
              onClick={() => onDelete(row.original)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
}
```

---

## DataTable Component

```tsx
// components/ui/DataTable/DataTable.tsx

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface DataTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData>[]
  onRowClick?: (row: TData) => void
  isLoading?: boolean
  emptyMessage?: string
}

export function DataTable<TData>({
  data,
  columns,
  onRowClick,
  isLoading,
  emptyMessage = 'No results found.',
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const table = useReactTable({
    data,
    columns,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  if (isLoading) return <TableSkeleton columns={columns.length} rows={5} />

  return (
    <div className="overflow-hidden rounded-xl border border-border-default bg-bg-base">
      <div className="overflow-x-auto">
        <table className="w-full text-sm" role="grid">
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id} className="border-b border-border-default bg-bg-subtle">
                {hg.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-medium text-text-tertiary"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-sm text-text-tertiary"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className={cn(
                    'border-b border-border-default last:border-0 transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-bg-subtle',
                    row.getIsSelected() && 'bg-brand-50 dark:bg-brand-900/10'
                  )}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

---

## Pagination Component

```tsx
// components/ui/Pagination/Pagination.tsx

interface PaginationProps {
  page: number
  perPage: number
  total: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, perPage, total, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(total / perPage)
  const from = (page - 1) * perPage + 1
  const to = Math.min(page * perPage, total)

  return (
    <div className="flex items-center justify-between px-4 py-3 text-sm">
      <p className="text-text-secondary">
        Showing <span className="font-medium text-text-primary">{from}–{to}</span> of{' '}
        <span className="font-medium text-text-primary">{total}</span>
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          ← Prev
        </Button>

        {/* Page numbers */}
        {getPageNumbers(page, totalPages).map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-text-tertiary">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={cn(
                'h-8 w-8 rounded-lg text-sm font-medium transition-colors',
                page === p
                  ? 'bg-brand-500 text-white'
                  : 'text-text-secondary hover:bg-bg-muted'
              )}
              aria-label={`Page ${p}`}
              aria-current={page === p ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          Next →
        </Button>
      </div>
    </div>
  )
}

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 3) return [1, 2, 3, 4, '...', total]
  if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total]
  return [1, '...', current - 1, current, current + 1, '...', total]
}
```

---

## Table Skeleton

```tsx
function TableSkeleton({ columns, rows }: { columns: number; rows: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border-default bg-bg-base">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border-default bg-bg-subtle">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-4 py-3">
                <div className="h-3 w-20 rounded bg-bg-emphasis animate-skeleton" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r} className="border-b border-border-default">
              {Array.from({ length: columns }).map((_, c) => (
                <td key={c} className="px-4 py-3">
                  <div
                    className="h-4 rounded bg-bg-muted animate-skeleton"
                    style={{ width: `${60 + Math.random() * 40}%`, animationDelay: `${(r * columns + c) * 50}ms` }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```
