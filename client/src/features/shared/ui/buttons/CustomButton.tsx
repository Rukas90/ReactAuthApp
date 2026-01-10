import styles from "./styles/Button.module.css"

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

  theme?: string | "light" | "dark" | "danger" | "blank"
}
const DEFAULT_PROP_VALUES: CustomButtonProps = {
  theme: "light",
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
  theme = "light",
}: CustomButtonProps = DEFAULT_PROP_VALUES) => {
  const classes = `
        border-0
        ${styles.custom_button} 
        btn 
        btn-${theme}
        ${extendWidth ? "w-100" : ""}
        ${padding ? `py-2 px-4` : "p-0"}
      `
  return (
    <a
      className={`${className} text-decoration-none ${
        extendWidth ? "w-100" : ""
      }`}
    >
      <button
        type={type}
        disabled={disabled}
        onClick={link || disabled ? undefined : action}
        className={classes}
      >
        {icon && (
          <img
            src={icon}
            className={`${styles.button_icon} ${text ? "me-2" : "m-0"} ${
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
