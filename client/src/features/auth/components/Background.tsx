import styles from "@auth/styles/Auth.module.css"

const Background = ({
  children,
}: Pick<React.ComponentProps<"div">, "children">) => {
  return <div className={styles.background}>{children}</div>
}
export default Background
