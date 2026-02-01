import clsx from "clsx"

interface Props extends React.ComponentProps<"span"> {
  code: string
}
const IconFlag = ({ code, className, ...props }: Props) => {
  return (
    <span
      {...props}
      className={clsx("fi", `fi-${code.toLocaleLowerCase()}`, className)}
    />
  )
}
export default IconFlag
