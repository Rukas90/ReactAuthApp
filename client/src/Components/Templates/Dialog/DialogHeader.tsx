import { DialogProps } from "Components/Props/DialogProps"
import React from "react"

const DialogHeader = ({
  title = "Untitled",
  onCancelCallback,
}: DialogProps) => {
  return (
    <div className="p-4 d-flex gap-4 flex-row justify-content-between align-items-center overlay-light">
      <h5 className="text-light m-0 overflow-hidden">{Translate(title)}</h5>
      <button
        type="button"
        className="dot-close-btn"
        onClick={onCancelCallback}
      ></button>
    </div>
  )
}
export default DialogHeader
