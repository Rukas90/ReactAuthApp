import { IconCheckbox } from "../toggles"
import visibilityOnIcon from "@icons/misc/visibility-on.svg"
import visibilityOffIcon from "@icons/misc/visibility-off.svg"

interface Props {
  isHidden?: boolean
  onToggled?: (newValue: boolean) => void
}
const VisibilityToggleIcon = ({ isHidden, onToggled }: Props) => {
  return (
    <IconCheckbox
      value={isHidden}
      onValueChanged={onToggled}
      checkedIcon={visibilityOffIcon}
      uncheckedIcon={visibilityOnIcon}
    />
  )
}
export default VisibilityToggleIcon
