import { TagLabel } from "@features/shared"
import { useTranslation } from "react-i18next"
import Skeleton from "react-loading-skeleton"

interface Props {
  isConfigured: boolean
  showSkeleton?: boolean
}

const EnrollmentConfiguredTag = ({
  isConfigured,
  showSkeleton = false,
}: Props) => {
  const { t } = useTranslation()
  return showSkeleton ? (
    <Skeleton className="min-w-9 h-full" />
  ) : (
    <TagLabel style="gray">
      {isConfigured ? t("CONFIGURED") : t("NOT_CONFIGURED")}
    </TagLabel>
  )
}
export default EnrollmentConfiguredTag
