import { RegisterForm } from "@auth/components"
import SocialLoginButtons from "@auth/components/SocialLoginButtons"
import { useRegisterForm } from "@auth/hooks"
import Captcha from "@shared/ui/common/Captcha"
import HorizontalLineLabel from "@shared/ui/labels/HorizontalLineLabel"
import HeaderText from "@shared/ui/texts/HeaderText"
import LinkText from "@shared/ui/texts/LinkText"
import PlainText from "@shared/ui/texts/PlainText"
import { useTranslation } from "react-i18next"
import AuthView from "./AuthView"

const RegisterView = () => {
  const { t } = useTranslation()
  const form = useRegisterForm()

  return (
    <AuthView error={form.error}>
      <HeaderText>{t("REGISTER")}</HeaderText>
      <PlainText>
        Already have an account? <LinkText to="/login">Login</LinkText>
      </PlainText>
      <SocialLoginButtons />
      <HorizontalLineLabel className="py-4">{t("OR")}</HorizontalLineLabel>
      <RegisterForm onSubmit={form.onSubmit} fieldErrors={form.fieldErrors} />
      <Captcha setToken={form.setCaptchaToken} />
    </AuthView>
  )
}
export default RegisterView
