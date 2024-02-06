import React from "react"

interface Props {
  text?: string
  icon?: string
  link?: string
  action?: () => void
  extendWidth?: boolean
  disabled?: boolean
  classes?: string
  style?: string | "light" | "dark" | "danger" | "blank"
  padding?: boolean
  invertImg?: boolean
  underline?: boolean
}

/**
 * CustomButton Component
 * Renders a button with optional icon and flexible styling.
 *
 * Props:
 * - text: The text displayed on the button.
 * - icon: (Optional) URL of an icon to display alongside the text.
 * - link: (Optional) The destination URL for the button's action.
 * - action: (Optional) A function to execute on button click.
 * - extendWidth: (Optional) If set to true, the button extends to full width.
 */
const CustomButton = ({
  text,
  icon,
  link,
  action,
  extendWidth,
  disabled,
  classes,
  style = "light",
  padding = true,
  invertImg,
  underline,
}: Props) => {
  // Dynamic classes for the button, extending full width if extendWidth is true
  const className = `${classes} ${
    style === "blank" ? "bg-clear border-0" : `btn btn-${style}`
  } ${extendWidth ? "w-100" : ""} ${underline && "hover-underline-animation"} ${
    padding ? `py-2 px-4` : "p-0"
  } d-flex justify-content-center align-items-center text-center non-rounded`

  const buttonElement = (
    <button
      type="button"
      className={className}
      onClick={link || disabled ? undefined : action}
      disabled={disabled}
    >
      {icon && (
        <img
          src={icon}
          className={`social-btn-icon ${text ? "me-2" : "m-0"} ${
            invertImg && "invert"
          }`}
        />
      )}
      {text && <span className={`fw-medium`}>{text}</span>}
    </button>
  )
  return (
    <>
      {link ? (
        <a
          href={disabled ? "" : link}
          className={`link-underline link-underline-opacity-0 ${
            extendWidth ? "w-100" : ""
          }`}
        >
          {buttonElement}
        </a>
      ) : (
        buttonElement
      )}
    </>
  )
}
export default CustomButton
