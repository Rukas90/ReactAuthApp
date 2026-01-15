const SectionText = ({
  children,
}: Pick<React.ComponentProps<"div">, "children">) => {
  return <h1 className="text-sm text-stone-300">{children}</h1>
}
export default SectionText
