import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react"
import { useTranslation } from "react-i18next"
import useLanguageSetting from "../hooks/useLanguageSetting"

type LanguageContextType = {
  currentLanguage: string
  setCurrentLanguage: (language: string) => void
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: "en", // Default language
  setCurrentLanguage: () => {},
})

type LanguageProviderProps = {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
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
