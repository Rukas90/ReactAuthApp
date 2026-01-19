import GoogleIcon from "@icons/social/google.svg"
import { useTranslation } from "react-i18next"
import PlainButton from "./PlainButton"

const GoogleButton = () => {
  const { t } = useTranslation()

  return (
    <PlainButton
      icon={GoogleIcon}
      text={t("CONTINUE_WITH_GOOGLE")}
      extendWidth
      className="text-neutral-900 bg-stone-100"
      action={() => {
        window.location.href =
          "http://www.127.0.0.1.sslip.io:3000/v1/oauth/google"
      }}
    />
  )
}
export default GoogleButton
