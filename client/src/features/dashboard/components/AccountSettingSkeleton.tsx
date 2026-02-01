import { OutlineBoxContainer } from "@features/shared"
import Skeleton from "react-loading-skeleton"

interface Props {
  doubleLine?: boolean
}
const AccountSettingSkeleton = ({ doubleLine = true }: Props) => {
  return (
    <OutlineBoxContainer>
      <div className="flex justify-between items-center">
        <div className="flex flex-row gap-3 items-center">
          <Skeleton circle className="min-w-6 min-h-6 -top-0.5" />
          <div className="w-36">
            {doubleLine && <Skeleton className="max-w-24" />}
            <Skeleton />
          </div>
        </div>
        <div className="w-9">
          <Skeleton />
        </div>
      </div>
    </OutlineBoxContainer>
  )
}
export default AccountSettingSkeleton
