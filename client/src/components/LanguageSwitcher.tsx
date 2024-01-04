import React from "react"
import { useTranslation } from "react-i18next"
import { languages } from "../config/i18n"
import axios from "axios"
import { API_URL } from "../utils/Variables"
import { useLanguage } from "../contexts/LanguageProvider"

const GetLanguageName = (language: string) => {
  return languages.find((lang) => lang.code === language)?.name || "Language"
}

const LanguageSwitcher = () => {
  const { currentLanguage, setCurrentLanguage } = useLanguage()
  const { i18n } = useTranslation()

  const changeLanguage = async (language: string) => {
    await axios.put(
      `${API_URL}/session/lang`,
      { language: language },
      { withCredentials: true }
    )
    await i18n.changeLanguage(language)

    setCurrentLanguage(language)
  }
  return (
    <div className="dropdown">
      <button
        className="btn btn-secondary dropdown-toggle"
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
