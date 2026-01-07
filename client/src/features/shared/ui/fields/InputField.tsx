import type { GeneralProps } from "#types/ui.types"
import {
  useState,
  type HTMLInputAutoCompleteAttribute,
  type HTMLInputTypeAttribute,
} from "react"
import styles from "./Field.module.css"
import IconCheckbox from "#ui/toggles/IconCheckbox"
import visibilityOnIcon from "#icons/misc/visibility-on.svg"
import visibilityOffIcon from "#icons/misc/visibility-off.svg"

interface Props extends GeneralProps {
  name?: string | undefined
  value?: string | readonly string[] | number | undefined
  onValueChanged?: (newValue: string) => void
  type?: HTMLInputTypeAttribute | undefined
  placeholder?: string | undefined
  autocomplete?: HTMLInputAutoCompleteAttribute | undefined
  hideable?: boolean
  isHidden?: boolean
  extendWidth?: boolean
  indicateError?: boolean
}
const InputField = ({
  id,
  name,
  value = undefined,
  onValueChanged,
  type = "text",
  placeholder = "Input",
  autocomplete,
  className = "",
  hideable,
  isHidden,
  extendWidth,
  indicateError,
}: Props) => {
  const [text, setText] = useState(value || "")
  const [hidden, setHidden] = useState(hideable && isHidden)

  const baseClasses = `
    ${styles.input_field_container}
    ${text && styles.input_field_container__expanded}
    ${indicateError && styles.input_field_container__error}
    ${extendWidth && "w-100"}
  `
  const inputClasses = `
    ${styles.input_field}
    ${className}
    ${extendWidth && "w-100"}
  `
  const onChangeCallback = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value

    setText(newValue)

    if (onValueChanged) {
      onValueChanged(newValue)
    }
  }
  return (
    <div className={baseClasses}>
      <label htmlFor={id} className={styles.input_field_placeholder}>
        {placeholder}
      </label>
      <input
        id={id}
        name={name}
        value={text}
        onChange={onChangeCallback}
        type={hidden ? "password" : type}
        autoComplete={autocomplete}
        className={inputClasses}
      />
      {hideable && (
        <IconCheckbox
          value={hidden}
          onValueChanged={setHidden}
          checkedIcon={visibilityOffIcon}
          uncheckedIcon={visibilityOnIcon}
        />
      )}
    </div>
  )
}
export default InputField
