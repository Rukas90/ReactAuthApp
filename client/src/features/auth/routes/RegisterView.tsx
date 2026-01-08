import HorizontalLineLabel from "#ui/labels/HorizontalLineLabel"
import Captcha from "#ui/common/Captcha"
import AuthView from "./AuthView"
import HeaderText from "#ui/texts/HeaderText"
import SocialLoginButtons from "#auth/components/SocialLoginButtons"
import { useTranslation } from "react-i18next"
import useRegisterForm from "#features/auth/hooks/useRegisterForm"
import RegisterForm from "#auth/components/RegisterForm"
import PlainText from "#ui/texts/PlainText"
import LinkText from "#ui/texts/LinkText"

const RegisterView = () => {
  const { t } = useTranslation()
  const form = useRegisterForm()

  return (
    <AuthView error={form.error}>
      <HeaderText>{t("REGISTER")}</HeaderText>
      <PlainText>
        Already have an account? <LinkText href="/login">Login</LinkText>
      </PlainText>
      <SocialLoginButtons />
      <HorizontalLineLabel className="py-4">{t("OR")}</HorizontalLineLabel>
      <RegisterForm onSubmit={form.onSubmit} fieldErrors={form.fieldErrors} />
      <Captcha setToken={form.setCaptchaToken} />
    </AuthView>
  )
}
export default RegisterView
