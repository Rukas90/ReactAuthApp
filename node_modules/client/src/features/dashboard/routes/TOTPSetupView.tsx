import { useQuery } from "@tanstack/react-query"
import {
  ContentContainer,
  FullSizeContainer,
  HorizontalLineLabel,
} from "@features/shared"
import NavBar from "../components/NavBar"
import { useEffect, useState } from "react"

const TOTPSetupView = () => {
  // const { data, isLoading, error } = useQuery<>({})

  useEffect(() => {}, [])

  return (
    <FullSizeContainer>
      <ContentContainer>
        <NavBar />
        <HorizontalLineLabel className="w-full text-stone-200 text-2xl">
          Enable time-based authentication (TOTP)
        </HorizontalLineLabel>
      </ContentContainer>
    </FullSizeContainer>
  )
}
export default TOTPSetupView
