import Background from "#auth/components/Background"
import type { ReactNode } from "react"
import styles from "#auth/styles/Auth.module.css"
import MessageBox from "#ui/common/MessageBox"

interface Props {
  children?: ReactNode
  error?: string | null
}
const AuthView = ({ children, error }: Props) => {
  return (
    <Background>
      <div className={`${styles.field_container}`}>
        <div className={styles.field_container__content}>
          {children}
          <MessageBox isHidden={!error}>{error}</MessageBox>
        </div>
      </div>
    </Background>
  )
}
export default AuthView
