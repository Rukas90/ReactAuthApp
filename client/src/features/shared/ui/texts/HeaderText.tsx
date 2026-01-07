import type { ReactChildrenProps } from "#types/ui.types"

interface Props extends ReactChildrenProps {}

const HeaderText = ({ children }: Props) => {
  return <h1 className="text-light mb-4">{children}</h1>
}
export default HeaderText
