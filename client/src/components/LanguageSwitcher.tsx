import React from "react"
import { useTranslation } from "react-i18next"
import { languages } from "../config/i18n"
import axios from "axios"
import { API_URL } from "../utils/Variables"
import { useLanguage } from "../contexts/LanguageProvider"

/**
 * Retrieves the display name of a language given its code.
 *
 * @param {string} language - The language code (e.g., 'en', 'lt').
 * @returns {string} The display name of the language.
 */
const GetLanguageName = (language: string) => {
  return languages.find((lang) => lang.code === language)?.name || "Language"
}

/**
 * LanguageSwitcher Component
 *
 * Provides a dropdown menu for users to switch the application's language.
 * It communicates language preference to the server for persistence and updates
 * the language setting in the application context.
 */
const LanguageSwitcher = () => {
  const { currentLanguage, setCurrentLanguage } = useLanguage()
  const { i18n } = useTranslation()

  /**
   * Handles the change of language.
   *
   * @param {string} language - The new language code to set.
   */
  const changeLanguage = async (language: string) => {
    // Update the language setting on the server
    localStorage.setItem("language", language)

    // Change the language in the i18n instance
    await i18n.changeLanguage(language)

    // Update the current language in the context
    setCurrentLanguage(language)
  }
  return (
    <div className="dropdown">
      <button
        className="btn btn-black text-secondary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {GetLanguageName(currentLanguage)}
      </button>
      <ul className="dropdown-menu">
        {languages.map(({ code, name }) => (
          <li key={code}>
            <button
              className="dropdown-item"
              type="button"
              onClick={() => changeLanguage(code)}
            >
              {name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LanguageSwitcher
