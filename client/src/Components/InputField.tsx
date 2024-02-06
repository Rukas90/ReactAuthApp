import React, { useEffect, useState } from "react"
import VisibilityOn from "Img/Icons/Common/visibility-on.svg"
import VisibilityOff from "Img/Icons/Common/visibility-off.svg"
import Checkbox from "./Checkbox"
import { RoundnessOption } from "Utils/Types/RoundnessOption"

interface Props {
  type?: string | "text" | "email" | "password"
  value?: string
  placeholder?: string
  preservePlaceholder?: boolean
  autocomplete?: string
  hideable?: boolean
  isVisible?: boolean
  onValueChange?: (newValue: string) => void
  readonly?: boolean
  extendWidth?: boolean
  indicateError?: boolean
  roundness?: RoundnessOption | null
}

/**
 * InputField Component
 * Renders an input field with optional visibility toggle.
 *
 * Props:
 * - type: The type of input (text, email, password). Defaults to 'text'.
 * - placeholder: Placeholder text for the input field.
 * - autocomplete: Autocomplete attribute for the input field.
 * - hideable: If true, shows a visibility toggle icon. Useful for password fields.
 * - isVisible: Controls the visibility state of the input (for hideable inputs).
 * - onValueChange: Callback function that receives the updated value on input change.
 */
const InputField = ({
  type = "text",
  value,
  placeholder,
  preservePlaceholder = true,
  autocomplete,
  hideable,
  isVisible,
  onValueChange,
  readonly = false,
  extendWidth = false,
  indicateError = false,
  roundness = null,
}: Props) => {
  const [visible, setVisible] = useState(isVisible)
  const [text, setText] = useState(value || "")

  useEffect(() => {
    // Update the text state whenever the value prop changes
    setText(value || "")
  }, [value])

  /**
   * Handles changes to the input field's value.
   * Updates the local state and calls the onValueChange callback if provided.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event from the input field.
   */
  const onInputTextChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (readonly) {
      return
    }
    const newValue = event.target.value

    setText(newValue)

    if (onValueChange) {
      onValueChange(newValue)
    }
  }
  const placeholderNode = (
    <>
      {(preservePlaceholder || (!preservePlaceholder && !text)) && (
        <label
          aria-disabled="true"
          className={`position-absolute start-0 text-secondary mx-3 transition-all user-select-none pointer-events-none ${
            text ? "fs-8 input-placeholder-active" : ""
          }`}
        >
          {placeholder}
        </label>
      )}
    </>
  )

  return (
    <div className={`${extendWidth && "w-100"}`}>
      <div
        className={`position-relative overflow-hidden d-flex align-items-start justify-content-center vstack m-auto ${roundness} ${
          indicateError && "indicator-danger"
        }`}
      >
        {placeholderNode}
        <input
          value={value}
          type={hideable && visible ? "text" : type}
          className={`w-100 ${
            text && preservePlaceholder ? "pt-4 pb-2 align-bottom" : "py-2"
          } px-3 border-0 input-field text-light transition-all`}
          onChange={onInputTextChanged}
          autoComplete={autocomplete}
          readOnly={readonly}
        />
        {hideable && (
          <Checkbox
            onIcon={VisibilityOn}
            offIcon={VisibilityOff}
            checked={isVisible}
            classes="visibility-btn-icon invert position-absolute end-0 my-0 mx-2 icon-toggle"
            onStateChange={(newState) => {
              setVisible(newState)
              return true
            }}
          />
        )}
      </div>
    </div>
  )
}
export default InputField
