import React from "react"
import CustomButton from "./CustomButton"
import TwitterIcon from "../img/icons/social/twitter.png"
import { useTranslation } from "react-i18next"

/**
 * XLoginButton Component
 *
 * Renders a button for Twitter login functionality.
 *
 * Utilizes the CustomButton component to create a specialized button for Twitter login.
 */
const XLoginButton = () => {
  const { t } = useTranslation()

  return (
    <>
      <CustomButton
        text={t("CONTINUE_WITH_TWITTER")}
        icon={TwitterIcon}
        link="#"
        extendWidth
      />
    </>
  )
}
export default XLoginButton
