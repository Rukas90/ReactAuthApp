import CustomButton from "./CustomButton"
import GoogleIcon from "@icons/social/google.svg"
import { useTranslation } from "react-i18next"

const GoogleButton = () => {
  const { t } = useTranslation()

  return (
    <CustomButton
      icon={GoogleIcon}
      text={t("CONTINUE_WITH_GOOGLE")}
      extendWidth
    />
  )
}
export default GoogleButton
