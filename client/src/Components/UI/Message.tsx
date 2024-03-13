import React from "react"
import InfoIcon from "Img/Icons/Common/info.svg"
import useVisualEffect, { EffectProperties } from "Hooks/useVisualEffect"
import { ColorOption } from "Data/ColorOption"

interface Props extends EffectProperties {
  header?: string
  content?: string
  icon?: string
  invertIcon?: boolean
  bgColor?: ColorOption | string
  textColor?: ColorOption | string
  headerColor?: ColorOption | string
}

const Message = ({
  header = "",
  content = "Add text here",
  icon = InfoIcon,
  invertIcon = true,
  bgColor = "dark",
  textColor = "light",
  headerColor = "light",
  ...effectProps
}: Props) => {
  const effectStyle = useVisualEffect(effectProps)

  return (
    <div
      className={`d-flex w-100 p-4 bg-${bgColor} flex-col flex-md-row gap-3 align-items-end align-items-md-center`}
      style={effectStyle()}
    >
      {icon && (
        <>
          <img src={icon} className={`icon ${invertIcon ? "invert" : ""}`} />
        </>
      )}
      <div className="vstack gap-3">
        {header && (
          <>
            <span className={`text-${headerColor} fw-semibold`}>{header}</span>
          </>
        )}
        <span className={`text-${textColor}`}>{content}</span>
      </div>
    </div>
  )
}
export default Message
