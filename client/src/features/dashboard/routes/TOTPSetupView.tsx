import {
  ContentContainer,
  FullSizeContainer,
  HorizontalLineLabel,
} from "@features/shared"
import NavBar from "../components/NavBar"
import { useEffect } from "react"
import UserVerifiedRibbon from "../components/UserVerifiedRibbon"
import { useQuery } from "@tanstack/react-query"
import type { TotpData } from "@project/shared"

const TOTPSetupView = () => {
  /*const { data, isLoading, error } = useQuery<TotpData>({
    queryKey: ['totp_setup'],
    queryFn: 
  })

  useEffect(() => {
    
  }, [])*/

  return (
    <FullSizeContainer>
      <UserVerifiedRibbon />
      <ContentContainer>
        <NavBar />
        <HorizontalLineLabel className="w-full font-light text-stone-200 text-2xl">
          Enable time-based authentication (TOTP)
        </HorizontalLineLabel>
      </ContentContainer>
    </FullSizeContainer>
  )
}
export default TOTPSetupView
