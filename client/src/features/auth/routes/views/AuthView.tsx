import { ErrorBox } from "@features/shared"
import type { ReactNode } from "react"
import { LanguagePicker } from "@src/features/localization"

interface Props {
  children?: ReactNode
  error?: string | null
}
const AuthView = ({ children, error }: Props) => {
  return (
    <div className="relative flex min-w-full min-h-full w-1/2 px-16 py-64 items-start justify-center bg-[#040404]">
      <div className="flex flex-col gap-4 max-w-106.25 items-center text-center">
        {children}
        <ErrorBox isHidden={!error}>{error}</ErrorBox>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <LanguagePicker />
      </div>
    </div>
  )
}
export default AuthView
