const SettingsPanel = ({
  children,
}: Pick<React.ComponentProps<"div">, "children">) => {
  return (
    <div className="w-full rounded-xl overflow-hidden border border-stone-900">
      {children}
    </div>
  )
}
export default SettingsPanel
