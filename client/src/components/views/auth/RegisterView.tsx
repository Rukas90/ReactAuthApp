import HorizontalLineLabel from "#labels/HorizontalLineLabel"
import Captcha from "#common/Captcha"
import AuthView from "./AuthView"
import HeaderText from "#texts/HeaderText"
import SocialLoginButtons from "./SocialLoginButtons"
import { useTranslation } from "react-i18next"
import useRegister from "#hooks/useRegister"
import RegisterForm from "./RegisterForm"
import PlainText from "#texts/PlainText"
import LinkText from "#texts/LinkText"

const RegisterView = () => {
  const { t } = useTranslation()
  const login = useRegister()

  return (
    <AuthView error={login.error}>
      <HeaderText>{t("REGISTER")}</HeaderText>
      <PlainText>
        Already have an account? <LinkText href="/login">Login</LinkText>
      </PlainText>
      <SocialLoginButtons />
      <HorizontalLineLabel className="py-4">{t("OR")}</HorizontalLineLabel>
      <RegisterForm onSubmit={login.onSubmit} fieldErrors={login.fieldErrors} />
      <Captcha setToken={login.setCaptchaToken} />
    </AuthView>
  )
}
export default RegisterView
