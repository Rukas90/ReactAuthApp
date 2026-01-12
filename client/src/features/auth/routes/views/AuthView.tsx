import Background from "@auth/components/Background"
import MessageBox from "@shared/ui/common/MessageBox"
import type { ReactNode } from "react"

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
          <MessageBox isHidden={!error}>{error}</MessageBox>
        </div>
      </div>
    </Background>
  )
}
export default AuthView
