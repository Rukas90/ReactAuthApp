import { ContentContainer, DividerLabel } from "@features/shared"
import NavBar from "../../dashboard/components/NavBar"
import TotpSetupContainer from "../components/TotpSetupContainer"
import TotpSetupContent from "../components/TotpSetupContent"

const TotpSetupView = () => {
  return (
    <ContentContainer>
      <NavBar />
      <DividerLabel className="w-full font-light text-stone-200 text-2xl">
        Enable time-based authentication (TOTP)
      </DividerLabel>
      <TotpSetupContainer>
        <TotpSetupContent />
      </TotpSetupContainer>
    </ContentContainer>
  )
}
export default TotpSetupView
