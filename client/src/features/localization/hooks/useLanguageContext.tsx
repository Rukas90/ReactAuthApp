import { useContext } from "react"
import { LanguageContext } from "@localization/contexts"

const useLanguageContext = () => useContext(LanguageContext)
export default useLanguageContext
