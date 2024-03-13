import React, { RefObject } from "react"
import Spacer from "Components/UI/Spacer"
import InputField from "Components/UI/InputField"

interface Props {
  emailRef?: RefObject<HTMLInputElement>
  passwordRef?: RefObject<HTMLInputElement>
  onEmailChange?: (newValue: string) => void
  onPasswordChange?: (newValue: string) => void
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
const AuthForm = ({
  emailRef,
  passwordRef,
  onEmailChange,
  onPasswordChange,
}: Props) => {
  return (
    <>
      <form className="w-100">
        <InputField
          type="email"
          placeholder={Translate("EMAIL")}
          autocomplete="email"
          ref={emailRef}
          onValueChange={onEmailChange}
        />
        <Spacer space={1.5} unit="rem" isVertical />
        <InputField
          type="password"
          placeholder={Translate("PASSWORD")}
          hideable
          isVisible={false}
          autocomplete="current-password"
          ref={passwordRef}
          onValueChange={onPasswordChange}
        />
      </form>
      <Spacer space={1.5} unit="rem" isVertical />
    </>
  )
}
export default AuthForm
