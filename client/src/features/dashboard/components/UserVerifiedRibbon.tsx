import { LinkText, TagLabel } from "@features/shared"
import useUserProfile from "../hooks/useUserProfile"

const UserVerifiedRibbon = () => {
  const { profile, isLoading } = useUserProfile()

  if (isLoading || (profile && profile.verifiedEmail)) {
    return null
  }
  return (
    <div className="relative w-full sm:bg-stone-900 not-sm:bg-linear-to-b not-sm:from-stone-950 not-sm:to-stone-900 p-4 flex sm:flex-row flex-col justify-center items-center gap-2">
      <TagLabel className="animate-pulse">Notice</TagLabel>
      <p className="text-sm font-medium text-stone-200">
        Your account email address has not yet been verified.
      </p>
      <LinkText className="text-sm font-medium" to="">
        Verify now
      </LinkText>
      <div className="absolute w-full bottom-0 left-0 h-px bg-stone-800" />
    </div>
  )
}
export default UserVerifiedRibbon
