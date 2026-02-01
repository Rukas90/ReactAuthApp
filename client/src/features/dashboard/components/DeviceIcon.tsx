import type { Device } from "@project/shared"
import IconDesktop from "@src/features/shared/ui/icons/IconDesktop"
import IconMobile from "@src/features/shared/ui/icons/IconMobile"
import IconQuestionMark from "@src/features/shared/ui/icons/IconQuestionMark"
import IconTablet from "@src/features/shared/ui/icons/IconTablet"
import type { SVGProps } from "react"

interface Props extends SVGProps<SVGSVGElement> {
  device: Device
}

const DeviceIcon = ({ device, ...props }: Props) => {
  switch (device) {
    case "Desktop":
      return <IconDesktop {...props} />
    case "Mobile":
      return <IconMobile {...props} />
    case "Tablet":
      return <IconTablet {...props} />
    default:
      return <IconQuestionMark {...props} />
  }
}
export default DeviceIcon
