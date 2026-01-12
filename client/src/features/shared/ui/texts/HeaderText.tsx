const HeaderText = ({
  children,
}: Pick<React.ComponentProps<"div">, "children">) => {
  return (
    <h1 className="text-5xl text-stone-300 font-medium mb-4">{children}</h1>
  )
}
export default HeaderText
