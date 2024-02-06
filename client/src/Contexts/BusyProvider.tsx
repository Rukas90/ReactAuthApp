import React, { createContext, useState, useContext, useCallback } from "react"

interface BusyContextState {
  setBusy: () => () => void
  isBusy: () => boolean
}

const BusyContext = createContext<BusyContextState>({
  setBusy: () => () => {},
  isBusy: () => false,
})

export const useBusyContext = () => useContext(BusyContext)

interface BusyProviderProps {
  children: React.ReactNode
}

export const BusyProvider = ({ children }: BusyProviderProps) => {
  const [busyCount, setBusyCount] = useState(0)

  const setBusy = useCallback(() => {
    setBusyCount((count) => count + 1)

    return () => {
      setBusyCount((count) => Math.max(0, count - 1))
    }
  }, [])

  const isBusy = useCallback(() => busyCount > 0, [busyCount])

  return (
    <BusyContext.Provider value={{ setBusy: setBusy, isBusy }}>
      {children}
    </BusyContext.Provider>
  )
}
