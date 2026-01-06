import CustomButton from "#buttons/CustomButton"
import styles from "./Auth.module.css"
import type { FormEvent } from "react"
import type { ReactChildrenProps } from "#types/ui.types"

interface Props extends ReactChildrenProps {
  onSubmit: (form: FormData) => void
  submitText: string
}
const AuthForm = ({ onSubmit, children, submitText }: Props) => {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (onSubmit) {
      onSubmit(new FormData(event.currentTarget))
    }
  }
  return (
    <form onSubmit={handleSubmit} className={styles.auth_form}>
      {children}
      <CustomButton
        type="submit"
        text={submitText}
        extendWidth
        className="mb-2"
      />
    </form>
  )
}
export default AuthForm
