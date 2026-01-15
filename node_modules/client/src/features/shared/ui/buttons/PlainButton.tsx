import BaseButton, { type BaseButtonProps } from "./BaseButton"

const PlainButton = (props: BaseButtonProps) => {
  return (
    <BaseButton
      {...props}
      className="
      text-neutral-900
      bg-stone-200
      hover:bg-stone-300
      active:bg-stone-400
      transition-colors
      py-2 px-6
      "
    />
  )
}
export default PlainButton
