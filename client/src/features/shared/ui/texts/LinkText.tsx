import type { GeneralProps, ReactChildrenProps } from "#types/ui.types"
import type { HTMLAttributeAnchorTarget } from "react"
import styles from "./Text.module.css"

interface Props extends ReactChildrenProps, GeneralProps {
  href?: string | undefined
  target?: HTMLAttributeAnchorTarget | undefined
}

const LinkText = ({ href, target, children, className, id, style }: Props) => {
  return (
    <a href={href} target={target}>
      <span
        id={id}
        className={`${className} ${styles.link_text}`}
        style={style}
      >
        {children}
      </span>
    </a>
  )
}
export default LinkText
