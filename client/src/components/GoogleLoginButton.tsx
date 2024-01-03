import React from "react"
import CustomButton from "./CustomButton"
import GoogleIcon from "../img/icons/social/google.png"
import { useTranslation } from "react-i18next"

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
