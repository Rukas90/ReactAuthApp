const ContentContainer = (props: React.ComponentProps<"div">) => {
  return (
    <div className="relative max-w-7xl w-full mx-auto px-8" {...props}>
      {props.children}
    </div>
  )
}
export default ContentContainer
