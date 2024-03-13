import UserPasswordManagement from "./AccountSettings/PasswordManagement/UserPasswordManagement"
import LinkedLoginMethods from "./AccountSettings/OAuthProviders/LinkedLoginMethods"
import React from "react"
import Spacer from "Components/UI/Spacer"
import UserAccountDeletion from "./AccountSettings/AccountDeletion/UserAccountDeletion"

const AccountSettings = () => {
  return (
    <div className="d-flex flex-col">
      <LinkedLoginMethods />
      <Spacer space={3.0} unit="rem" isVertical />
      <UserPasswordManagement />
      <Spacer space={3.0} unit="rem" isVertical />
      <UserAccountDeletion />
    </div>
  )
}
export default AccountSettings
