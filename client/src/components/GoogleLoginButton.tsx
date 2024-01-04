import React from "react"
import CustomButton from "./CustomButton"
import GoogleIcon from "../img/icons/social/google.png"
import { useTranslation } from "react-i18next"

/**
 * GoogleLoginButton Component
 *
 * Renders a button for Google login functionality.
 *
 * This component uses the CustomButton component and passes specific props
 * to render a button tailored for Google login.
 */
const GoogleLoginButton = () => {
  const { t } = useTranslation()

  return (
    <>
      <CustomButton
        text={t("CONTINUE_WITH_GOOGLE")}
        icon={GoogleIcon}
        link="#"
        extendWidth
      />
    </>
  )
}
export default GoogleLoginButton
