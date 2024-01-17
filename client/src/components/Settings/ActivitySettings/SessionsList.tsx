import React from "react"
import Session from "../../Session"
import { SessionData } from "utils/SessionData"

interface Props {
  sessions: SessionData[]
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
          <p>No active sessions found.</p>
        )}
      </div>
    </>
  )
}
export default SessionsList
