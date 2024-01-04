import React, { useState } from "react"

interface Props {
  onIcon: string // URL of the icon when the checkbox is checked
  offIcon: string // URL of the icon when the checkbox is unchecked
  checked?: boolean // Initial checked state of the checkbox
  classes?: string // Additional CSS classes for styling
  onChange?: (isChecked: boolean) => void // Callback function triggered on state change
}

/**
 * IconCheck Component
 * Renders a custom checkbox with icon toggling functionality.
 *
 * Props:
 * - onIcon: URL of the icon to display when the checkbox is checked.
 * - offIcon: URL of the icon to display when the checkbox is unchecked.
 * - checked: Initial state of the checkbox. Default is false.
 * - classes: Additional CSS class names to apply to the checkbox.
 * - onChange: Callback function that receives the new checked state.
 */
const IconCheck = ({ onIcon, offIcon, checked, classes, onChange }: Props) => {
  const [value, setValue] = useState(checked)

  // Inline styling for setting the background image based on the checkbox state
  const styling = {
    backgroundImage: `url(${value ? onIcon : offIcon})`,
  }

  /**
   * Handles changes to the checkbox's checked state.
   * Updates the local state and calls the onChange callback if provided.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event from the checkbox.
   */
  const onValueChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked
    setValue(newValue)

    // Call the onChange callback with the new value, if provided
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
