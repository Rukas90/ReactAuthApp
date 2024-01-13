import React, { useState, ReactNode } from "react"
import useAuthCheck from "../hooks/useAuthCheck"
import LoadingScreen from "../templates/LoadingScreen"
import { useTranslation } from "react-i18next"
import Spacer from "../templates/Spacer"
import SettingsNavigation from "../templates/SettingsNavigation"
import MainHeader from "../templates/MainHeader"
import LabelHorizontalSeparator from "../templates/LabelHorizontalSeparator"
import { TextSizeOption } from "../utils/TextSizeOption"
import { SpacerProps } from "../props/SpacerProps"

const HomeView = () => {
  const [settings, setSettings] = useState<ReactNode>(undefined) // <-- FIX
  const authCheck = useAuthCheck()
  const { t } = useTranslation()

  if (authCheck.isLoading) {
    return <LoadingScreen />
  }
  const headerSpacer: SpacerProps = {
    space: 1.5,
    unit: "rem",
    isVertical: true,
  }
  return (
    <>
      <div className="w-100 d-flex h-min-100vh justify-content-center bg-settings">
        <div className="w-100 px-3 px-md-4 py-2 py-md-4 mx-auto h-100 d-flex align-items-center flex-col constraint-body-container">
          <MainHeader />
          <LabelHorizontalSeparator
            label={t("SETTINGS")}
            borderColor="secondary"
            textSize={TextSizeOption.Medium}
            topSpacer={headerSpacer}
            bottomSpacer={headerSpacer}
          />
          <Spacer space={0.5} unit="rem" isVertical />
          <div className="d-flex align-items-center justify-content-between w-100">
            <SettingsNavigation onTabChanged={(tab) => setSettings(tab.view)} />
          </div>
          <Spacer space={3.0} unit="rem" isVertical />
          <div className="w-100 flex-grow-1 vstack">{settings}</div>
        </div>
      </div>
    </>
  )
}

export default HomeView
