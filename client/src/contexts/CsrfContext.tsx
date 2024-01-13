import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react"
import { GetCSRFToken } from "../utils/Auth"

interface CsrfContextType {
  csrfToken: string
  fetchCsrfToken: (refresh?: boolean) => Promise<string>
}

const defaultState: CsrfContextType = {
  csrfToken: "",
  fetchCsrfToken: async () => {
    return ""
  },
}

export const CsrfContext = createContext<CsrfContextType>(defaultState)

interface CsrfProviderProps {
  children: ReactNode
}

export const CsrfProvider: React.FC<CsrfProviderProps> = ({ children }) => {
  const [csrfToken, setCsrfToken] = useState<string>("")

  const fetchCsrfToken = useCallback(
    async (refresh: boolean = false) => {
      if (refresh || !csrfToken) {
        const response = await GetCSRFToken()
        setCsrfToken(response.data)

        return response.data
      }
      return csrfToken
    },
    [csrfToken]
  )

  return (
    <CsrfContext.Provider value={{ csrfToken, fetchCsrfToken }}>
      {children}
    </CsrfContext.Provider>
  )
}

export const useCsrfToken = (): CsrfContextType => {
  const context = useContext(CsrfContext)
  if (!context) {
    throw new Error("useCsrfToken must be used within a CsrfProvider")
  }
  return context
}
