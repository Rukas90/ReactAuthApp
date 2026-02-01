import { useTranslation } from "react-i18next"

const ActivitySessionsHeader = () => {
  const { t } = useTranslation()
  return (
    <>
      <p>{t("WEB_SESSIONS")}</p>
      <p className="text-stone-500 mt-1">{t("WEB_SESSIONS_DESC")}</p>
    </>
  )
}
export default ActivitySessionsHeader
