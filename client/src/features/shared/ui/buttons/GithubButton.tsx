import CustomButton from "./CustomButton"
import GithubIcon from "#icons/social/github.svg"
import { useTranslation } from "react-i18next"

const GithubButton = () => {
  const { t } = useTranslation()

  return (
    <CustomButton
      icon={GithubIcon}
      text={t("CONTINUE_WITH_GITHUB")}
      extendWidth
    />
  )
}
export default GithubButton
