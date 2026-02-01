import { InputField } from "@features/shared"
import PasswordForm, { type PasswordFormProps } from "./PasswordForm"
import { useTranslation } from "react-i18next"
import { usePasswordForm } from "../hooks/usePasswordForm"
import { PasswordSetSchema } from "@project/shared"
import UserService from "../services/UserService"
import { toast } from "react-toastify"

const PasswordSetForm = ({ onSuccess }: PasswordFormProps) => {
  const { handleSubmit, isSubmitting, fieldErrors, error } = usePasswordForm({
    schema: PasswordSetSchema,
    requestFn: UserService.setPassword,
    onSuccess: () => {
      toast("Password set successfully!")
      onSuccess?.()
    },
  })
  const { t } = useTranslation()
  return (
    <PasswordForm
      submitBtnText={t("SET_PASSWORD")}
      onSubmit={handleSubmit}
      disabled={isSubmitting}
      error={error}
    >
      <InputField
        id="password"
        name="password"
        hideable
        isHidden
        expandable={false}
        className="w-full"
        placeholder={"Enter Password"}
        variant="mini"
        indicateError={!!fieldErrors.password}
      />
      <InputField
        id="confirm_password"
        name="confirmPassword"
        hideable
        isHidden
        expandable={false}
        className="w-full"
        placeholder={"Confirm Password"}
        variant="mini"
        indicateError={!!fieldErrors.confirmPassword}
      />
    </PasswordForm>
  )
}
export default PasswordSetForm
