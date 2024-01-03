import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { languages } from "../config/i18n"

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const [language, setLanguage] = useState("")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || i18n.language

    if (savedLanguage && i18n.language !== savedLanguage) {
      i18n.changeLanguage(savedLanguage)
    }
    const currentLanguage = languages.find(
      (lang) => lang.code === savedLanguage
    )
    setLanguage(currentLanguage ? currentLanguage.name : "Language")
  }, [i18n.language])
  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language)
    localStorage.setItem("language", language)
  }
  return (
    <div className="dropdown">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {language}
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
