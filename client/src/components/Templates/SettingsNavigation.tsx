import React from "react"
import Navigation from "../Navigation"
import { SecuritySettings, ActivitySettings } from "../Settings"
import { Tab } from "../Navigation"
import { useBusyContext } from "../../contexts/BusyProvider"

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
          view: undefined,
        },
        {
          name: "Account",
          view: undefined,
        },
      ]}
      disabled={isBusy()}
      onTabChanged={onTabChanged}
    />
  )
}
export default SettingsNavigation
