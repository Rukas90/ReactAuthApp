const PlainText = ({
  children,
  className,
  id,
  style,
}: Pick<
  React.ComponentProps<"div">,
  "children" | "className" | "id" | "style"
>) => {
  return (
    <p id={id} className={`${className} text-stone-400`} style={style}>
      {children}
    </p>
  )
}
export default PlainText
