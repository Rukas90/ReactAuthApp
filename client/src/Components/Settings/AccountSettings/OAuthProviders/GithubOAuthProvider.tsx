import React from "react"
import { OAuthProviderProps } from "Components/Props/OAuthProviderProps"
import OAuthProvider from "./OAuthProvider"
import GithubIcon from "Img/Icons/Social/github.svg"

const GithubOAuthProvider = ({ data }: OAuthProviderProps) => {
  return <OAuthProvider data={data} icon={GithubIcon} invertIcon />
}
export default GithubOAuthProvider
