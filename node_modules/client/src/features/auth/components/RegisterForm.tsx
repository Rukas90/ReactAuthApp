import { InputField } from "@features/shared"
import { useTranslation } from "react-i18next"
import AuthForm from "./AuthForm"

interface Props {
  onSubmit: (form: FormData) => void
  fieldErrors: Set<string>
}
const RegisterForm = ({ onSubmit, fieldErrors }: Props) => {
  const { t } = useTranslation()

  return (
    <AuthForm onSubmit={onSubmit} submitText={t("REGISTER")}>
      <InputField
        id="email"
        name="email"
        type="email"
        placeholder={t("EMAIL")}
        autocomplete="off"
        extendWidth
        indicateError={fieldErrors.has("email")}
      />
      <InputField
        id="password"
        name="password"
        type="text"
        placeholder={t("PASSWORD")}
        autocomplete="off"
        extendWidth
        hideable
        isHidden
        indicateError={fieldErrors.has("password")}
      />
      <InputField
        id="confirm_Password"
        name="confirmPassword"
        type="text"
        placeholder={t("CONFIRM_PASSWORD")}
        autocomplete="off"
        extendWidth
        hideable
        isHidden
        indicateError={fieldErrors.has("confirm_Password")}
      />
    </AuthForm>
  )
}
export default RegisterForm
