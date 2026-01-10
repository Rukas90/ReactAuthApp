import { useState } from "react"
import styles from "./styles/Toggle.module.css"

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
    <label className={styles.icon_toggle}>
      <input type="checkbox" onChange={onChangeCallback} />
      <img className={styles.icon_toggle_img} src={icon} />
    </label>
  )
}
export default IconCheckbox
