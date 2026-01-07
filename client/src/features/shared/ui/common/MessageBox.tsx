import type { ReactChildrenProps } from "#types/ui.types"
import styles from "./Common.module.css"
import errorIcon from "#icons/misc/error.svg"

interface Props extends ReactChildrenProps {
  isHidden?: boolean
}
const MessageBox = ({ isHidden = true, children }: Props) => {
  return (
    <div
      className={`${styles.message_box} ${
        isHidden && styles.message_box_hidden
      }`}
    >
      <img className={styles.message_box_icon} src={errorIcon}></img>
      <p>{children}</p>
    </div>
  )
}
export default MessageBox
