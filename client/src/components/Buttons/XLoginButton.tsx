import React from "react"
import CustomButton from "./CustomButton"
import TwitterIcon from "img/icons/social/twitter.png"
import { useTranslation } from "react-i18next"
import { BuildApiUrl } from "utils/Requests"

interface Props {
  prompt?: boolean
}

/**
 * XLoginButton Component
 *
 * Renders a button for Twitter login functionality.
 *
 * Utilizes the CustomButton component to create a specialized button for Twitter login.
 */
const XLoginButton = ({ prompt = false }: Props) => {
  const { t } = useTranslation()

  const url = BuildApiUrl(`/auth/twitter${prompt ? "/register" : ""}`)

  return (
    <>
      <CustomButton
        text={t("CONTINUE_WITH_TWITTER")}
        icon={TwitterIcon}
        link={url}
        extendWidth
        disabled
      />
    </>
  )
}
export default XLoginButton
