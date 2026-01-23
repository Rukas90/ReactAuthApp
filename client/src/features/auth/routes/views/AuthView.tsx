import { ErrorBox } from "@features/shared"
import type { ReactNode } from "react"
import Background from "../../components/Background"

interface Props {
  children?: ReactNode
  error?: string | null
}
const AuthView = ({ children, error }: Props) => {
  return (
    <Background>
      <div className="min-w-137.5 w-1/2 p-16 grow bg-black">
        <div className="flex w-full flex-col gap-4 max-w-106.25 mx-auto items-center text-center">
          {children}
          <ErrorBox isHidden={!error}>{error}</ErrorBox>
        </div>
      </div>
    </Background>
  )
}
export default AuthView
