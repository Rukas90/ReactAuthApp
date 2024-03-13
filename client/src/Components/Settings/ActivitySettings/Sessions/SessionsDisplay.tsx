import React, { useState, useEffect } from "react"
import { SessionData } from "Data/SessionData"
import { GET } from "Utils/Requests"
import SessionViewer from "./SessionViewer"
import SessionsList from "./SessionsList"
import Spinner from "Components/UI/Spinner"

const SessionsDisplay = () => {
  const [sessions, setSessions] = useState<SessionData[] | null>(null)
  const [loading, setLoading] = useState(false)
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
      setLoading(true)

      try {
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
      } finally {
        setLoading(false)
      }
    }
    fetchSessions()
  }, [])

  if (loading) {
    return <Spinner />
  }
  return selected ? (
    <SessionViewer session={selected} onBack={() => setSelected(null)} />
  ) : (
    <SessionsList sessions={sessions} onSessionSelected={sessionSelected} />
  )
}
export default SessionsDisplay
