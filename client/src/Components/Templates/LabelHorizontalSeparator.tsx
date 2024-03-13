import React from "react"
import { ColorOption } from "Data/ColorOption"
import { TextSizeOption } from "Data/TextSizeOption"
import { SpacerProps } from "Components/Props/SpacerProps"
import Spacer from "Components/UI/Spacer"
import { HorizontalAlignment } from "Data/HorizontalAlignment"

interface Props {
  label: string
  borderColor?: ColorOption
  textColor?: ColorOption
  textSize?: TextSizeOption
  topSpacer?: SpacerProps
  bottomSpacer?: SpacerProps
  alignment?: HorizontalAlignment
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
const LabelHorizontalSeparator = ({
  label,
  borderColor = "light",
  textColor = "secondary",
  textSize = TextSizeOption.Regular,
  topSpacer = undefined,
  bottomSpacer = undefined,
  alignment = HorizontalAlignment.Middle,
}: Props) => {
  return (
    <>
      {topSpacer && (
        <Spacer
          space={topSpacer.space}
          unit={topSpacer.unit}
          isVertical={topSpacer.isVertical}
        />
      )}
      <div className="hstack d-flex">
        {(alignment === HorizontalAlignment.Middle ||
          alignment === HorizontalAlignment.End) && (
          <hr className={`flex-grow-1 my-0 border-${borderColor}`} />
        )}
        <p className={`mx-4 text-${textColor} my-0 fs-${textSize}`}>{label}</p>
        {(alignment === HorizontalAlignment.Middle ||
          alignment === HorizontalAlignment.Start) && (
          <hr className={`flex-grow-1 my-0 border-${borderColor}`} />
        )}
      </div>
      {bottomSpacer && (
        <Spacer
          space={bottomSpacer.space}
          unit={bottomSpacer.unit}
          isVertical={bottomSpacer.isVertical}
        />
      )}
    </>
  )
}
export default LabelHorizontalSeparator
