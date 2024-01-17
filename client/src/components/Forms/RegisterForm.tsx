import React, { useState, useContext } from "react"
import FormHeader from "../Templates/FormHeader"
import CustomButton from "../Buttons/CustomButton"
import AuthSocialButtons from "../Templates/AuthSocialButtons"
import AuthForm from "../Templates/AuthForm"
import { useTranslation } from "react-i18next"
import { IsValidEmail } from "../../utils/Utilities"
import { useNavigate } from "react-router-dom"
import PasswordValidationGroup from "../Templates/PasswordValidationGroup"
import { Register } from "../../utils/Auth"
import { broadcast } from "../../contexts/MessageContext"
import Spacer from "../Templates/Spacer"
import { useCsrfToken } from "../../contexts/CsrfContext"

/**
 * RegisterForm Component
 *
 * Renders a registration form with various authentication methods and password validation.
 */
const RegisterForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordState, setPasswordState] = useState(false)

  const { fetchCsrfToken } = useCsrfToken()

  const { t } = useTranslation()
  const navigate = useNavigate()
  const { broadcastMessage: broadcastMessage } = broadcast()

  const RegisterSubmit = async () => {
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
      csrfToken: await fetchCsrfToken(),
    })
    if (response.success) {
      navigate("/verify")
    }
  }
  return (
    <div>
      <FormHeader
        header={t("REGISTER")}
        secondary={t("ALREADY_HAVE_AN_ACCOUNT?")}
        linkText={t("LOG_IN")}
        linkHref="/login"
      />
      <div className="form-container w-100 mt-4 d-flex justify-content-center">
        <div className="auth-form-container w-100 d-flex justify-content-center align-items-center vstack">
          <AuthSocialButtons prompt />
          <AuthForm onEmailChange={setEmail} onPasswordChange={setPassword} />
          <PasswordValidationGroup
            password={password}
            onValidationStatusChange={setPasswordState}
          />
          <CustomButton
            text={t("CONTINUE")}
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
