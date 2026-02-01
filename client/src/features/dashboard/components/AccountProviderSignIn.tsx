import type { OAuthProvider } from "@project/shared"
import { capitalize, MiniButton, OutlineBoxContainer } from "@features/shared"
import type { ReactNode } from "react"
import { useTranslation } from "react-i18next"

interface Props {
  icon: ReactNode
  provider: OAuthProvider
  username: string
  onDisconnect: (provider: OAuthProvider) => void
  canDisconnect: boolean
}
const AccountProviderSignIn = ({
  icon,
  provider,
  username,
  onDisconnect,
  canDisconnect,
}: Props) => {
  const { t } = useTranslation()
  return (
    <OutlineBoxContainer>
      <div className="flex justify-between items-center">
        <div className="flex flex-row gap-3">
          <div className="text-stone-300 w-4.5 my-auto">{icon}</div>
          <div>
            <p className="text-stone-300 text-sm">{capitalize(provider)}</p>
            <p className="text-stone-500 text-sm">{username}</p>
          </div>
        </div>
        <MiniButton
          text={t("DISCONNECT")}
          action={() => onDisconnect(provider)}
          disabled={!canDisconnect}
        />
      </div>
    </OutlineBoxContainer>
  )
}
export default AccountProviderSignIn
