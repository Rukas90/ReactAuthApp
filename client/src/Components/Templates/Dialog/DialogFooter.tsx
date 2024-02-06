import { DialogProps } from "Components/Props/DialogProps"
import React from "react"
import DialogButton from "./DialogButton"
import { useMediaQuery } from "react-responsive"

const DialogFooter = ({
  cancelLabel,
  confirmLabel,
  showCancelBtn,
  onCancelCallback,
  onConfirmCallback,
  cancelColor = "secondary",
  confirmColor = "primary",
}: DialogProps) => {
  const isSm = useMediaQuery({ query: "(max-width: 575px)" })

  if (isSm) {
    showCancelBtn = false
  }

  return (
    <div className="modal-footer gap-0 gap-md-3 d-flex justify-content-sm-between justify-content-center p-4">
      {showCancelBtn && (
        <DialogButton
          label={cancelLabel || "Cancel"}
          callback={onCancelCallback}
          isLeft
          color={cancelColor}
          connected={isSm}
        />
      )}
      <DialogButton
        label={confirmLabel || "Confirm"}
        callback={onConfirmCallback}
        isLeft={false}
        color={confirmColor}
        connected={false}
        className={isSm ? "w-100" : ""}
      />
    </div>
  )
}
export default DialogFooter
