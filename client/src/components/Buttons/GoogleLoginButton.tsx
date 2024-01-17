import React from "react"
import CustomButton from "./CustomButton"
import GoogleIcon from "img/icons/social/google.png"
import { useTranslation } from "react-i18next"
import { BuildApiUrl } from "utils/Requests"

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
  const { t } = useTranslation()

  const url = BuildApiUrl(`/auth/google${prompt ? "/register" : ""}`)

  return (
    <>
      <CustomButton
        text={t("CONTINUE_WITH_GOOGLE")}
        icon={GoogleIcon}
        link={url}
        extendWidth
      />
    </>
  )
}
export default GoogleLoginButton
