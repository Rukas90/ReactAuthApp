import BaseButton, { type BaseButtonProps } from "./BaseButton"

const MiniButton = (props: BaseButtonProps) => {
  return (
    <BaseButton
      {...props}
      className="
      text-neutral-300
      bg-stone-800
      hover:bg-stone-700
      active:bg-stone-600
      border
      border-stone-700
      transition-colors
      py-0.5 px-1.5
      text-sm
      "
    />
  )
}
export default MiniButton
