import { ErrorBox, IconFingerprint, LogoutButton } from "@src/features/shared"
import { Outlet, useNavigate } from "react-router-dom"
import useMfaEnrollments from "../hooks/useMfaEnrollments"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { LanguagePicker } from "@src/features/localization"

export type MfaOutletContext = {
  setError: (message: string | null) => void
}
const MfaAuthView = () => {
  const { t } = useTranslation()
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()
  const { enrollments } = useMfaEnrollments()

  useEffect(() => {
    if (enrollments) {
      navigate(enrollments[0].method)
    }
  }, [enrollments])

  return (
    <div className="relative w-80 h-full mx-auto flex justify-center items-center flex-col">
      <IconFingerprint className="w-10 text-stone-300 mb-6" />
      <h3 className="text-stone-300 text-xl font-semibold mb-6">{t("MFA")}</h3>
      <ErrorBox
        className="w-full"
        visibleClasses="mb-6"
        isHidden={!error}
        onClose={() => setError(null)}
      >
        {error}
      </ErrorBox>
      <Outlet context={{ setError }} />
      <LogoutButton extendWidth className="mt-2" />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <LanguagePicker />
      </div>
    </div>
  )
}
export default MfaAuthView
