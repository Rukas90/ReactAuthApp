import type { ReactNode } from "react"

interface Props {
  text?: string
  icon?: ReactNode
}
const DropdownLabel = ({ text, icon }: Props) => {
  return (
    <div className="flex gap-0.5 items-center text-sm">
      {icon}
      {text}
    </div>
  )
}
export default DropdownLabel
