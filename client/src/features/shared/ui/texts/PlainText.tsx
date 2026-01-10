import styles from "./styles/Text.module.css"

const PlainText = ({
  children,
  className,
  id,
  style,
}: Pick<
  React.ComponentProps<"div">,
  "children" | "className" | "id" | "style"
>) => {
  return (
    <p id={id} className={`${className} ${styles.plain_text}`} style={style}>
      {children}
    </p>
  )
}
export default PlainText
