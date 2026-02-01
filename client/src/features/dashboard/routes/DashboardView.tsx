import { ContentContainer, DividerLabel } from "@features/shared"
import NavBar from "../components/NavBar"
import SettingsNav from "../components/SettingsNav"
import { Outlet } from "react-router-dom"
import { useTranslation } from "react-i18next"

const DashboardView = () => {
  const { t } = useTranslation()
  return (
    <ContentContainer>
      <NavBar />
      <DividerLabel className="w-full text-stone-400 text-lg font-medium">
        {t("SETTINGS")}
      </DividerLabel>
      <SettingsNav />
      <Outlet />
    </ContentContainer>
  )
}
export default DashboardView
