import { toaster } from '@/shared/ui/toaster'

/** Copies text; the confirmation toast shows only when the browser allowed it (like live). */
export const copyText = (text: string, toastTitle: string) => {
  navigator.clipboard
    ?.writeText(text)
    .then(() => toaster.create({ type: 'success', title: toastTitle, duration: 2000 }))
    .catch(() => {})
}
