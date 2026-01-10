import { useLanguageSetting } from "@localization/hooks"

const LanguageInitializer = ({
  children,
}: Pick<React.ComponentProps<"div">, "children">) => {
  useLanguageSetting()
  return children
}
export default LanguageInitializer
