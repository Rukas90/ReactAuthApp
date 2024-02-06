import React from "react"
import { OAuthProviderProps } from "Components/Props/OAuthProviderProps"
import OAuthProvider from "./OAuthProvider"
import GoogleIcon from "Img/Icons/Social/google.svg"

const GoogleOAuthProvider = ({ data }: OAuthProviderProps) => {
  return <OAuthProvider data={data} icon={GoogleIcon} />
}
export default GoogleOAuthProvider
