import { useEffect, useRef, useState } from "react"
import { TotpSetupContext } from "../contexts/TotpSetupContext"
import { type TotpData } from "@project/shared"
import TotpService from "../services/TotpService"

const TotpSetupProvider = ({
  children,
}: Pick<React.ComponentProps<"div">, "children">) => {
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
          setError(res.error.detail)
        }
      })
      .finally(() => setInitialized(true))
  }, [])

  const verifyCode = async (code: string) => {
    const res = await TotpService.verifyCode(code)
    console.log(JSON.stringify(res))

    setError(null)

    if (res.ok) {
      // Activate totp mfa enrollment ...
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
        verifyCode,
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
