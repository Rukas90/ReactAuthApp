import { useEffect } from "react"
import axios from "axios"
import { useTranslation } from "react-i18next"
import { API_URL } from "../utils/Variables"
import { useLanguage } from "../contexts/LanguageProvider"

const useLanguageSetting = () => {
  const { i18n } = useTranslation()
  const { setCurrentLanguage } = useLanguage()

  useEffect(() => {
    const fetchAndSetLanguage = async () => {
      try {
        const response = await axios.get(`${API_URL}/session/lang`, {
          withCredentials: true,
        })
        const targetLanguage = response.data.language || i18n.language

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
