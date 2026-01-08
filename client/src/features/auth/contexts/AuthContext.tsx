import type { LoginData } from "#auth/db/LoginSchema"
import type { RegisterData } from "#auth/db/RegisterSchema"
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react"
import { AuthService } from "#services/api/AuthService"
import { type AuthStatus } from "#types/auth.types"

interface AuthContextData {
  isLoading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
  status: AuthStatus
  setStatus: Dispatch<SetStateAction<AuthStatus>>
}
const AuthContext = createContext<AuthContextData | undefined>(undefined)

const UNAUTHENTICATED: AuthStatus = {
  state: "unauthenticated",
  isVerified: false,
}

export const AuthProvider = ({ children }: React.ComponentProps<"div">) => {
  const [isLoading, setLoading] = useState<boolean>(false)
  const [status, setStatus] = useState<AuthStatus>(UNAUTHENTICATED)
  return (
    <AuthContext.Provider
      value={{
        isLoading,
        setLoading,
        status,
        setStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider")
  return ctx
}

export const useLogin = () => {
  const { setStatus, setLoading } = useAuthContext()

  const handle = async (data: LoginData) => {
    setLoading(true)
    try {
      const result = await AuthService.login(data)
      if (result.ok) {
        setStatus(result.data.status)
      }
      return result
    } finally {
      setLoading(false)
    }
  }
  return handle
}

export const useRegister = () => {
  const { setStatus, setLoading } = useAuthContext()

  const handle = async (data: RegisterData) => {
    setLoading(true)
    try {
      const result = await AuthService.register(data)
      if (result.ok) {
        setStatus(result.data.status)
      }
      return result
    } finally {
      setLoading(false)
    }
  }
  return handle
}

export const useLogout = () => {
  const { setStatus, setLoading } = useAuthContext()

  const handle = async () => {
    setLoading(true)
    try {
      const result = await AuthService.logout()
      if (result.ok) {
        setStatus(UNAUTHENTICATED)
      }
      return result
    } finally {
      setLoading(false)
    }
  }
  return handle
}

export const useCheckStatus = () => {
  const { setStatus, setLoading } = useAuthContext()

  const handle = async () => {
    setLoading(true)
    try {
      const result = await AuthService.status()
      if (result.ok) {
        setStatus(result.data)
      }
      return result
    } finally {
      setLoading(false)
    }
  }
  return handle
}
