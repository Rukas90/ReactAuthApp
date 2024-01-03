import React from "react"
import CustomButton from "./CustomButton"
import TwitterIcon from "../img/icons/social/twitter.png"
import { useTranslation } from "react-i18next"

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
