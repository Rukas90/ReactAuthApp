import { useContext } from "react"
import { LanguageContext } from "../contexts"

const useLanguageContext = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error(
      "useLanguageContext can only be used within LanguageProvider.",
    )
  }
  return context
}
export default useLanguageContext
