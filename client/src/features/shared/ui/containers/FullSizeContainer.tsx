import styles from "./styles/Container.module.css"

const FullSizeContainer = (props: React.ComponentProps<"div">) => {
  return (
    <div className={styles.full_container} {...props}>
      {props.children}
    </div>
  )
}
export default FullSizeContainer
