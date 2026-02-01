import { createContext } from "react"
import type { LanguageConfig } from "../utils"

export type LanguageContextState = {
  currentLanguage: LanguageConfig
  setLanguage: (language: string) => void
  languages: LanguageConfig[]
}
export const LanguageContext = createContext<LanguageContextState | undefined>(
  undefined,
)
