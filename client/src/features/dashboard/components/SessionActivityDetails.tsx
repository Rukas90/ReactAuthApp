import {
  MiniCancelButton,
  OutlineBoxContainer,
  PlainText,
} from "@features/shared"
import type { SessionDetails } from "@project/shared"
import StatusDot from "./StatusDot"
import { useTranslation } from "react-i18next"
import { formatDate, getLocationDisplay } from "../utils/SessionDisplayUtils"
import DeviceIcon from "./DeviceIcon"
import useSessionRevoke from "../hooks/useSessionRevoke"

interface Props {
  session: SessionDetails
}
const SessionActivityDetails = ({ session }: Props) => {
  const { t } = useTranslation()
  const { city, country } = getLocationDisplay(session.location)
  const { revokeAsync, isRevoking } = useSessionRevoke()

  return (
    <OutlineBoxContainer>
      <div className="flex p-2 items-center">
        <DeviceIcon
          className="size-10 text-stone-500"
          device={session.user_agent.device}
        />
        <div className="flex flex-col grow px-6">
          <PlainText className="font-semibold">
            {city} {session.ip_address}
          </PlainText>
          <div className="flex gap-2">
            <StatusDot className="my-auto" status={session.status} />
            <PlainText>{t(session.status.toUpperCase())}</PlainText>
          </div>
          <PlainText>
            {session.isCurrent ? (
              t("YOUR_CURRENT_SESSION")
            ) : (
              <>
                {t("LAST_ACCESSED_ON")}: {formatDate(session.last_accessed_at)}
              </>
            )}
          </PlainText>
          <PlainText>
            {t("SEEN_IN")} {country}
          </PlainText>
        </div>
        {session.status === "active" && !session.isCurrent && (
          <MiniCancelButton
            text={t("REVOKE")}
            action={() => revokeAsync(session.id)}
            disabled={isRevoking}
          />
        )}
      </div>
    </OutlineBoxContainer>
  )
}
export default SessionActivityDetails
