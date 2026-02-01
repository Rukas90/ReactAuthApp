import clsx from "clsx"

interface Props extends Pick<
  React.ComponentProps<"div">,
  "children" | "className"
> {
  useDefaultPadding?: boolean
}
const OutlineBoxContainer = ({
  useDefaultPadding = true,
  children,
  className,
}: Props) => {
  return (
    <div
      className={clsx(
        "w-full bg-[#141210]",
        useDefaultPadding && "px-4 py-3",
        className,
      )}
    >
      {children}
    </div>
  )
}
export default OutlineBoxContainer
