import { ConfirmButton, ErrorBox } from "@features/shared"
import type { FormEvent } from "react"

export interface PasswordFormProps {
  onSuccess: () => void
}
interface Props extends Pick<React.ComponentProps<"div">, "children"> {
  submitBtnText: string
  onSubmit: (form: FormEvent<HTMLFormElement>) => void
  error: string | null
  disabled: boolean
}
const PasswordForm = ({
  children,
  submitBtnText,
  onSubmit,
  error,
  disabled,
}: Props) => {
  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      {children}
      <ConfirmButton
        type="submit"
        text={submitBtnText}
        className="w-fit text-sm"
        disabled={disabled}
      />
      <ErrorBox isHidden={!error}>{error}</ErrorBox>
    </form>
  )
}
export default PasswordForm
