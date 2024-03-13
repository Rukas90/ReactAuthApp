import { ColorOption } from "Data/ColorOption"
import { ReactNode } from "react"

export interface DialogProps {
  title?: LocalizableText
  message?: LocalizableText
  body?: ReactNode
  showCancelBtn?: boolean
  requiresInputField?: boolean
  confirmLabel?: LocalizableText
  cancelLabel?: LocalizableText
  confirmColor?: ColorOption
  cancelColor?: ColorOption
  onConfirmCallback?: () => void
  onCancelCallback?: () => void
  onBeforeConfirm?: (input?: string) => boolean
}
