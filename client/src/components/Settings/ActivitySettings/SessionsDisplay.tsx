import React, { useState, useEffect } from "react"
import { SessionData } from "utils/SessionData"
import { GET } from "utils/Requests"
import SessionsList from "./SessionsList"
import SessionViewer from "./SessionViewer"

const SessionsDisplay = () => {
  const [sessions, setSessions] = useState<SessionData[]>([])
  const [selected, setSelected] = useState<SessionData | null>(null)

  const sessionSelected = (sessionID: string) => {
    if (!sessions) {
      return
    }
    const index = sessions.findIndex(
      (session) => session.session_id === sessionID
    )

    if (index === -1) {
      return
    }

    const data = sessions.at(index)

    if (!data) {
      return
    }
    setSelected(data)
  }
  useEffect(() => {
    const fetchSessions = async () => {
      const response = await GET("/sessions")

      if (response && response.data) {
        const sessionsArray: SessionData[] = Object.values(
          response.data.sessions
        )
        const sessionID = response.data.user.sessionID

        const currentSession = sessionsArray.find(
          (session) => session.session_id === sessionID
        )
        if (currentSession) {
          currentSession.is_current = true

          sessionsArray.sort((a, b) => {
            if (a.session_id === sessionID) {
              return -1
            }
            if (b.session_id === sessionID) {
              return 1
            }
            return 0
          })
        }
        setSessions(sessionsArray)
      }
    }
    fetchSessions()
  }, [])

  return (
    <>
      {selected ? (
        <SessionViewer session={selected} onBack={() => setSelected(null)} />
      ) : (
        <SessionsList sessions={sessions} onSessionSelected={sessionSelected} />
      )}
    </>
  )
}
export default SessionsDisplay
