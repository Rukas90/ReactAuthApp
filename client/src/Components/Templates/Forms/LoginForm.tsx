import React, { useEffect, useRef, useState } from "react"
import FormHeader from "Templates/FormHeader"
import Spacer from "Components/UI/Spacer"
import CustomButton from "Components/Buttons/CustomButton"
import AuthSocialButtons from "Templates/AuthSocialButtons"
import AuthForm from "Components/Templates/Forms/AuthForm"
import { Login } from "Utils/Auth"
import { broadcast } from "Contexts/MessageContext"
import Captcha from "../Captcha"
import { useNavigate } from "react-router-dom"

/**
 * LoginForm Component
 *
 * A login interface providing multiple authentication options.
 * Includes social media logins, a standard form for credentials, and language switching capabilities.
 */
const LoginForm = () => {
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const { broadcastMessage: broadcastMessage } = broadcast()
  const [hCaptchaToken, setHCaptchaToken] = useState<string | null>(null)

  const HandleLogin = async () => {
    if (!emailRef.current || !passwordRef.current) {
      return
    }
    const email = emailRef.current.value
    const password = passwordRef.current.value

    if (!email || !password) {
      broadcastMessage("Please fill in the login details")
      return
    }
    if (!hCaptchaToken) {
      broadcastMessage("Please complete the hCaptcha")
      return
    }
    const response = await Login({
      email: email,
      password: password,
      hcaptchaToken: hCaptchaToken,
    })
    if (response.success) {
      navigate(response.data.redirect)
    } else {
      broadcastMessage(response.error ?? "Failed to login! Try again.")
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
          <AuthForm emailRef={emailRef} passwordRef={passwordRef} />
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
          <Captcha setToken={setHCaptchaToken} />
          <Spacer space={1.0} unit="rem" isVertical />
        </div>
      </div>
    </div>
  )
}

export default LoginForm
