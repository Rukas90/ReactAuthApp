import HorizontalLineLabel from "#labels/HorizontalLineLabel"
import Captcha from "#common/Captcha"
import AuthView from "./AuthView"
import HeaderText from "#texts/HeaderText"
import SocialLoginButtons from "./SocialLoginButtons"
import { useTranslation } from "react-i18next"
import useLogin from "#hooks/useLogin"
import LoginForm from "./LoginForm"
import PlainText from "#texts/PlainText"
import LinkText from "#texts/LinkText"

const LoginView = () => {
  const { t } = useTranslation()
  const login = useLogin()

  return (
    <AuthView error={login.error}>
      <HeaderText>{t("LOGIN")}</HeaderText>
      <PlainText>
        Don't have an account? <LinkText href="/register">Register</LinkText>
      </PlainText>
      <SocialLoginButtons />
      <HorizontalLineLabel className="py-4">{t("OR")}</HorizontalLineLabel>
      <LoginForm onSubmit={login.onSubmit} fieldErrors={login.fieldErrors} />
      <Captcha setToken={login.setCaptchaToken} />
    </AuthView>
  )
}
export default LoginView
