import React from "react"
import CustomButton from "./CustomButton"
import GoogleIcon from "Img/Icons/Social/google.svg"
import { BuildApiUrl } from "Utils/Requests"

interface Props {
  prompt?: boolean
}

/**
 * GoogleLoginButton Component
 *
 * Renders a button for Google login functionality.
 *
 * This component uses the CustomButton component and passes specific props
 * to render a button tailored for Google login.
 */
const GoogleLoginButton = ({ prompt = false }: Props) => {
  const url = BuildApiUrl(`/auth/google${prompt ? "/register" : ""}`)

  return (
    <>
      <CustomButton
        text={Translate("CONTINUE_WITH_GOOGLE")}
        icon={GoogleIcon}
        link={url}
        extendWidth
      />
    </>
  )
}
export default GoogleLoginButton
