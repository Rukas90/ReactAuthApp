import CustomButton from "Components/Buttons/CustomButton"
import InputField from "Components/UI/InputField"
import React, { useState } from "react"
import PasswordValidationGroup from "../../../Templates/PasswordValidationGroup"
import Spacer from "../../../UI/Spacer"
import { PasswordManagementProps } from "./UserPasswordManagement"
import FoldableContent from "../../../Templates/FoldableContent"

interface Props extends PasswordManagementProps {
  primaryFieldPlaceholder?: string
  secondaryFieldPlaceholder?: string
  buttonLabel?: string
  validator: (
    primaryValue: string,
    secondaryValue: string
  ) => Promise<boolean> | boolean
  onSubmit: (password: string) => void
}

const PasswordUpdateForm = ({
  primaryFieldPlaceholder = "Enter Password",
  secondaryFieldPlaceholder = "Enter Password",
  buttonLabel = "Submit",
  validator,
  onSubmit,
  args,
  notifications,
}: Props) => {
  const [primaryValue, setPrimaryValue] = useState("")
  const [secondaryValue, setSecondaryValue] = useState("")
  const [passwordStatus, setPasswordStatus] = useState(false)

  const handleSubmit = async () => {
    if (!passwordStatus) {
      notifications.error(
        "The password value does not meet the required criteria!"
      )
      args.SetPrimaryIndicator(true)
      return
    }
    args.SetPrimaryIndicator(false)
    if (!(await validator(primaryValue, secondaryValue))) {
      return
    }
    onSubmit(primaryValue)
  }
  return (
    <div className="animate-slide-down">
      <div className="d-flex flex-col flex-md-row gap-3 justify-content-start">
        <InputField
          extendWidth
          placeholder={primaryFieldPlaceholder}
          type="password"
          autocomplete="current-password"
          hideable
          onValueChange={setPrimaryValue}
          indicateError={args.GetPrimaryIndicator()}
        />
        <InputField
          extendWidth
          placeholder={secondaryFieldPlaceholder}
          type="password"
          autocomplete="current-password"
          hideable
          onValueChange={setSecondaryValue}
          indicateError={args.GetSecondaryIndicator()}
        />
      </div>

      <FoldableContent
        show={primaryValue !== ""}
        node={
          <>
            <Spacer space={1.0} unit="rem" isVertical />
            <PasswordValidationGroup
              password={primaryValue}
              onValidationStatusChange={setPasswordStatus}
            />
          </>
        }
      />

      <div className="d-flex justify-content-center justify-content-md-end">
        <CustomButton
          extendWidth
          text={buttonLabel}
          classes="mt-3"
          style="dark"
          action={handleSubmit}
        />
      </div>
    </div>
  )
}
export default PasswordUpdateForm
