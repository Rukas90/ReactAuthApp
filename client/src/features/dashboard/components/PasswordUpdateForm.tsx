import { InputField } from "@features/shared"
import PasswordForm, { type PasswordFormProps } from "./PasswordForm"
import { useTranslation } from "react-i18next"
import { usePasswordForm } from "../hooks/usePasswordForm"
import { PasswordUpdateSchema } from "@project/shared"
import UserService from "../services/UserService"
import { toast } from "react-toastify"

const PasswordUpdateForm = ({ onSuccess }: PasswordFormProps) => {
  const { handleSubmit, isSubmitting, fieldErrors, error } = usePasswordForm({
    schema: PasswordUpdateSchema,
    requestFn: UserService.updatePassword,
    onSuccess: () => {
      toast("Password updated successfully!")
      onSuccess?.()
    },
  })
  const { t } = useTranslation()
  return (
    <PasswordForm
      submitBtnText={t("UPDATE_PASSWORD")}
      onSubmit={handleSubmit}
      disabled={isSubmitting}
      error={error}
    >
      <InputField
        id="current_password"
        name="currentPassword"
        hideable
        isHidden
        expandable={false}
        className="w-full"
        placeholder={"Current Password"}
        variant="mini"
        indicateError={!!fieldErrors.currentPassword}
      />
      <InputField
        id="password"
        name="password"
        hideable
        isHidden
        expandable={false}
        className="w-full"
        placeholder={"Enter new Password"}
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
        placeholder={"Confirm new Password"}
        variant="mini"
        indicateError={!!fieldErrors.confirmPassword}
      />
    </PasswordForm>
  )
}
export default PasswordUpdateForm
