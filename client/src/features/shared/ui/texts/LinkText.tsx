import type { GeneralProps, ReactChildrenProps } from "#types/ui.types"
import type { HTMLAttributeAnchorTarget } from "react"
import styles from "./Text.module.css"
import { Link } from "react-router-dom"

interface Props extends ReactChildrenProps, GeneralProps {
  to: string
  target?: HTMLAttributeAnchorTarget | undefined
}

const LinkText = ({ to, target, children, className, id, style }: Props) => {
  return (
    <Link to={to} target={target}>
      <span
        id={id}
        className={`${className} ${styles.link_text}`}
        style={style}
      >
        {children}
      </span>
    </Link>
  )
}
export default LinkText
