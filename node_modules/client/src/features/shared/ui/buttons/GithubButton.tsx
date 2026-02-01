import { useTranslation } from "react-i18next"
import PlainButton from "./PlainButton"
import { IconGithub } from "../icons"

const GithubButton = () => {
  const { t } = useTranslation()

  return (
    <PlainButton
      icon={<IconGithub className="w-5 mr-2" />}
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
