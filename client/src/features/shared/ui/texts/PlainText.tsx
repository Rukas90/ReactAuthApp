import clsx from "clsx"

const PlainText = ({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) => {
  return (
    <p {...props} className={clsx(className, "text-stone-500 text-sm")}>
      {children}
    </p>
  )
}
export default PlainText
