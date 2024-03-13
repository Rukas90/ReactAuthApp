import React, { useState } from "react"
import { ColorOption } from "Data/ColorOption"
import { ClampIndex } from "Utils/Math"

export type DropdownOption = {
  name: string
  key?: string | number | bigint
}

interface Props {
  options: DropdownOption[]
  currentIndex?: number
  bgColor?: ColorOption
  textColor?: ColorOption
  extendWidth?: boolean
  outline?: boolean
  onOptionChanged?: (
    index: number,
    name: DropdownOption
  ) => void | Promise<void> | undefined
}

const Dropdown = ({
  options,
  currentIndex = 0,
  bgColor = "black",
  textColor = "secondary",
  extendWidth,
  outline = false,
  onOptionChanged,
}: Props) => {
  const [selected, setSelected] = useState(ClampIndex(currentIndex, options))

  const updateSelected = (index: number) => {
    setSelected(index)

    if (onOptionChanged) {
      onOptionChanged(index, options[index])
    }
  }

  return (
    <div className="dropdown">
      <button
        className={`btn hoverable text-start ${
          !outline && "outline-0 border-0"
        } btn-${bgColor} text-${textColor} dropdown-toggle ${
          extendWidth && "w-100"
        }`}
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {options[selected].name}
      </button>
      <ul className="dropdown-menu border-0">
        {options.map((option, index) => (
          <li key={option.key ?? index}>
            <a
              type="button"
              className="dropdown-item"
              onClick={(e) => updateSelected(index)}
            >
              {option.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default Dropdown
