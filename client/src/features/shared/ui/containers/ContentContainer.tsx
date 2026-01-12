const ContentContainer = (props: React.ComponentProps<"div">) => {
  return (
    <div className="max-w-7xl w-full mx-auto" {...props}>
      {props.children}
    </div>
  )
}
export default ContentContainer
