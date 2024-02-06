import React from "react"
import Spacer from "Components/Spacer"
import InputField from "Components/InputField"

interface Props {
  onEmailChange?: (value: string) => void // Callback function when email value changes
  onPasswordChange?: (value: string) => void // Callback function when password value changes
}

/**
 * AuthForm Component
 *
 * Renders a form with fields for email and password input.
 * This component is typically used for authentication purposes (login, registration).
 *
 * Props:
 * - onEmailChange: Optional callback invoked when the email field value changes.
 * - onPasswordChange: Optional callback invoked when the password field value changes.
 */
const AuthForm = ({ onEmailChange, onPasswordChange }: Props) => {
  return (
    <>
      <form className="w-100">
        <InputField
          type="email"
          placeholder={Translate("EMAIL")}
          autocomplete="email"
          onValueChange={onEmailChange}
        />
        <Spacer space={1.5} unit="rem" isVertical />
        <InputField
          type="password"
          placeholder={Translate("PASSWORD")}
          hideable
          isVisible={false}
          autocomplete="current-password"
          onValueChange={onPasswordChange}
        />
      </form>
      <Spacer space={1.5} unit="rem" isVertical />
    </>
  )
}
export default AuthForm
