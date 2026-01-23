import type { ReactNode, ButtonHTMLAttributes } from "react"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  label?: string
}
const IconButton = ({ icon, label, className, ...props }: Props) => {
  return (
    <button
      className={`cursor-pointer ${className}`}
      aria-label={label}
      {...props}
    >
      {icon}
    </button>
  )
}
export default IconButton
