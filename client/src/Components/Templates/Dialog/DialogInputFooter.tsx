import InputField from "Components/UI/InputField"
import { DialogProps } from "Components/Props/DialogProps"
import React from "react"
import DialogButton from "./DialogButton"
import { useMediaQuery } from "react-responsive"

interface DialogInputFooterProps extends DialogProps {
  onInputChanged?: (value: string) => void
}

const DialogInputFooter = ({
  confirmLabel,
  onConfirmCallback,
  confirmColor = "primary",
  onInputChanged,
}: DialogInputFooterProps) => {
  const isSm = useMediaQuery({ query: "(max-width: 575px)" })

  return (
    <div className="modal-footer gap-sm-0 gap-3 d-flex p-4 flex-sm-row flex-col flex-nowrap">
      <InputField
        roundness={`rounded-pill${isSm ? "" : "-left"}`}
        placeholder="Enter"
        preservePlaceholder={false}
        extendWidth
        onValueChange={onInputChanged}
      />
      <DialogButton
        label={confirmLabel || "Confirm"}
        callback={onConfirmCallback}
        isLeft={false}
        color={confirmColor}
        connected={!isSm}
        className={`${isSm && "w-100"}`}
      />
    </div>
  )
}
export default DialogInputFooter
