import { IconSmartphone } from "@features/shared"
import EnrollmentConfiguredTag from "./EnrollmentConfiguredTag"
import EnrollmentActionButton from "./EnrollmentActionButton"
import { useTranslation } from "react-i18next"
import { useMfaEnrollments } from "@features/mfa"

const AuthAppSection = () => {
  const { t } = useTranslation()
  const { totp, isLoading } = useMfaEnrollments()
  return (
    <div className="flex justify-between p-4">
      <div className="flex gap-2 items-center">
        <IconSmartphone className="w-5 h-5 text-stone-300" />
        <EnrollmentConfiguredTag
          showSkeleton={isLoading}
          isConfigured={totp?.configured ?? false}
        />
        <p className="text-sm text-stone-300">{t("AUTH_APP")}</p>
      </div>
      <EnrollmentActionButton
        setupLink="/totp/setup"
        isConfigured={totp?.configured ?? false}
        showSkeleton={isLoading}
      />
    </div>
  )
}
export default AuthAppSection
