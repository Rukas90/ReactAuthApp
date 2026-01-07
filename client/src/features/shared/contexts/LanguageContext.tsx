import { createContext, useContext, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import useLanguageSetting from "#shared/hooks/useLanguageSetting"

type LanguageContextState = {
  currentLanguage: string
  setCurrentLanguage: (language: string) => void
}
const LanguageContext = createContext<LanguageContextState>({
  currentLanguage: "en",
  setCurrentLanguage: () => {},
})
export const useLanguageContext = () => useContext(LanguageContext)

export const LanguageProvider = ({ children }: React.ComponentProps<"div">) => {
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
export const useLanguage = () => useContext(LanguageContext)
