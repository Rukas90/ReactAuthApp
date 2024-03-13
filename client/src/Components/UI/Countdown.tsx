import React, { useState, useEffect } from "react"

interface Props {
  prefixLabel?: string
  timeInMilliseconds: number
  originTime?: Date | null
  onCountdownFinish: () => void
}

const Countdown = ({
  prefixLabel = "",
  timeInMilliseconds = 1000,
  originTime,
  onCountdownFinish,
}: Props) => {
  const calculateRemainingTime = () => {
    if (!originTime) {
      return timeInMilliseconds
    }
    const now = new Date()
    const elapsed = now.getTime() - originTime.getTime()

    return Math.max(timeInMilliseconds - elapsed, 0)
  }
  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime())

  useEffect(() => {
    // Update the countdown every second
    const interval = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime > 1000) {
          return prevTime - 1000
        }
        clearInterval(interval)
        onCountdownFinish()
        return 0
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeInMilliseconds, onCountdownFinish])

  // Format the remaining time into "HH:MM:SS", "MM:SS", or "SS"
  const formatTime = (time: number) => {
    const seconds = Math.floor(time / 1000)
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    let formattedTime = ""

    if (hours > 0) {
      formattedTime += `${hours}h `
    }
    if (minutes > 0 || hours > 0) {
      formattedTime += `${minutes}m `
    }
    formattedTime += `${secs}s`

    return formattedTime
  }
  const displayTime = formatTime(remainingTime)

  return (
    <div className="py-2 px-3 bg-dark">
      {prefixLabel} <strong>{displayTime}</strong>
    </div>
  )
}

export default Countdown
