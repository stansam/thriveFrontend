# MODALS.md — Modal, Dialog & Overlay Patterns

[[SKILLS.md]](./SKILLS.md) | **You are here: Modals**

---

## Modal Architecture Philosophy

1. **Modals are lazy-loaded** — never in initial bundle
2. **State lives in the parent** — modal components are controlled via props
3. **One modal manager** — global modal state via Zustand for triggered modals
4. **Focus trapping** — Radix Dialog handles it; always use it as base
5. **Mobile-aware** — modals become bottom sheets on mobile

---

## Base Modal (wraps Radix Dialog)

```tsx
// components/ui/Modal/Modal.tsx

import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  hideCloseButton?: boolean
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  full: 'max-w-screen-lg',
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  hideCloseButton = false,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            {/* Backdrop */}
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>

            {/* Content — desktop: centered, mobile: bottom sheet */}
            <Dialog.Content asChild>
              <motion.div
                className={cn(
                  'fixed z-50 w-full bg-bg-base shadow-xl',
                  // Desktop: centered dialog
                  'md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2',
                  'md:rounded-xl md:border md:border-border-default',
                  sizeClasses[size],
                  // Mobile: bottom sheet
                  'bottom-0 left-0 right-0 rounded-t-2xl md:bottom-auto md:left-auto md:right-auto md:rounded-xl'
                )}
                initial={{ opacity: 0, y: '100%', scale: 1 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] },
                }}
                exit={{
                  opacity: 0,
                  y: '100%',
                  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
                }}
                // Desktop override
                style={{
                  // Override y animation on desktop
                }}
              >
                {/* Drag handle (mobile only) */}
                <div className="mx-auto mb-4 mt-3 h-1 w-10 rounded-full bg-border-strong md:hidden" aria-hidden />

                {/* Header */}
                {(title || !hideCloseButton) && (
                  <div className="flex items-start justify-between px-6 pb-4 pt-2 md:pt-6">
                    <div>
                      {title && (
                        <Dialog.Title className="text-base font-semibold text-text-primary">
                          {title}
                        </Dialog.Title>
                      )}
                      {description && (
                        <Dialog.Description className="mt-1 text-sm text-text-secondary">
                          {description}
                        </Dialog.Description>
                      )}
                    </div>
                    {!hideCloseButton && (
                      <Dialog.Close asChild>
                        <button
                          className="rounded-lg p-1 text-text-tertiary hover:bg-bg-muted hover:text-text-primary transition-colors"
                          aria-label="Close dialog"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </Dialog.Close>
                    )}
                  </div>
                )}

                {/* Body */}
                <div className="px-6 pb-6">
                  {children}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
```

---

## Confirm Dialog Pattern

```tsx
// components/common/ConfirmDialog/ConfirmDialog.tsx

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'info'
  isLoading?: boolean
}

export function ConfirmDialog({
  open, onClose, onConfirm,
  title, description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} description={description} size="sm">
      <div className="mt-4 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          {cancelLabel}
        </Button>
        <Button
          variant={variant === 'danger' ? 'danger' : 'primary'}
          onClick={onConfirm}
          loading={isLoading}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}

// Usage:
// const [deleteId, setDeleteId] = useState<string | null>(null)
// <ConfirmDialog
//   open={!!deleteId}
//   onClose={() => setDeleteId(null)}
//   onConfirm={() => deleteUser.mutate(deleteId!)}
//   title="Delete user"
//   description="This action cannot be undone."
//   isLoading={deleteUser.isPending}
// />
```

---

## Global Modal Manager (for toast-like programmatic modals)

```ts
// stores/modal.store.ts

import { create } from 'zustand'

interface ConfirmOptions {
  title: string
  description: string
  confirmLabel?: string
  variant?: 'danger' | 'warning'
  onConfirm: () => void | Promise<void>
}

interface ModalStore {
  confirmOptions: ConfirmOptions | null
  openConfirm: (options: ConfirmOptions) => void
  closeConfirm: () => void
}

export const useModalStore = create<ModalStore>((set) => ({
  confirmOptions: null,
  openConfirm: (options) => set({ confirmOptions: options }),
  closeConfirm: () => set({ confirmOptions: null }),
}))

// lib/modal.ts — imperative API
export function confirm(options: ConfirmOptions) {
  useModalStore.getState().openConfirm(options)
}

// Usage anywhere in the app:
// confirm({
//   title: 'Delete project',
//   description: 'All data will be permanently deleted.',
//   onConfirm: () => deleteProject.mutate(id),
// })
```

```tsx
// Add GlobalModals to root layout
export function GlobalModals() {
  const { confirmOptions, closeConfirm } = useModalStore()
  const [isLoading, setIsLoading] = useState(false)

  async function handleConfirm() {
    if (!confirmOptions) return
    setIsLoading(true)
    try {
      await confirmOptions.onConfirm()
    } finally {
      setIsLoading(false)
      closeConfirm()
    }
  }

  return (
    <ConfirmDialog
      open={!!confirmOptions}
      onClose={closeConfirm}
      onConfirm={handleConfirm}
      title={confirmOptions?.title ?? ''}
      description={confirmOptions?.description ?? ''}
      confirmLabel={confirmOptions?.confirmLabel}
      variant={confirmOptions?.variant}
      isLoading={isLoading}
    />
  )
}
```

---

## Drawer / Side Panel

```tsx
// components/ui/Drawer/Drawer.tsx

import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: string
  side?: 'left' | 'right'
  width?: string
  children: React.ReactNode
}

export function Drawer({ open, onClose, title, side = 'right', width = '400px', children }: DrawerProps) {
  const xFrom = side === 'right' ? '100%' : '-100%'

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-black/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                className={`fixed top-0 z-50 flex h-full flex-col bg-bg-base shadow-xl ${side === 'right' ? 'right-0' : 'left-0'}`}
                style={{ width }}
                initial={{ x: xFrom }}
                animate={{ x: 0 }}
                exit={{ x: xFrom }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              >
                <div className="flex items-center justify-between border-b border-border-default px-6 py-4">
                  {title && (
                    <Dialog.Title className="text-base font-semibold text-text-primary">
                      {title}
                    </Dialog.Title>
                  )}
                  <Dialog.Close asChild>
                    <button className="rounded-lg p-1 text-text-tertiary hover:bg-bg-muted">
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
```
