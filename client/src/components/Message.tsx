import React, { useState, useEffect } from "react"
import InfoIcon from "../img/icons/common/info.svg"
import Spacer from "../templates/Spacer"
import useVisualEffect, { EffectProperties } from "../hooks/useVisualEffect"

type ColorOption =
  | "light"
  | "secondary"
  | "dark"
  | "black"
  | "white"
  | "info"
  | "warning"
  | "danger"
  | "error"
  | "success"
  | "primary"

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
    <div className={`w-100 p-4 bg-${bgColor} hstack`} style={effectStyle()}>
      {icon && (
        <>
          <img src={icon} className={`${invertIcon ? "invert" : ""}`} />
          <Spacer space={1.0} unit="rem" isVertical={false} />
        </>
      )}
      <div className="vstack">
        {header && (
          <>
            <span className={`text-${headerColor} fw-semibold`}>{header}</span>
            <Spacer space={0.25} unit="rem" isVertical />
          </>
        )}
        <span className={`text-${textColor}`}>{content}</span>
      </div>
    </div>
  )
}
export default Message
