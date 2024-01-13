import React from "react"
import GoogleLoginButton from "../components/GoogleLoginButton"
import XLoginButton from "../components/XLoginButton"
import LabelHorizontalSeparator from "./LabelHorizontalSeparator"
import Spacer from "./Spacer"
import { useTranslation } from "react-i18next"

interface Props {
  prompt?: boolean
}

/**
 * AuthSocialButtons Component
 *
 * Provides social media login options for authentication forms.
 */
const AuthSocialButtons = ({ prompt = false }: Props) => {
  const { t } = useTranslation()

  return (
    <>
      <GoogleLoginButton prompt={prompt} />
      <Spacer space={1.5} unit="rem" isVertical />
      <XLoginButton prompt={prompt} />
      <Spacer space={1.5} unit="rem" isVertical />
      <LabelHorizontalSeparator label={t("OR")} />
      <Spacer space={1.5} unit="rem" isVertical />
    </>
  )
}
export default AuthSocialButtons
