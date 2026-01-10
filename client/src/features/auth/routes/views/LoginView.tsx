import { LoginForm } from "@auth/components"
import SocialLoginButtons from "@auth/components/SocialLoginButtons"
import { useLoginForm } from "@auth/hooks"
import Captcha from "@shared/ui/common/Captcha"
import HorizontalLineLabel from "@shared/ui/labels/HorizontalLineLabel"
import HeaderText from "@shared/ui/texts/HeaderText"
import LinkText from "@shared/ui/texts/LinkText"
import PlainText from "@shared/ui/texts/PlainText"
import { useTranslation } from "react-i18next"
import AuthView from "./AuthView"

const LoginView = () => {
  const { t } = useTranslation()
  const form = useLoginForm()

  return (
    <AuthView error={form.error}>
      <HeaderText>{t("LOGIN")}</HeaderText>
      <PlainText>
        Don't have an account? <LinkText to="/register">Register</LinkText>
      </PlainText>
      <SocialLoginButtons />
      <HorizontalLineLabel className="py-4">{t("OR")}</HorizontalLineLabel>
      <LoginForm onSubmit={form.onSubmit} fieldErrors={form.fieldErrors} />
      <Captcha setToken={form.setCaptchaToken} />
    </AuthView>
  )
}
export default LoginView
