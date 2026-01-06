import type { ReactChildrenProps } from "src/types/ui.types"
import styles from "./Auth.module.css"

const Background = ({ children }: ReactChildrenProps) => {
  return <div className={styles.background}>{children}</div>
}
export default Background
