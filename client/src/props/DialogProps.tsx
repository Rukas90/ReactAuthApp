export interface DialogProps {
  title: string
  message: string
  showCancelBtn?: boolean
  confirmLabel?: string
  cancelLabel?: string
  onConfirmCallback?: () => void
  onCancelCallback?: () => void
}
