import BaseButton, { type BaseButtonProps } from "./BaseButton"
import clsx from "clsx"

const DangerButton = (props: BaseButtonProps) => {
  return (
    <BaseButton
      {...props}
      className={clsx(
        "text-neutral-200 bg-[#a32424] transition-colors py-2 px-6",
        !props.disabled && "hover:bg-[#bd2e2e] active:bg-[#911e1e]",
        props.className,
      )}
    />
  )
}
export default DangerButton
