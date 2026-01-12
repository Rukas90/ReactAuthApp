const FullSizeContainer = (props: React.ComponentProps<"div">) => {
  return (
    <div className="w-100 h-100" {...props}>
      {props.children}
    </div>
  )
}
export default FullSizeContainer
