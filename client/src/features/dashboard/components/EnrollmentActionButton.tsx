import { MiniButton } from "@src/features/shared"
import { useTranslation } from "react-i18next"
import Skeleton from "react-loading-skeleton"
import { Link } from "react-router-dom"

interface Props {
  setupLink: string
  isConfigured: boolean
  showSkeleton?: boolean
}
const EnrollmentActionButton = ({
  setupLink,
  isConfigured,
  showSkeleton = false,
}: Props) => {
  const { t } = useTranslation()
  if (showSkeleton) {
    return <Skeleton className="min-w-10 h-full -top-0.5" />
  }
  if (!isConfigured) {
    return (
      <Link to={setupLink}>
        <MiniButton text={t("ADD")} />
      </Link>
    )
  }
  return (
    <Link to={"#"}>
      <MiniButton text={t("EDIT")} />
    </Link>
  )
}
export default EnrollmentActionButton
