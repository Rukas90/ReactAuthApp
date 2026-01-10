import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { LanguageContext } from "@localization/contexts"
import { useLanguageSetting } from "@localization/hooks"

const LanguageProvider = ({
  children,
}: Pick<React.ComponentProps<"div">, "children">) => {
  useLanguageSetting()

  const { i18n } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState<string>(i18n.language)

  useEffect(() => {
    setCurrentLanguage(i18n.language)
  }, [i18n.language])

  return (
    <LanguageContext.Provider value={{ currentLanguage, setCurrentLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}
export default LanguageProvider
