import React from "react"
import PasswordUpdateManagement from "./PasswordUpdateManagement"
import { PasswordManagementProps } from "./UserPasswordManagement"
import { useCsrfToken } from "Contexts/CsrfContext"
import { ValidatePassword } from "Utils/Account"

const UserPasswordUpdater = ({
  args,
  notifications,
}: PasswordManagementProps) => {
  const { fetchCsrfToken } = useCsrfToken()

  const validate = async (
    _: string,
    currentPassword: string
  ): Promise<boolean> => {
    try {
      const response = await ValidatePassword(
        currentPassword,
        await fetchCsrfToken()
      )
      if (response.data.status) {
        args.SetSecondaryIndicator(false)
        return true
      }
      args.SetSecondaryIndicator(true)
      notifications.error(response.error || "Failed to verify password!")
      return false
    } catch (error) {
      return false
    }
  }
  return (
    <PasswordUpdateManagement
      operationKey="UpdatePassword"
      primaryFieldPlaceholder="New Password"
      secondaryFieldPlaceholder="Current Password"
      onFieldValidation={validate}
      buttonLabel="Update Password"
      args={args}
      notifications={notifications}
    />
  )
}
export default UserPasswordUpdater
