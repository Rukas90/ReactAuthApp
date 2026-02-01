import { useEffect, useRef, useState } from "react"

const useStateTimeout = () => {
  const [state, setState] = useState(true)
  const timeoutRef = useRef<number | null>(null)

  const clear = () => {
    if (!timeoutRef.current) {
      return
    }
    clearTimeout(timeoutRef.current)
    timeoutRef.current = null
  }

  const beginTimeout = (timeMs: number) => {
    clear()

    setState(false)
    timeoutRef.current = setTimeout(() => {
      setState(true)
    }, timeMs)
  }
  const stopTimeout = () => {
    clear()
    setState(true)
  }
  useEffect(() => {
    return () => {
      stopTimeout()
    }
  }, [])

  return {
    beginTimeout,
    stopTimeout,
    state,
  }
}
export default useStateTimeout
