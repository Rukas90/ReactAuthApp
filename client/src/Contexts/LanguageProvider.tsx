import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react"
import { useTranslation } from "react-i18next"
import useLanguageSetting from "../Hooks/useLanguageSetting"
import { useLocalizedText as T } from "Hooks/useLocalizedText"

// Defines the shape of the language context data
type LanguageContextType = {
  currentLanguage: string // The current language state
  setCurrentLanguage: (language: string) => void // Function to update the current language
}

// Creating the language context with default values
const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: "en", // Default language
  setCurrentLanguage: () => {}, // Placeholder function
})

// Type definition for the LanguageProvider props
type LanguageProviderProps = {
  children: ReactNode // ReactNode type for the children prop to accept any valid React element
}

/**
 * LanguageProvider Component
 *
 * Provides a language context to its children, allowing them to access and modify
 * the current language state. Utilizes the useLanguageSetting hook to persist
 * language settings across sessions.
 *
 * Props:
 * - children: The child components that will have access to the language context.
 */
export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  useLanguageSetting() // Hook to handle language setting persistence

  const { i18n } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState<string>(i18n.language)

  // Effect to update language state when i18n.language changes
  useEffect(() => {
    setCurrentLanguage(i18n.language)
  }, [i18n.language])

  const Localized = (text: string): LocalizedTextID => {
    return { value: text, _type: "LocalizedTextID" } as LocalizedTextID
  }
  window.Localized = Localized

  const translate = (
    id: LocalizableText | string,
    options?: TranslationOptions
  ): string => {
    if (typeof id === "object" && "_type" in id) {
      return T(id, options)
    }
    return T(Localized(id), options)
  }
  window.Translate = translate

  // Providing language state and setter function through context
  return (
    <LanguageContext.Provider value={{ currentLanguage, setCurrentLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

/**
 * useLanguage Hook
 *
 * A custom hook to access the language context. It provides the current language state
 * and the function to update it.
 *
 * Usage:
 * Can be used in any functional component under LanguageProvider to access
 * and set the application's language.
 */
export const useLanguage = () => useContext(LanguageContext)
