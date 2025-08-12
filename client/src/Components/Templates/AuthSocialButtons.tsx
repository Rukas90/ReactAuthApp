import React from "react"
import GoogleLoginButton from "Components/Buttons/GoogleLoginButton"
import GithubLoginButton from "Components/Buttons/GithubLoginButton"
import LabelHorizontalSeparator from "./LabelHorizontalSeparator"
import Spacer from "Components/UI/Spacer"

interface Props {
  prompt?: boolean
}

/**
 * AuthSocialButtons Component
 *
 * Provides social media login options for authentication forms.
 */
const AuthSocialButtons = ({ prompt = false }: Props) => {
  return (
    <>
      <GoogleLoginButton prompt={prompt} />
      <Spacer space={1.5} unit="rem" isVertical />
      <GithubLoginButton />
      <Spacer space={1.5} unit="rem" isVertical />
      <LabelHorizontalSeparator label={Translate("OR")} />
      <Spacer space={1.5} unit="rem" isVertical />
    </>
  )
}
export default AuthSocialButtons
