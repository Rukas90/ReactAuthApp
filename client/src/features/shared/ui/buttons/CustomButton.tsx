interface CustomButtonProps
  extends Pick<React.ComponentProps<"div">, "className"> {
  text?: string
  icon?: string

  type?: "submit" | "reset" | "button" | undefined

  extendWidth?: boolean
  padding?: boolean
  invertImg?: boolean
  disabled?: boolean

  link?: string
  action?: () => void
}

const CustomButton = ({
  text,
  icon,
  type = "button",
  className,
  extendWidth = false,
  padding = true,
  invertImg = false,
  disabled = false,
  action,
  link,
}: CustomButtonProps) => {
  return (
    <a className={`${className} ${extendWidth ? "w-full" : ""}`}>
      <button
        type={type}
        disabled={disabled}
        onClick={link || disabled ? undefined : action}
        className={`
        flex
        flex-row
        border-0
        justify-center
        items-center
        text-center
        bg-gray-200
        btn 
        hover:bg-gray-300
        active:bg-gray-400
        transition-colors
        cursor-pointer
        ${extendWidth && "w-full"}
        ${padding ? `py-2 px-6` : "p-0"}
      `}
      >
        {icon && (
          <img
            src={icon}
            className={`w-5 h-5 ${text ? "me-2" : "m-0"} ${
              invertImg && "invert"
            }`}
          />
        )}

        {text && <span className="fw-medium">{text}</span>}
      </button>
    </a>
  )
}
export default CustomButton
