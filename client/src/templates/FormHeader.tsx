import React from "react"
import Spacer from "./Spacer"
import Logo from "../img/icons/common/logo.png"

interface Props {
  header: string
  secondary: string
  linkText: string
  linkHref: string
}

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
        <Spacer space={3} unit="rem" isVertical />
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
