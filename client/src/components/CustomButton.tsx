import React from "react"

interface Props {
  text: string
  icon?: string
  link?: string
  action?: () => void
  extendWidth?: boolean
  disabled?: boolean
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
}: Props) => {
  // Dynamic classes for the button, extending full width if extendWidth is true
  const classes = `btn btn-light ${
    extendWidth ? "w-100" : ""
  } py-2 px-4 mb-4 d-flex justify-content-center align-items-center text-center non-rounded`

  const buttonElement = (
    <button
      type="button"
      className={classes}
      onClick={link || disabled ? undefined : action}
      disabled={disabled}
    >
      {icon && <img src={icon} className="social-btn-icon mx-2" />}
      <span className="fw-medium">{text}</span>
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
