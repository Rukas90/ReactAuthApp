import clsx from "clsx"
import type { ReactNode } from "react"

export interface BaseButtonProps extends Pick<
  React.ComponentProps<"div">,
  "className"
> {
  text?: string
  icon?: ReactNode

  type?: "submit" | "reset" | "button" | undefined

  extendWidth?: boolean
  padding?: boolean
  invert?: boolean
  disabled?: boolean

  action?: () => void
}

const BaseButton = ({
  text,
  icon,
  type = "button",
  className,
  extendWidth = false,
  disabled = false,
  action,
}: BaseButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={disabled ? undefined : action}
      className={clsx(
        className,
        "flex rounded-sm flex-row border-0 font-medium justify-center items-center text-center transition",
        extendWidth && "w-full",
        disabled ? "opacity-50" : "cursor-pointer",
      )}
    >
      {icon}
      {text && <span className="fw-medium">{text}</span>}
    </button>
  )
}
export default BaseButton
