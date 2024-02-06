import React, { useState } from "react"
import FormHeader from "Templates/FormHeader"
import Spacer from "Components/Spacer"
import CustomButton from "Components/Buttons/CustomButton"
import AuthSocialButtons from "Templates/AuthSocialButtons"
import AuthForm from "Templates/AuthForm"
import { Login } from "Utils/Auth"
import { broadcast } from "Contexts/MessageContext"
import { useCsrfToken } from "Contexts/CsrfContext"

/**
 * LoginForm Component
 *
 * A login interface providing multiple authentication options.
 * Includes social media logins, a standard form for credentials, and language switching capabilities.
 */
const LoginForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

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
      csrfToken: await fetchCsrfToken(true),
    })
    if (response.success) {
      window.location.href = response.data.redirectUrl
    }
    if (response.error) {
      broadcastMessage(response.error)
    }
  }
  return (
    <div>
      <FormHeader
        header={Translate("LOGIN")}
        secondary={Translate("DONT_HAVE_AN_ACCOUNT")}
        linkText={Translate("REGISTER")}
        linkHref="/register"
      />
      <div className="form-container w-100 mt-4 d-flex justify-content-center">
        <div className="w-100 d-flex justify-content-center align-items-center vstack">
          <AuthSocialButtons />
          <AuthForm onEmailChange={setEmail} onPasswordChange={setPassword} />
          <span>
            <a href="#" className="link-light fw-light">
              {Translate("FORGOT_THE_PASSWORD?")}
            </a>
          </span>
          <Spacer space={1.5} unit="rem" isVertical />
          <CustomButton
            text={Translate("LOG_IN")}
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
