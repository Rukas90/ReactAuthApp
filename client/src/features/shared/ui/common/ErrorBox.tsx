import clsx from "clsx"

interface Props extends Pick<
  React.ComponentProps<"div">,
  "className" | "children"
> {
  isHidden?: boolean
}
const ErrorBox = ({ isHidden = true, className, children }: Props) => {
  return (
    <div
      className={clsx(
        "text-[0.95rem] rounded-sm bg-[#5a201159] border border-[#5a1f11af] text-gray-300 w-full transition-all",
        className,
        isHidden
          ? "opacity-0 -translate-y-full max-h-0 p-0 m-0 border-0"
          : "opacity-100 translate-y-0 p-2 mt-0.5",
      )}
    >
      <p className="p-0 m-0 text-center text-sm">{children}</p>
    </div>
  )
}
export default ErrorBox
