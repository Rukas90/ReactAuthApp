import React from "react"

interface Props {
  space: number
  unit?: "px" | "rem" | "%"
  isVertical: boolean
}

const Spacer = ({ space, unit = "px", isVertical }: Props) => {
  const size = `${space}${unit}`

  const styling = {
    minWidth: isVertical ? "0" : size,
    minHeight: isVertical ? size : "0",
  }

  return <div style={styling} />
}
export default Spacer
