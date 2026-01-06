import type { GeneralProps, ReactChildrenProps } from "#types/ui.types"
import styles from "./Text.module.css"

interface Props extends ReactChildrenProps, GeneralProps {}

const PlainText = ({ children, className, id, style }: Props) => {
  return (
    <p id={id} className={`${className} ${styles.plain_text}`} style={style}>
      {children}
    </p>
  )
}
export default PlainText
