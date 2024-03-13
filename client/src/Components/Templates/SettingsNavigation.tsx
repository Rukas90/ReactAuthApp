import React from "react"
import Navigation from "Components/Templates/Navigation"
import {
  SecuritySettings,
  ActivitySettings,
  PreferencesSettings,
  AccountSettings,
} from "Components/Settings"
import { Tab } from "Components/Templates/Navigation"
import { useBusyContext } from "Contexts/BusyProvider"

interface Props {
  onTabChanged?: (tab: Tab) => void
}

const SettingsNavigation = ({ onTabChanged }: Props) => {
  const { isBusy } = useBusyContext()

  return (
    <Navigation
      tabs={[
        {
          name: "Security",
          view: <SecuritySettings />,
        },
        {
          name: "Activity",
          view: <ActivitySettings />,
        },
        {
          name: "Preferences",
          view: <PreferencesSettings />,
        },
        {
          name: "Account",
          view: <AccountSettings />,
        },
      ]}
      disabled={isBusy()}
      onTabChanged={onTabChanged}
    />
  )
}
export default SettingsNavigation
