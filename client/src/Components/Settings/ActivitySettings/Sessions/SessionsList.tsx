import React from "react"
import Session from "Components/Session"
import { SessionData } from "Utils/SessionData"

interface Props {
  sessions: SessionData[] | null
  onSessionSelected: (sessionID: string) => void
}

const SessionsList = ({ sessions, onSessionSelected }: Props) => {
  return (
    <>
      <div className="d-flex flex-col gap-4">
        {sessions && sessions.length > 0 ? (
          sessions.map((session) => (
            <Session
              key={session.session_id}
              data={session}
              onSelect={onSessionSelected}
            />
          ))
        ) : (
          <p className="text-center text-secondary">
            {Translate("NO_LOGIN_SESSIONS_FOUND")}
          </p>
        )}
      </div>
    </>
  )
}
export default SessionsList
