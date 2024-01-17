import React from "react"
import Spacer from "./Spacer"
import Logo from "img/icons/common/logo.png"

interface Props {
  header: string // Main header text
  secondary: string // Secondary text
  linkText: string // Text for the link
  linkHref: string // URL for the link
}

/**
 * FormHeader Component
 *
 * Renders a header for forms with a logo, a primary header, secondary text, and a link.
 * Suitable for use in authentication forms like login or registration.
 *
 * Props:
 * - header: Main text displayed prominently.
 * - secondary: Additional text displayed below the main header.
 * - linkText: Text for a hyperlink, typically for navigation (e.g., 'Login' or 'Register').
 * - linkHref: URL that the hyperlink points to.
 */
const FormHeader = ({
  header,
  secondary,
  linkText,
  linkHref: linkHref,
}: Props) => {
  return (
    <>
      <div className="header-container w-100 d-flex vstack align-items-center text-center lh-lg">
        <Spacer space={1.5} unit="rem" isVertical />
        <img className="logo" src={Logo} />
        <Spacer space={1.5} unit="rem" isVertical />
        <h1 className="text-light">{header}</h1>
        <Spacer space={0.5} unit="rem" isVertical />
        <div>
          <span className="text-secondary">{secondary}</span>
          <span className="ms-2">
            <a className="link-light" href={linkHref}>
              {linkText}
            </a>
          </span>
        </div>
      </div>
    </>
  )
}

export default FormHeader
