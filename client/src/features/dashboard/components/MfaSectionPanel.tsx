import AuthAppSection from "./AuthAppSection"
import SettingsPanel from "./SettingsPanel"
import SettingsSection from "./SettingsSection"
import MfaSectionHeader from "./MfaSectionHeader"
import { useMfaEnrollments } from "@features/mfa"

const MfaSectionPanel = () => {
  const { isMfaActive, isLoading } = useMfaEnrollments()
  return (
    <SettingsPanel>
      <SettingsSection
        label={
          <MfaSectionHeader isActive={isMfaActive} showSkeleton={isLoading} />
        }
      >
        <AuthAppSection />
      </SettingsSection>
    </SettingsPanel>
  )
}
export default MfaSectionPanel
