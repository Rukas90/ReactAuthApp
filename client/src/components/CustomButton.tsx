import React from "react"

interface Props {
  text: string
  icon?: string
  link: string
  extendWidth?: boolean
}

const CustomButton = ({ text, icon, link, extendWidth }: Props) => {
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
