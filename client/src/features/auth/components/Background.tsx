const Background = ({
  children,
}: Pick<React.ComponentProps<"div">, "children">) => {
  return (
    <div className="relative flex flex-col w-full h-auto min-h-full bg-stone-900 bg-cover bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1744&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]">
      {children}
    </div>
  )
}
export default Background
