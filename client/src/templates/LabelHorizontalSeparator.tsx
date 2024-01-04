import React from "react"

interface Props {
  label: string
}

/**
 * LabelHorizontalSeparator Component
 *
 * Renders a label with horizontal lines on either side.
 * Commonly used as a visual separator in forms and UI layouts.
 *
 * Props:
 * - label: The text to be displayed in the center of the separator.
 *
 * Style:
 * - Uses horizontal rules (hr) to create lines on either side of the label.
 * - The label is centered and styled with specific classes for consistent appearance.
 */
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
