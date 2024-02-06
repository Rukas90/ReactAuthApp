import { ColorOption } from "Utils/Types/ColorOption"
import React from "react"

interface Props {
  label: LocalizableText
  callback?: () => void
  isLeft: boolean
  connected?: boolean
  color: ColorOption
  className?: string
}

const DialogButton = ({
  label,
  callback,
  isLeft,
  connected,
  color,
  className,
}: Props) => {
  const roundedStyle = `rounded-pill${
    connected ? `-${isLeft ? "left" : "right"}` : ""
  }`
  return (
    <button
      type="button"
      className={`btn btn-${color} py-2 px-4 ${roundedStyle} ${className}`}
      onClick={callback}
    >
      {Translate(label)}
    </button>
  )
}
export default DialogButton
