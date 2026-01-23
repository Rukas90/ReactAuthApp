import BaseButton, { type BaseButtonProps } from "./BaseButton"
import clsx from "clsx"

const PlainButton = (props: BaseButtonProps) => {
  return (
    <BaseButton
      {...props}
      className={clsx(
        "text-neutral-900 bg-stone-200 transition-colors py-2 px-6",
        !props.disabled && "hover:bg-stone-300 active:bg-stone-400",
        props.className,
      )}
    />
  )
}
export default PlainButton
