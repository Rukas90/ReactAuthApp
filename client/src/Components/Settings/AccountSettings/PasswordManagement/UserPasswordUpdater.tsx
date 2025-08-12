import React from "react"
import PasswordUpdateManagement from "./PasswordUpdateManagement"
import { PasswordManagementProps } from "./UserPasswordManagement"
import { ValidatePassword } from "Utils/Account"

const UserPasswordUpdater = ({
  args,
  notifications,
}: PasswordManagementProps) => {
  const validate = async (
    _: string,
    currentPassword: string
  ): Promise<boolean> => {
    try {
      const response = await ValidatePassword(currentPassword)
      if (response.success && response.data.status) {
        args.SetSecondaryIndicator(false)
        return true
      }
      args.SetSecondaryIndicator(true)

      if (!response.success) {
        notifications.error(response.error || "Failed to verify password!")
      }
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
