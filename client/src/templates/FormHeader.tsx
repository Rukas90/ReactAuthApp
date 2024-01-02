import React from "react"

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
      <div className="header-container w-100 flex justify-content-center text-center lh-lg">
        <h1 className="text-light">{header}</h1>
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
