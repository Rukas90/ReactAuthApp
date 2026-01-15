import { IconSmartphone, TagLabel, MiniButton } from "@features/shared"
import { Link } from "react-router-dom"

const AuthAppSection = () => {
  return (
    <div className="flex justify-between p-4">
      <div className="flex gap-2 items-center">
        <IconSmartphone className="w-5 h-5 text-stone-300" />
        <TagLabel style="gray">Not Configured</TagLabel>

        <p className="text-sm text-stone-300">Authenticator app</p>
      </div>
      <Link to="/totp/setup">
        <MiniButton text="Add" />
      </Link>
    </div>
  )
}
export default AuthAppSection
