import Background from "@auth/components/Background"
import { styles } from "@auth/styles"
import MessageBox from "@shared/ui/common/MessageBox"
import type { ReactNode } from "react"

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
