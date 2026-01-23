import { useContext } from "react"
import { TotpSetupContext } from "../contexts/TotpSetupContext"

const useTotpSetup = () => {
  const context = useContext(TotpSetupContext)
  if (context === undefined) {
    throw new Error("useTotpSetup must be used within TotpSetupProvider")
  }
  return context
}
export default useTotpSetup
