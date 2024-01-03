import React, { useState } from "react"
import VisibilityOn from "../img/icons/common/visibility-on.svg"
import VisibilityOff from "../img/icons/common/visibility-off.svg"
import IconCheck from "./IconCheck"

interface Props {
  type?: string | "text" | "email" | "password"
  placeholder?: string
  autocomplete?: string
  hideable?: boolean
  isVisible?: boolean
  onValueChange?: (newValue: string) => void
}

const InputField = ({
  type = "text",
  placeholder,
  autocomplete,
  hideable,
  isVisible,
  onValueChange,
}: Props) => {
  const [visible, setVisible] = useState(isVisible)
  const [text, setText] = useState("")

  const onInputTextChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value

    setText(newValue)

    if (onValueChange) {
      onValueChange(newValue)
    }
  }

  return (
    <>
      <div className="position-relative d-flex align-items-start justify-content-center vstack">
        <label
          aria-disabled="true"
          className={`position-absolute start-0 text-secondary mx-3 transition-all user-select-none pointer-events-none ${
            text ? "fs-8 input-placeholder-active" : ""
          }`}
        >
          {placeholder}
        </label>
        <input
          type={hideable && visible ? "text" : type}
          className={`w-100 ${
            text ? "pt-4 pb-2 align-bottom" : "py-2"
          } px-3 border-0 input-field text-light transition-all`}
          onChange={onInputTextChanged}
          autoComplete={autocomplete}
        />
        {hideable && (
          <IconCheck
            onIcon={VisibilityOn}
            offIcon={VisibilityOff}
            checked={isVisible}
            classes="visibility-btn-icon invert position-absolute end-0 my-0 mx-2"
            onChange={setVisible}
          />
        )}
      </div>
    </>
  )
}
export default InputField
