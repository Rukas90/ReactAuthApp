import { useEffect, useRef, useState } from "react"
import { TotpSetupContext } from "../contexts/TotpSetupContext"
import { MfaErrorCodes, type TotpData } from "@project/shared"
import { useNavigate } from "react-router-dom"
import { TotpService } from "@features/mfa"
import { toast } from "react-toastify"

const TotpSetupProvider = ({
  children,
}: Pick<React.ComponentProps<"div">, "children">) => {
  const navigate = useNavigate()

  const [data, setData] = useState<TotpData | null>(null)
  const [initialized, setInitialized] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const initStarted = useRef(false)

  const REQUIRED_CODE_LENGTH = 6

  useEffect(() => {
    if (initialized || initStarted.current) {
      return
    }
    initStarted.current = true
    TotpService.getInitData()
      .then((res) => {
        if (res.ok) {
          setData(res.data)
        } else {
          if (res.error.code === MfaErrorCodes.MFA_ALREADY_CONFIGURED) {
            navigate("/dashboard/security")
          }
          setError(res.error.detail)
        }
      })
      .finally(() => setInitialized(true))
  }, [])

  const confirmCode = async (code: string) => {
    const res = await TotpService.confirmSetup({
      code,
    })
    setError(null)

    if (res.ok) {
      navigate("/dashboard/security")
      toast("MFA totp method was verified and configured successfully!")
    } else {
      setError(res.error.detail)
    }
  }

  const cancelSetup = async () => {
    return await TotpService.delete()
  }

  return (
    <TotpSetupContext.Provider
      value={{
        data,
        confirmCode,
        cancelSetup,
        error,
        requiredCodeLength: REQUIRED_CODE_LENGTH,
      }}
    >
      {children}
    </TotpSetupContext.Provider>
  )
}
export default TotpSetupProvider
