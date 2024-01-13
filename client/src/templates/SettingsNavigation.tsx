import React from "react"
import Navigation from "../components/Navigation"
import SecuritySettings from "./SecuritySettings"
import { Tab } from "../components/Navigation"
import { useBusyContext } from "../contexts/BusyProvider"

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
          view: undefined,
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
