import HorizontalLineLabel from "#ui/labels/HorizontalLineLabel"
import Captcha from "#ui/common/Captcha"
import AuthView from "./AuthView"
import HeaderText from "#ui/texts/HeaderText"
import SocialLoginButtons from "#auth/components/SocialLoginButtons"
import { useTranslation } from "react-i18next"
import useLoginForm from "#features/auth/hooks/useLoginForm"
import LoginForm from "#auth/components/LoginForm"
import PlainText from "#ui/texts/PlainText"
import LinkText from "#ui/texts/LinkText"

const LoginView = () => {
  const { t } = useTranslation()
  const form = useLoginForm()

  return (
    <AuthView error={form.error}>
      <HeaderText>{t("LOGIN")}</HeaderText>
      <PlainText>
        Don't have an account? <LinkText href="/register">Register</LinkText>
      </PlainText>
      <SocialLoginButtons />
      <HorizontalLineLabel className="py-4">{t("OR")}</HorizontalLineLabel>
      <LoginForm onSubmit={form.onSubmit} fieldErrors={form.fieldErrors} />
      <Captcha setToken={form.setCaptchaToken} />
    </AuthView>
  )
}
export default LoginView
