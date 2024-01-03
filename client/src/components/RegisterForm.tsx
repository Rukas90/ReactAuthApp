import React, { useState } from "react"
import FormHeader from "../templates/FormHeader"
import CustomButton from "./CustomButton"
import AuthSocialButtons from "../templates/AuthSocialButtons"
import AuthForm from "../templates/AuthForm"
import ValidationGroup from "./ValidationGroup"
import { useTranslation } from "react-i18next"

const RegisterForm = () => {
  const minPasswordLength = 12
  const [password, setPassword] = useState("")
  const [passwordState, setPasswordState] = useState(false)
  const { t } = useTranslation()

  return (
    <>
      <FormHeader
        header={t("REGISTER")}
        secondary={t("ALREADY_HAVE_AN_ACCOUNT?")}
        linkText={t("LOG_IN")}
        linkHref="/login"
      />
      <div className="form-container w-100 mt-4 d-flex justify-content-center">
        <div className="auth-form-container w-100 d-flex justify-content-center align-items-center vstack">
          <AuthSocialButtons />
          <AuthForm onPasswordChange={setPassword} />
          <ValidationGroup<string>
            value={password}
            conditions={[
              {
                evaluateFunc: (password) => /[a-z]/.test(password),
                conditionText: t("PASSWORD_LOWERCASE_CONDITION"),
              },
              {
                evaluateFunc: (password) => /[A-Z]/.test(password),
                conditionText: t("PASSWORD_UPPERCASE_CONDITION"),
              },
              {
                evaluateFunc: (password) => /[0-9]/.test(password),
                conditionText: t("PASSWORD_NUMBER_CONDITION"),
              },
              {
                evaluateFunc: (password) => /[^A-Za-z0-9]/.test(password),
                conditionText: t("PASSWORD_SPECIAL_CHARACTER_CONDITION"),
              },
              {
                evaluateFunc: (password) =>
                  password.length >= minPasswordLength,
                conditionText: t("PASSWORD_MINIMUM_CHARACTER_CONDITION", {
                  count: minPasswordLength,
                }),
              },
            ]}
            onValidationStatusChange={setPasswordState}
          />
          <CustomButton text={t("CONTINUE")} icon="" link="#" extendWidth />
        </div>
      </div>
    </>
  )
}

export default RegisterForm
