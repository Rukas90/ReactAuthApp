import React, { useState, useContext } from "react"
import FormHeader from "../templates/FormHeader"
import Spacer from "../templates/Spacer"
import CustomButton from "./CustomButton"
import AuthSocialButtons from "../templates/AuthSocialButtons"
import AuthForm from "../templates/AuthForm"
import { useTranslation } from "react-i18next"
import { Login } from "../utils/Auth"
import { useNavigate } from "react-router-dom"
import { broadcast } from "../contexts/MessageContext"
import { useCsrfToken } from "../contexts/CsrfContext"

/**
 * LoginForm Component
 *
 * A login interface providing multiple authentication options.
 * Includes social media logins, a standard form for credentials, and language switching capabilities.
 */
const LoginForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { t } = useTranslation()
  const navigate = useNavigate()
  const { broadcastMessage: broadcastMessage } = broadcast()

  const { fetchCsrfToken } = useCsrfToken()

  const HandleLogin = async () => {
    if (!email || !password) {
      broadcastMessage("Please fill in the login details")
      return
    }
    const response = await Login({
      email: email,
      password: password,
      token: await fetchCsrfToken(),
    })
    if (response.success) {
      await fetchCsrfToken(true) // Refresh the token from the server

      navigate("/")
    }
  }

  return (
    <div>
      <FormHeader
        header={t("LOGIN")}
        secondary={t("DONT_HAVE_AN_ACCOUNT")}
        linkText={t("REGISTER")}
        linkHref="/register"
      />
      <div className="form-container w-100 mt-4 d-flex justify-content-center">
        <div className="w-100 d-flex justify-content-center align-items-center vstack">
          <AuthSocialButtons />
          <AuthForm onEmailChange={setEmail} onPasswordChange={setPassword} />
          <span>
            <a href="#" className="link-light fw-light">
              {t("FORGOT_THE_PASSWORD?")}
            </a>
          </span>
          <Spacer space={1.5} unit="rem" isVertical />
          <CustomButton
            text={t("LOG_IN")}
            icon=""
            action={HandleLogin}
            extendWidth
          />
          <Spacer space={1.5} unit="rem" isVertical />
        </div>
      </div>
    </div>
  )
}

export default LoginForm
