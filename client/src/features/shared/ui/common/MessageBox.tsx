import type React from "react"

interface Props extends React.ComponentProps<"p"> {
  label?: string
}
const MessageBox = ({ label, children }: Props) => {
  return (
    <p className="w-full mt-2 text-center text-stone-300 bg-[#3b3224] rounded-sm p-3 text-sm">
      {label && (
        <>
          <span className="font-semibold">{label}</span>
          <br />
        </>
      )}
      <span>{children}</span>
    </p>
  )
}
export default MessageBox
