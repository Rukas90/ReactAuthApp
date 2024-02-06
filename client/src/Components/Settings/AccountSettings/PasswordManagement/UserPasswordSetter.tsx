import React from "react"
import { PasswordManagementProps } from "./UserPasswordManagement"
import PasswordUpdateManagement from "./PasswordUpdateManagement"

const UserPasswordSetter = ({
  args,
  notifications,
}: PasswordManagementProps) => {
  const validateFields = (
    password: string,
    repeatPassword: string
  ): boolean => {
    if (!password || !repeatPassword) {
      notifications.error("Please enter the password!")

      args.SetPrimaryIndicator(!password)
      args.SetPrimaryIndicator(!repeatPassword)

      return false
    }
    if (password !== repeatPassword) {
      notifications.error("Passwords are not matching!")
      args.SetPrimaryIndicator(true)
      return false
    }
    args.Reset()
    return true
  }
  return (
    <PasswordUpdateManagement
      operationKey="SetPassword"
      primaryFieldPlaceholder="Enter Password"
      secondaryFieldPlaceholder="Repeat Password"
      onFieldValidation={validateFields}
      buttonLabel="Set Password"
      args={args}
      notifications={notifications}
    />
  )
}
export default UserPasswordSetter
