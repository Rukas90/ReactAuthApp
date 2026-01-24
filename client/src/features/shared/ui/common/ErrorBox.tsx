import clsx from "clsx"
import { IconClose } from "../icons"
import { IconButton } from "../buttons"

interface Props extends Pick<
  React.ComponentProps<"div">,
  "className" | "children"
> {
  isHidden?: boolean
  visibleClasses?: string
  onClose?: () => void
}
const ErrorBox = ({
  isHidden = true,
  onClose,
  className,
  visibleClasses,
  children,
}: Props) => {
  return (
    <div
      className={clsx(
        "flex items-center text-[0.95rem] rounded-sm bg-[#5a201159] border border-[#5a1f11af] text-gray-300 w-full transition-all",
        className,
        isHidden
          ? "opacity-0 -translate-y-full max-h-0 p-0 m-0 border-0"
          : clsx("opacity-100 translate-y-0 p-2", visibleClasses),
      )}
    >
      <p className="p-0 m-0 w-full text-center text-sm">{children}</p>
      {onClose && (
        <IconButton
          icon={<IconClose />}
          className="absolute right-3 w-4 h-4 text-[#8b4938]"
          onClick={onClose}
        />
      )}
    </div>
  )
}
export default ErrorBox
