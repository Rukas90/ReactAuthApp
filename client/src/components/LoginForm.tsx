import React from "react"
import FormHeader from "../templates/FormHeader"
import Spacer from "../templates/Spacer"
import CustomButton from "./CustomButton"
import AuthSocialButtons from "../templates/AuthSocialButtons"
import AuthForm from "../templates/AuthForm"
import { useTranslation } from "react-i18next"
import LanguageSwitcher from "./LanguageSwitcher"

/**
 * LoginForm Component
 *
 * A login interface providing multiple authentication options.
 * Includes social media logins, a standard form for credentials, and language switching capabilities.
 */
const LoginForm = () => {
  const { t } = useTranslation()

  return (
    <>
      <FormHeader
        header={t("LOGIN")}
        secondary={t("DONT_HAVE_AN_ACCOUNT")}
        linkText={t("REGISTER")}
        linkHref="/register"
      />
      <div className="form-container w-100 mt-4 d-flex justify-content-center">
        <div className="auth-form-container w-100 d-flex justify-content-center align-items-center vstack">
          <AuthSocialButtons />
          <AuthForm />
          <span>
            <a href="#" className="link-light fw-light">
              {t("FORGOT_THE_PASSWORD?")}
            </a>
          </span>
          <Spacer space={1.5} unit="rem" isVertical />
          <CustomButton text={t("LOG_IN")} icon="" link="#" extendWidth />
          <LanguageSwitcher />
        </div>
      </div>
    </>
  )
}

export default LoginForm
