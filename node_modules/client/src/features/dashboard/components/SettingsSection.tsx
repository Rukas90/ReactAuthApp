import { SectionText } from "@features/shared"
import type { ReactNode } from "react"

interface Props extends Pick<React.ComponentProps<"div">, "children"> {
  label?: string | ReactNode
  separate?: boolean
}
const SettingsSection = ({ label, separate, children }: Props) => {
  return (
    <>
      {label && (
        <div className="relative bg-stone-900 px-4 py-3">
          {label === typeof "ReactNode" ? (
            label
          ) : (
            <SectionText>{label}</SectionText>
          )}
        </div>
      )}
      <div className="relative">
        {separate && (
          <div className="w-full absolute top-0 left-0 h-px bg-stone-900" />
        )}
        {children}
      </div>
    </>
  )
}
export default SettingsSection
