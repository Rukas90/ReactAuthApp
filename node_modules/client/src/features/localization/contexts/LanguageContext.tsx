import { createContext } from "react"

export type LanguageContextState = {
  currentLanguage: string
  setCurrentLanguage: (language: string) => void
}
export const LanguageContext = createContext<LanguageContextState>({
  currentLanguage: "en",
  setCurrentLanguage: () => {},
})
