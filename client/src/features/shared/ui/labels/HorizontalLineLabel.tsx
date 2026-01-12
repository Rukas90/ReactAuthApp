const HorizontalLineLabel = ({
  children,
  className,
}: Pick<React.ComponentProps<"div">, "children" | "className">) => {
  const line = <div className={`grow w-100 h-px bg-stone-800`} />
  return (
    <div
      className={`${className} flex flex-row justify-center items-center w-100 gap-4`}
    >
      {line}
      <p className="text-stone-400 p-0 m-0 font-normal">{children}</p>
      {line}
    </div>
  )
}
export default HorizontalLineLabel
