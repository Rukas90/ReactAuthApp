import type { GeneralProps, ReactChildrenProps } from "#types/ui.types"
import styles from "./Label.module.css"

interface Props extends ReactChildrenProps, GeneralProps {}

const HorizontalLineLabel = ({ children, className }: Props) => {
  const line = (
    <div className={`flex-grow-1 w-100 ${styles.horizontal_label_line}`} />
  )
  return (
    <div
      className={`${className} d-flex flex-row justify-content-center align-items-center w-100 gap-4`}
    >
      {line}
      <p className={styles.horizontal_label_text}>{children}</p>
      {line}
    </div>
  )
}
export default HorizontalLineLabel
