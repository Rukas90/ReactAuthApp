import React, { useEffect, useState } from "react"
import { useMediaQuery } from "react-responsive"
import { MobileMediaQuery } from "../utils/Utilities"
import CollapsibleContent from "./CollapsibleContent"
import {
  // Utility functions for 2FA operations
  Get2FAState,
  Get2FAInitializeData,
  Verify2FA,
  Deactivate2FA,
} from "../utils/Auth"
import TwoFactorAuthSettingsNode from "../templates/TwoFactorAuthSettingsNode"
import { useBusyContext } from "../contexts/BusyProvider" // Context for managing busy state
import { useDialog } from "../contexts/DialogContext" // Context for managing dialog display
import { useCsrfToken } from "../contexts/CsrfContext"

/**
 * TwoFactorAuthSettings Component
 * Manages the settings for two-factor authentication (2FA) within the application.
 *
 * It fetches and displays the current 2FA state, handles activation/deactivation,
 * and manages the verification process.
 *
 * - Uses custom hooks and contexts for managing state and UI interactions.
 * - Provides a UI for activating 2FA, displaying QR and setup keys, and handling verification.
 * - Utilizes utility functions from '../utils/Auth' for 2FA operations.
 */
const TwoFactorAuthSettings = () => {
  // Component states for 2FA data and UI status
  const [active, setActive] = useState(false)
  const [qr, setQr] = useState("")
  const [key, setKey] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const isMobile = useMediaQuery(MobileMediaQuery)

  const { fetchCsrfToken } = useCsrfToken()

  // Consuming contexts for setting busy state and showing dialog
  const { setBusy } = useBusyContext()
  const { showDialog } = useDialog()

  // Fetch and set the initial 2FA state on component mount
  useEffect(() => {
    const initState = async () => {
      const response = await Get2FAState()

      if (response.success) {
        setActive(response.data)
      }
    }
    initState()
  }, [])

  // Function to activate 2FA
  const activate = async () => {
    const response = await Get2FAInitializeData()

    if (response.success) {
      setQr(response.data.qr_code)
      setKey(response.data.entry_key)
    }
  }

  // Function to deactivate 2FA
  const deactivate = async () => {
    const response = await Deactivate2FA(await fetchCsrfToken())

    if (response.success) {
      setActive(false)
      reset() // Reset 2FA data after deactivation
    }
  }

  // Handler for state changes (activation/deactivation)
  const handleStateChange = async (newState: boolean) => {
    setLoading(true)

    const releaseHandle = setBusy() // Set global busy state

    try {
      newState ? await activate() : await deactivate()

      if (!newState) {
        reset()
      }
    } catch (error) {
      throw error // Rethrow the error for higher-level error handling
    } finally {
      releaseHandle() // Release busy state
      setLoading(false)
    }
  }

  // Verify 2FA code
  const verify = async (code: string) => {
    setLoading(true)

    try {
      const response = await Verify2FA(code, await fetchCsrfToken())

      if (response.success) {
        setActive(true)
      }
    } catch (error) {
      setError("The entered verification code is invalid!")
    } finally {
      setLoading(false)
    }
  }

  // Reset 2FA data
  const reset = () => {
    setError("")
    setQr("")
    setKey("")
  }
  const labelColor = `bg-${active ? "success" : "danger"}`

  return (
    <>
      <CollapsibleContent
        node={
          active ? undefined : (
            <TwoFactorAuthSettingsNode
              qrSrc={qr}
              setupKey={key}
              error={error}
              onVerify={verify}
            />
          )
        }
        id="two-fa-settings"
        label={
          <div className="d-flex row-flex align-items-center">
            {isMobile && (
              <div className={`${labelColor} p-1 me-2 rounded-circle`} />
            )}
            <span>Two-factor authentication</span>
            {!isMobile && (
              <span
                className={`${labelColor} mx-2 fs-9 py-1 px-2 text-light rounded l tracking-wide m-auto`}
              >
                {active ? "Activated" : "Not Activated"}
              </span>
            )}
          </div>
        }
        state={active}
        onStateChange={handleStateChange}
        onBeforeStateChange={(
          newState: boolean,
          callback: (status: boolean) => void
        ) => {
          if (newState || !active) {
            callback(true)
            return
          }
          showDialog({
            title: "2-Step Authentication",
            message:
              "Please confirm the 2-step authentication deactivation request. It is highly recommended to have the 2-step authentication enabled.",
            showCancelBtn: true,
            onCancelCallback: () => callback(false),
            onConfirmCallback: () => callback(true),
          })
        }}
        readonly={loading}
      />
    </>
  )
}
export default TwoFactorAuthSettings
