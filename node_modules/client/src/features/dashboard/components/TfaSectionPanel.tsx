import AuthAppSection from "./AuthAppSection"
import SettingsPanel from "./SettingsPanel"
import SettingsSection from "./SettingsSection"
import TfaSectionHeader from "./TfaSectionHeader"

const TfaSectionPanel = () => {
  return (
    <SettingsPanel>
      <SettingsSection label={<TfaSectionHeader />}>
        <AuthAppSection />
      </SettingsSection>
    </SettingsPanel>
  )
}
export default TfaSectionPanel
