import SettingsPanel from "../components/SettingsPanel"
import SettingsSection from "../components/SettingsSection"
import useUserSessions from "../hooks/useUserSessions"
import SessionActivityDetails from "../components/SessionActivityDetails"
import ActivitySessionsHeader from "../components/ActivitySessionsHeader"

const ActivitySettings = () => {
  const { sessions } = useUserSessions()

  if (!sessions) {
    return
  }
  return (
    <SettingsPanel>
      <SettingsSection label={<ActivitySessionsHeader />}>
        {sessions.map((session, index) => (
          <div key={session.id}>
            <SessionActivityDetails session={session} />
            {index !== sessions.length && (
              <div className="w-full h-px bg-stone-900" />
            )}
          </div>
        ))}
      </SettingsSection>
    </SettingsPanel>
  )
}
export default ActivitySettings
