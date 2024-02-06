import React, { useState } from "react"
import { DialogProps } from "Components/Props/DialogProps"
import DialogHeader from "./DialogHeader"
import DialogFooter from "./DialogFooter"
import DialogInputFooter from "./DialogInputFooter"

const DialogNode = ({
  id,
  title,
  message = "",
  body = null,
  showCancelBtn = true,
  requiresInputField = false,
  confirmLabel,
  cancelLabel,
  confirmColor,
  cancelColor,
  onConfirmCallback,
  onCancelCallback,
  onBeforeConfirm,
}: { id: string } & DialogProps) => {
  const [input, setInput] = useState<string | undefined>(undefined)
  const T = Translate

  const handleConfirm = () => {
    if (onBeforeConfirm && !onBeforeConfirm(input)) {
      return
    }
    if (onConfirmCallback) {
      onConfirmCallback()
    }
  }
  return (
    <div
      className={`overlay position-absolute top-0 left-0 d-flex flex-grow-1 w-100 h-100`}
      id={id}
    >
      <div className="d-flex position-relative w-100 h-100 justify-content-center align-items-end align-items-md-center p-md-4 p-0">
        <div
          className={`dialog-body drop-shadow position-relative backdrop-blur-high overflow-hidden animate-pop-in rounded-3`}
        >
          <DialogHeader title={title} onCancelCallback={onCancelCallback} />
          <div className="dialog-content text-secondary p-4">
            <p className="overflow-hidden m-0">
              {body !== null ? body : T(message)}
            </p>
          </div>
          {requiresInputField ? (
            <DialogInputFooter
              confirmLabel={confirmLabel}
              onConfirmCallback={handleConfirm}
              confirmColor={confirmColor}
              onInputChanged={setInput}
            />
          ) : (
            <DialogFooter
              showCancelBtn={showCancelBtn}
              confirmLabel={confirmLabel}
              cancelLabel={cancelLabel}
              confirmColor={confirmColor}
              cancelColor={cancelColor}
              onConfirmCallback={handleConfirm}
              onCancelCallback={onCancelCallback}
            />
          )}
        </div>
      </div>
    </div>
  )
}
export default DialogNode
