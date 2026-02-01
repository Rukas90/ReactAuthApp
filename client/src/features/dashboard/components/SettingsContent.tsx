import clsx from "clsx"

const SettingsContent = ({
  children,
  className,
}: Pick<React.ComponentProps<"div">, "children" | "className">) => {
  return (
    <div className={clsx(className, "flex justify-between")}>{children}</div>
  )
}
export default SettingsContent
