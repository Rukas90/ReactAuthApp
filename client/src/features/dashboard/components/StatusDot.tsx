import type { SessionStatus } from "@project/shared"
import clsx from "clsx"

const ColorStyles = {
  active: "bg-green-500 outline-green-950",
  expired: "bg-red-500 outline-red-950",
  revoked: "bg-gray-500 outline-gray-900",
} satisfies Record<SessionStatus, string>

interface Props extends Pick<React.ComponentProps<"div">, "className"> {
  status: SessionStatus
}
const StatusDot = ({ status, className }: Props) => {
  return (
    <div
      className={clsx(
        "rounded-full outline-3 size-2",
        ColorStyles[status],
        className,
      )}
    />
  )
}
export default StatusDot
