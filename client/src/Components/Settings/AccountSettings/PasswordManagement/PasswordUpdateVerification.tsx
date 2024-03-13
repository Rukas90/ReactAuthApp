import CustomButton from "Components/Buttons/CustomButton"
import Countdown from "Components/UI/Countdown"
import InputField from "Components/UI/InputField"
import Message from "Components/UI/Message"
import { useCsrfToken } from "Contexts/CsrfContext"
import { useDialog } from "Contexts/DialogContext"
import { CancelVerification, CheckVerificationCode } from "Utils/Auth"
import React, { useState } from "react"
import { PasswordManagementProps } from "./UserPasswordManagement"

interface Props extends PasswordManagementProps {
  operationKey: string
  verificationStartTime: Date
  onCodeVerified: () => void
  onOperationCanceled: () => void
}

const PasswordUpdateVerification = ({
  operationKey,
  verificationStartTime,
  onCodeVerified,
  onOperationCanceled,
  args,
  notifications,
}: Props) => {
  const [code, setCode] = useState("")
  const { fetchCsrfToken } = useCsrfToken()
  const { showDialog } = useDialog()

  const verifyCode = async () => {
    if (!code) {
      notifications.error("Please enter the verification code!")
      return
    }
    const response = await CheckVerificationCode(
      operationKey,
      code,
      await fetchCsrfToken()
    )
    if (!response.success) {
      notifications.error(response.error)
      return
    }
    args.Reset()
    onCodeVerified()
  }
  const cancelOperation = async () => {
    await CancelVerification(operationKey, await fetchCsrfToken())

    setCode("")
    onOperationCanceled()
  }

  return (
    <div className="d-flex flex-col gap-3">
      <div className="d-flex flex-col flex-md-row gap-3">
        <InputField
          placeholder="Verification Code"
          extendWidth
          hideable
          type="password"
          onValueChange={setCode}
        />
        <CustomButton text="Verify" style="dark" action={verifyCode} />
      </div>
      <Message
        header="Action verification step"
        content="The verification code was sent to your account email address. Please find the code and use it to verify this operation."
      />
      <div className="d-flex w-100 justify-content-end">
        <Countdown
          prefixLabel="Confim action in"
          timeInMilliseconds={300000}
          originTime={verificationStartTime}
          onCountdownFinish={() => console.log("Finished")}
        />
        <CustomButton
          style="danger"
          text="Cancel Operation"
          action={() =>
            showDialog({
              title: Localized("CANCEL_OPERATION"),
              message: Localized("CANCEL_PASSWORD_OPERATION_DIALOG_MESSAGE"),
              onConfirmCallback: cancelOperation,
            })
          }
        />
      </div>
    </div>
  )
}
export default PasswordUpdateVerification
