import Background from "./Background"
import type { ReactNode } from "react"
import styles from "./Auth.module.css"
import MessageBox from "#common/MessageBox"

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
