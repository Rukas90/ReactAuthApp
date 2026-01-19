import GithubIcon from "@icons/social/github.svg"
import { useTranslation } from "react-i18next"
import PlainButton from "./PlainButton"

const GithubButton = () => {
  const { t } = useTranslation()

  return (
    <PlainButton
      icon={GithubIcon}
      text={t("CONTINUE_WITH_GITHUB")}
      extendWidth
      className="text-neutral-900 bg-stone-100"
      action={() => {
        window.location.href =
          "http://www.127.0.0.1.sslip.io:3000/v1/oauth/github"
      }}
    />
  )
}
export default GithubButton
