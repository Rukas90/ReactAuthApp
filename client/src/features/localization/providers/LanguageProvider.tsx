import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { LanguageContext } from "../contexts"
import { LANGUAGES, type Language } from "../utils"

const LanguageProvider = ({
  children,
}: Pick<React.ComponentProps<"div">, "children">) => {
  const { i18n } = useTranslation()

  const [currentLanguage, setCurrentLanguage] = useState<string>(i18n.language)

  const setLanguage = async (language: string) => {
    localStorage.setItem("language", language)
    await i18n.changeLanguage(language)
  }
  useEffect(() => {
    const handler = (lng: string) => {
      setCurrentLanguage(lng as Language)
    }

    i18n.on("languageChanged", handler)
    return () => i18n.off("languageChanged", handler)
  }, [i18n])

  useEffect(() => {
    const stored = localStorage.getItem("language") as Language | null
    if (stored && stored !== i18n.language) {
      i18n.changeLanguage(stored)
    }
  }, [])

  const languages = Object.values(LANGUAGES)

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage: languages.find(
          (lang) => lang.code === currentLanguage,
        )!,
        setLanguage,
        languages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}
export default LanguageProvider
