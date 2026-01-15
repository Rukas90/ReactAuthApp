import { useState } from "react"

interface Props {
  value?: boolean
  onValueChanged?: (newValue: boolean) => void
  checkedIcon: string
  uncheckedIcon: string
}
const IconCheckbox = ({
  value,
  onValueChanged,
  checkedIcon,
  uncheckedIcon,
}: Props) => {
  const [checked, setChecked] = useState(value)

  const icon = checked ? checkedIcon : uncheckedIcon

  const onChangeCallback = () => {
    const newState = !checked
    setChecked(newState)
    onValueChanged?.(newState)
  }
  return (
    <label className="relative w-5 h-5 inline-block bg-size-(16px) bg-center bg-no-repeat mt-0.5">
      <input
        className="w-full h-full inset-0 absolute opacity-0 pointer-events-none"
        type="checkbox"
        onChange={onChangeCallback}
      />
      <img
        className="w-full h-full inset-0 opacity-35 absolute transition-opacity hover:opacity-50 active:opacity-40"
        src={icon}
      />
    </label>
  )
}
export default IconCheckbox
