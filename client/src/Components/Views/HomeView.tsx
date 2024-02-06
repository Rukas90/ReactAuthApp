import React, { useState, ReactNode } from "react"
import useAuthCheck from "Hooks/useAuthCheck"
import Spinner from "Components/Spinner"
import Spacer from "Components/Spacer"
import SettingsNavigation from "Templates/SettingsNavigation"
import MainHeader from "Templates/MainHeader"
import LabelHorizontalSeparator from "Templates/LabelHorizontalSeparator"
import { TextSizeOption } from "Utils/Types/TextSizeOption"
import { SpacerProps } from "Components/Props/SpacerProps"

const HomeView = () => {
  const [settings, setSettings] = useState<ReactNode>(null)
  const auth = useAuthCheck()

  const settingsLabel = Translate("SETTINGS")

  if (auth.isLoading) {
    return <Spinner />
  }
  if (!auth.authorized) {
    return <></>
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
            label={settingsLabel}
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
