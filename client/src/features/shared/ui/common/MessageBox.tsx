import errorIcon from "@icons/misc/error.svg"

interface Props extends Pick<React.ComponentProps<"div">, "children"> {
  isHidden?: boolean
}
const MessageBox = ({ isHidden = true, children }: Props) => {
  return (
    <div
      className={`flex items-center gap-3 text-[0.95rem] bg-red-950 text-gray-200 w-full p-4 transition-transform ${
        isHidden ? "opacity-0 -translate-y-full" : "opacity-100 translate-y-0"
      }`}
    >
      <img className="w-6 h-6 opacity-90" src={errorIcon}></img>
      <p className="p-0 mt-0.5 mx-0 mb-0">{children}</p>
    </div>
  )
}
export default MessageBox
