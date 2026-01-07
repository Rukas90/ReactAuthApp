import useLanguageSetting from "../hooks/useLanguageSetting"

const LanguageInitializer = ({ children }: React.ComponentProps<"div">) => {
  useLanguageSetting()
  return children
}
export default LanguageInitializer
