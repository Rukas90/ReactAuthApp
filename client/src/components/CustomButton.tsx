import React from "react"

interface Props {
  text: string
  icon?: string
  link: string
  extendWidth?: boolean
}

/**
 * CustomButton Component
 * Renders a button with optional icon and flexible styling.
 *
 * Props:
 * - text: The text displayed on the button.
 * - icon: (Optional) URL of an icon to display alongside the text.
 * - link: The destination URL for the button's action.
 * - extendWidth: (Optional) If set to true, the button extends to full width.
 */
const CustomButton = ({ text, icon, link, extendWidth }: Props) => {
  // Dynamic classes for the button, extending full width if extendWidth is true
  const classes = `btn btn-light ${
    extendWidth ? "w-100" : ""
  } py-2 px-4 mb-4 d-flex justify-content-center align-items-center text-center non-rounded`

  return (
    <>
      <a
        href={link}
        className={`link-underline link-underline-opacity-0 ${
          extendWidth ? "w-100" : ""
        }`}
      >
        <button type="button" className={classes}>
          {icon && <img src={icon} className="social-btn-icon mx-2" />}
          <span className="fw-medium">{text}</span>
        </button>
      </a>
    </>
  )
}
export default CustomButton
