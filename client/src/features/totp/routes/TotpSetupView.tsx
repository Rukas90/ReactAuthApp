import {
  ContentContainer,
  FullSizeContainer,
  HorizontalLineLabel,
} from "@features/shared"
import NavBar from "../../dashboard/components/NavBar"
import TotpSetupContainer from "../components/TotpSetupContainer"
import TotpSetupContent from "../components/TotpSetupContent"

const TotpSetupView = () => {
  return (
    <FullSizeContainer>
      <ContentContainer>
        <NavBar />
        <HorizontalLineLabel className="w-full font-light text-stone-200 text-2xl">
          Enable time-based authentication (TOTP)
        </HorizontalLineLabel>
        <TotpSetupContainer>
          <TotpSetupContent />
        </TotpSetupContainer>
      </ContentContainer>
    </FullSizeContainer>
  )
}
export default TotpSetupView
