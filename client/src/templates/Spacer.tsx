import React from "react"

interface Props {
  space: number // The amount of space to be applied
  unit?: "px" | "rem" | "%" // Unit for the spacing (defaults to pixels)
  isVertical: boolean // Determines if the spacing is vertical or horizontal
}

/**
 * Spacer Component
 *
 * A utility component to create adjustable space between elements in a layout.
 * It can be used to create both vertical and horizontal spacing.
 *
 * Props:
 * - space: The magnitude of the space.
 * - unit: The unit of measurement for the space (e.g., px, rem, %). Defaults to 'px'.
 * - isVertical: If true, the spacer applies vertical space, else horizontal.
 *
 * Usage:
 * - To create vertical space, set isVertical to true.
 * - For horizontal space, set isVertical to false.
 */
const Spacer = ({ space, unit = "px", isVertical }: Props) => {
  const size = `${space}${unit}`

  const styling = {
    minWidth: isVertical ? "0" : size,
    minHeight: isVertical ? size : "0",
  }

  return <div style={styling} />
}
export default Spacer
