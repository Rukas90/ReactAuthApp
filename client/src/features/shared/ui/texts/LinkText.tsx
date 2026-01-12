import type { HTMLAttributeAnchorTarget } from "react"
import { Link } from "react-router-dom"

interface Props
  extends Pick<
    React.ComponentProps<"div">,
    "children" | "className" | "id" | "style"
  > {
  to: string
  target?: HTMLAttributeAnchorTarget | undefined
}

const LinkText = ({ to, target, children, className, id, style }: Props) => {
  return (
    <Link to={to} target={target}>
      <span
        id={id}
        className={`${className} relative inline-block
                                 text-stone-200
                                 opacity-[0.85] hover:opacity-100
                                 transition-opacity duration-100 ease-in-out
                               
                                 after:content-['']
                                 after:absolute after:left-0 after:bottom-0
                                 after:w-full after:h-px
                                 after:bg-stone-200
                                 after:opacity-50
                                 after:origin-left
                                 after:scale-x-0
                                 after:transition-transform after:duration-100 after:ease-in-out
                               
                                 hover:after:scale-x-100`}
        style={style}
      >
        {children}
      </span>
    </Link>
  )
}
export default LinkText
