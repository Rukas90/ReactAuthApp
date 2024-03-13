import React, { useState } from "react"
import PasswordUpdateForm from "./PasswordUpdateForm"
import PasswordUpdateVerification from "./PasswordUpdateVerification"
import { SendVerificationCode } from "Utils/Auth"
import { useCsrfToken } from "Contexts/CsrfContext"
import { SetUserPassword } from "Utils/Account"
import { PasswordManagementProps } from "./UserPasswordManagement"

interface Props extends PasswordManagementProps {
  operationKey: string
  primaryFieldPlaceholder?: string
  secondaryFieldPlaceholder?: string
  buttonLabel?: string
  onFieldValidation: (
    primaryValue: string,
    secondaryValue: string
  ) => Promise<boolean> | boolean
}

const PasswordUpdateManagement = ({
  operationKey,
  primaryFieldPlaceholder = "Current Password",
  secondaryFieldPlaceholder = "New Password",
  buttonLabel = "Change Password",
  onFieldValidation,
  args,
  notifications,
}: Props) => {
  const [password, setPassword] = useState<string | null>(null)
  const [time, setTime] = useState<Date>(new Date())
  const { fetchCsrfToken } = useCsrfToken()

  const onSubmitPassword = async (password: string) => {
    try {
      await SendVerificationCode(operationKey, await fetchCsrfToken())

      setTime(new Date())
      setPassword(password)
    } catch (error) {
      notifications.error("Internal server error! Please try again.")
      console.error(error)
    }
  }

  const onCodeVerified = async () => {
    if (!password) {
      notifications.error("Something went wrong. Please try again.")
      return
    }
    try {
      const response = await SetUserPassword(password, await fetchCsrfToken())

      if (!response.success) {
        notifications.error(response.error)
        return
      }
      notifications.success("PASSWORD_CHANGE_SUCCESS_NOTIFICATION")
    } catch (error) {
      notifications.error((error as Error).message)
    } finally {
      setPassword(null)
    }
  }

  const onOperationCanceled = async () => {
    setPassword(null)
  }

  return !password ? (
    <PasswordUpdateForm
      primaryFieldPlaceholder={primaryFieldPlaceholder}
      secondaryFieldPlaceholder={secondaryFieldPlaceholder}
      buttonLabel={buttonLabel}
      validator={onFieldValidation}
      onSubmit={onSubmitPassword}
      args={args}
      notifications={notifications}
    />
  ) : (
    <PasswordUpdateVerification
      operationKey={operationKey}
      verificationStartTime={time}
      onCodeVerified={onCodeVerified}
      onOperationCanceled={onOperationCanceled}
      args={args}
      notifications={notifications}
    />
  )
}
export default PasswordUpdateManagement
