import BaseButton, { type BaseButtonProps } from "./BaseButton"

const MiniCancelButton = (props: BaseButtonProps) => {
  return (
    <BaseButton
      {...props}
      className="
      text-neutral-300
      bg-[#b13525]
      hover:bg-[#c9412f] 
      active:bg-[#9b2d1e]
      border
      border-stone-700
      transition-colors
      py-0.5 px-1.5
      text-sm
      "
    />
  )
}
export default MiniCancelButton
