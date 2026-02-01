import { useTranslation } from "react-i18next"
import NavButton from "./NavButton"

export const SettingsNav = () => {
  const { t } = useTranslation()
  return (
    <ul className="mx-auto flex w-fit gap-10 py-12">
      <NavButton to={"security"}>{t("SECURITY")}</NavButton>
      <NavButton to={"activity"}>{t("ACTIVITY")}</NavButton>
      <NavButton to={"preferences"}>{t("PREFERENCES")}</NavButton>
      <NavButton to={"account"}>{t("ACCOUNT")}</NavButton>
    </ul>
  )
}
export default SettingsNav
