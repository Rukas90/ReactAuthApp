import React from "react"
import { useTranslation } from "react-i18next"
import { languages } from "../../Config/i18n"
import Dropdown, { DropdownOption } from "./Dropdown"
import { useLanguage } from "Contexts/LanguageProvider"
import withNotifications, {
  WithNotificationsProps,
} from "Contexts/NotificationsContexts"

/**
 * LanguageSwitcher Component
 *
 * Provides a dropdown menu for users to switch the application's language.
 * It communicates language preference to the server for persistence and updates
 * the language setting in the application context.
 */
const LanguageSwitcher = ({ notifications }: WithNotificationsProps) => {
  const { currentLanguage, setCurrentLanguage } = useLanguage()
  const { i18n } = useTranslation()

  /**
   * Handles the change of language.
   *
   * @param {DropdownOption} option - The newly selected language option to set.
   */
  const changeLanguage = async (_: number, option: DropdownOption) => {
    if (!option.key) {
      return
    }
    const code = option.key as string

    // Update the language setting on the server
    localStorage.setItem("language", code)

    // Change the language in the i18n instance
    await i18n.changeLanguage(code)

    // Update the current language in the context
    setCurrentLanguage(code)

    notifications.success(Localized("LANGUAGE_CHANGE_CONFIRMATION"))
  }
  return (
    <Dropdown
      options={languages.map((lang) => ({
        name: lang.name,
        key: lang.code,
      }))}
      currentIndex={languages.findIndex(
        (lang) => lang.code === currentLanguage
      )}
      textColor="light"
      onOptionChanged={changeLanguage}
    />
  )
}

export default withNotifications(LanguageSwitcher)
