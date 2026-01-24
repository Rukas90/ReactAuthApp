import { SectionText, TagLabel } from "@features/shared"
import { useTranslation } from "react-i18next"
import Skeleton from "react-loading-skeleton"

interface Props {
  isActive: boolean
  showSkeleton?: boolean
}
const MfaSectionHeader = ({ isActive, showSkeleton = false }: Props) => {
  const { t } = useTranslation()
  return (
    <div className="flex justify-between my-auto h-5.5">
      <SectionText>{t("MFA")}</SectionText>
      {showSkeleton ? (
        <Skeleton className="min-w-12 h-full -top-0.5" />
      ) : (
        <TagLabel style={isActive ? "green" : "red"}>
          {isActive ? t("ACTIVE") : t("NOT_ACTIVE")}
        </TagLabel>
      )}
    </div>
  )
}
export default MfaSectionHeader
