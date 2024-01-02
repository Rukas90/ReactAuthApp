import React from "react"

interface Props {
  label: string
}

const LabelHorizontalSeparator = ({ label }: Props) => {
  return (
    <>
      <div className="hstack d-flex">
        <hr className="flex-grow-1 my-0 border-light" />
        <p className="text-center align-middle mx-4 text-secondary my-0">
          {label}
        </p>
        <hr className="flex-grow-1 my-0 border-light" />
      </div>
    </>
  )
}
export default LabelHorizontalSeparator
