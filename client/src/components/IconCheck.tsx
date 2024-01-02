import React, { useState } from "react"

interface Props {
  onIcon: string
  offIcon: string
  checked?: boolean
  classes?: string
  onChange?: (isChecked: boolean) => void
}

const IconCheck = ({ onIcon, offIcon, checked, classes, onChange }: Props) => {
  const [value, setValue] = useState(checked)

  const styling = {
    backgroundImage: `url(${value ? onIcon : offIcon})`,
  }

  const onValueChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked
    setValue(newValue)

    if (onChange) {
      onChange(newValue)
    }
  }

  return (
    <input
      className={`form-check-input icon-toggle ${classes}`}
      type="checkbox"
      value=""
      checked={value}
      onChange={onValueChanged}
      aria-label="..."
      style={styling}
    />
  )
}
export default IconCheck
