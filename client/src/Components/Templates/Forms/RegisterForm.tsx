import React, { useMemo, useRef, useState } from "react"
import FormHeader from "Templates/FormHeader"
import CustomButton from "Components/Buttons/CustomButton"
import AuthSocialButtons from "Templates/AuthSocialButtons"
import AuthForm from "Components/Templates/Forms/AuthForm"
import { IsValidEmail } from "Utils/Utilities"
import { useNavigate } from "react-router-dom"
import PasswordValidationGroup from "Templates/PasswordValidationGroup"
import { Register } from "Utils/Auth"
import { broadcast } from "Contexts/MessageContext"
import Spacer from "Components/UI/Spacer"
import { useCsrfToken } from "Contexts/CsrfContext"

/**
 * RegisterForm Component
 *
 * Renders a registration form with various authentication methods and password validation.
 */
const RegisterForm = () => {
  const emailRef = useRef<HTMLInputElement>(null)
  const [password, setPassword] = useState<string>("")
  const [passwordState, setPasswordState] = useState(false)

  const { fetchCsrfToken } = useCsrfToken()

  const navigate = useNavigate()
  const { broadcastMessage: broadcastMessage } = broadcast()

  const RegisterSubmit = async () => {
    if (!emailRef.current) {
      return
    }
    const email = emailRef.current.value

    if (!email) {
      broadcastMessage("Please enter the email")
      return
    }
    if (!IsValidEmail(email)) {
      broadcastMessage("Email is invalid")
      return
    }
    if (!passwordState) {
      broadcastMessage("Password does not meet the required criteria")
      return
    }
    const response = await Register({
      email: email,
      password: password,
      csrfToken: await fetchCsrfToken(true),
    })
    if (response.success) {
      navigate("/verify")
    }
  }

  return (
    <div>
      <FormHeader
        header={Translate("REGISTER")}
        secondary={Translate("ALREADY_HAVE_AN_ACCOUNT?")}
        linkText={Translate("LOG_IN")}
        linkHref="/login"
      />
      <div className="form-container w-100 mt-4 d-flex justify-content-center">
        <div className="auth-form-container w-100 d-flex justify-content-center align-items-center vstack">
          <AuthSocialButtons prompt />
          <AuthForm emailRef={emailRef} onPasswordChange={setPassword} />
          <PasswordValidationGroup
            password={password}
            onValidationStatusChange={setPasswordState}
          />
          <Spacer space={1.5} unit="rem" isVertical />
          <CustomButton
            text={Translate("CONTINUE")}
            icon=""
            action={RegisterSubmit}
            extendWidth
          />
          <Spacer space={1.5} unit="rem" isVertical />
        </div>
      </div>
    </div>
  )
}

export default RegisterForm
