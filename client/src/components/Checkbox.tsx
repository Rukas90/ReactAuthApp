import React, { useState, useEffect } from "react"

interface Props {
  id?: string
  onIcon?: string // URL of the icon when the checkbox is checked
  offIcon?: string // URL of the icon when the checkbox is unchecked
  role?: string
  checked?: boolean // Initial checked state of the checkbox
  classes?: string // Additional CSS classes for styling
  style?: React.CSSProperties
  onStateChange?: (newState: boolean) => void // Callback function triggered on state change
  readOnly?: boolean
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
const Checkbox = ({
  id,
  onIcon,
  offIcon,
  role,
  checked,
  classes,
  style,
  onStateChange,
  readOnly,
}: Props) => {
  const [value, setValue] = useState(checked)

  // Inline styling for setting the background image based on the checkbox state
  const styling: React.CSSProperties = {
    ...style,
    ...(onIcon && offIcon
      ? { backgroundImage: `url(${value ? onIcon : offIcon})` }
      : {}),
  }

  /**
   * Handles changes to the checkbox's checked state.
   * Updates the local state and calls the onChange callback if provided.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event from the checkbox.
   */
  const onValueChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newState = event.target.checked

    // Call the onChange callback with the new value, if provided
    if (onStateChange) {
      onStateChange(newState)
    }
    setValue(newState)
  }

  return (
    <input
      id={id}
      className={`form-check-input ${classes}`}
      type="checkbox"
      role={role}
      value=""
      checked={value}
      onChange={onValueChanged}
      aria-label="..."
      style={styling}
      readOnly={readOnly}
    />
  )
}
export default Checkbox
