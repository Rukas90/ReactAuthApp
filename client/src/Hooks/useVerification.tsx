import { useCallback, useEffect, useRef, useState } from "react"
import {
  EstablishVerification,
  VerificationTemplate,
  VerifyCode,
} from "Utils/Verifications"

export const useVerification = (
  template: VerificationTemplate,
  findByType: boolean
) => {
  const [verificationID, setVerificationID] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEstablishingRef = useRef(false)

  const verify = useCallback(
    async (code: string) => {
      console.log("verify?")
      if (verificationID === null) {
        return
      }
      console.log("verifying")
      try {
        setVerifying(true)
        return await VerifyCode(verificationID, code)
      } finally {
        setVerifying(false)
      }
    },
    [verificationID]
  )

  const establishVerification = useCallback(async () => {
    if (isEstablishingRef.current || verificationID !== null) {
      return
    }
    isEstablishingRef.current = true

    setLoading(true)
    setError(null)

    try {
      const response = await EstablishVerification(template, findByType)

      if (response.success) {
        const newVerificationId = response.data.verificationId
        setVerificationID(newVerificationId)
        console.log(`Established verification id ${newVerificationId}`)
      } else {
        setError(response.error || "Failed to establish verification")
      }
    } finally {
      setLoading(false)
      isEstablishingRef.current = false
    }
  }, [template, findByType])

  useEffect(() => {
    setVerificationID(null)
    setError(null)
  }, [template, findByType])

  // Establish verification when needed
  useEffect(() => {
    if (!verificationID && !loading && !isEstablishingRef.current) {
      establishVerification()
    }
  }, [verificationID, loading, establishVerification])

  const refreshVerification = useCallback(() => {
    setVerificationID(null)
    setError(null)
  }, [])

  return {
    verificationID,
    loading,
    verifying,
    error,
    verify,
    refreshVerification,
  }
}
