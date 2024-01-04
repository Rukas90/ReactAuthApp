import { useEffect } from "react"
import axios from "axios"
import { useTranslation } from "react-i18next"
import { API_URL } from "../utils/Variables"
import { useLanguage } from "../contexts/LanguageProvider"

/**
 * useLanguageSetting Hook
 *
 * Custom hook to fetch and set the application's language setting.
 *
 * Behavior:
 * - On component mount, sends a request to fetch the user's preferred language from the server.
 * - If a preferred language is set and differs from the current language, updates the language.
 * - Utilizes the `useLanguage` context to set the current language across the application.
 * - Handles any errors that occur during the fetch process.
 */
const useLanguageSetting = () => {
  const { i18n } = useTranslation() // Access i18n instance from react-i18next
  const { setCurrentLanguage } = useLanguage() // Access language context

  useEffect(() => {
    const fetchAndSetLanguage = async () => {
      try {
        // Fetch the preferred language from the server
        const response = await axios.get(`${API_URL}/session/lang`, {
          withCredentials: true,
        })
        const targetLanguage = response.data.language || i18n.language

        // Update the language if it differs from the current one
        if (targetLanguage && i18n.language !== targetLanguage) {
          await i18n.changeLanguage(targetLanguage)
          setCurrentLanguage(i18n.language)
        }
      } catch (error) {
        // Handle any errors during fetch
        console.error("Error fetching language setting:", error)
      }
    }
    fetchAndSetLanguage()
  }, [i18n.language]) // Rerun the effect if the language changes
}

export default useLanguageSetting
