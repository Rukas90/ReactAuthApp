import clsx from "clsx"

export interface BaseButtonProps extends Pick<
  React.ComponentProps<"div">,
  "className"
> {
  text?: string
  icon?: string

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
  invert = false,
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
      {icon && (
        <img
          src={icon}
          className={clsx("w-5 h-5", text ? "me-2" : "m-0", invert && "invert")}
        />
      )}

      {text && <span className="fw-medium">{text}</span>}
    </button>
  )
}
export default BaseButton
