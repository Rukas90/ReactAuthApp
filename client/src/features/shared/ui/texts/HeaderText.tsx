const HeaderText = ({
  children,
}: Pick<React.ComponentProps<"div">, "children">) => {
  return <h1 className="text-light mb-4">{children}</h1>
}
export default HeaderText
