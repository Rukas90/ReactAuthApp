import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useLanguage } from "#contexts/LanguageContext"

const useLanguageSetting = () => {
  const { i18n } = useTranslation()
  const { setCurrentLanguage } = useLanguage()

  useEffect(() => {
    const fetchAndSetLanguage = async () => {
      try {
        const storedLanguage = localStorage.getItem("language")
        const targetLanguage = storedLanguage || i18n.language

        if (targetLanguage && i18n.language !== targetLanguage) {
          await i18n.changeLanguage(targetLanguage)
          setCurrentLanguage(i18n.language)
        }
      } catch (error) {
        console.error("Error fetching language setting:", error)
      }
    }
    fetchAndSetLanguage()
  }, [i18n.language])
}
export default useLanguageSetting
