import type { ReactNode } from "react"
import { useDropdown } from "./contexts/DropdownContext"

interface Props {
  content: string | ReactNode
  onSelected?: () => void
  disabled?: boolean
}
const DropdownItem = ({ content, onSelected, disabled = false }: Props) => {
  const { close } = useDropdown()

  const handleClick = () => {
    onSelected?.()
    close()
  }
  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      className="flex px-2 py-1 text-stone-300 hover:bg-stone-700 transition-colors"
    >
      {content}
    </button>
  )
}
export default DropdownItem
