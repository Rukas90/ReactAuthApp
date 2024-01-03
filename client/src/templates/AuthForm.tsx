import React from "react"
import Spacer from "./Spacer"
import InputField from "../components/InputField"

interface Props {
  onEmailChange?: (value: string) => void
  onPasswordChange?: (value: string) => void
}

const AuthForm = ({ onEmailChange, onPasswordChange }: Props) => {
  return (
    <>
      <form className="w-100">
        <InputField
          type="email"
          placeholder="Email"
          autocomplete="email"
          onValueChange={onEmailChange}
        />
        <Spacer space={1.5} unit="rem" isVertical />
        <InputField
          type="password"
          placeholder="Password"
          hideable
          isVisible={false}
          onValueChange={onPasswordChange}
        />
      </form>
      <Spacer space={1.5} unit="rem" isVertical />
    </>
  )
}
export default AuthForm
