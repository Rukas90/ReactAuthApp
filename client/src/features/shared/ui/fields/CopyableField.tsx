import { useEffect, useState } from "react"
import { IconButton } from "../buttons"
import { IconCopy, VisibilityToggleIcon } from "../icons"

interface Props extends Pick<React.ComponentProps<"input">, "id" | "name"> {
  value?: string
  readOnly?: boolean
  isHidden?: boolean
}
const CopyableField = ({ id, name, value, readOnly, isHidden }: Props) => {
  const [hidden, setHidden] = useState(isHidden)
  const [text, setText] = useState("")

  useEffect(() => {
    setText(value ?? "")
  }, [value])

  return (
    <div className="flex w-full max-w-full gap-2 px-3 py-2 rounded-sm bg-stone-800">
      <input
        id={id}
        name={name}
        className="text-stone-300 w-full text-sm text-center overflow-hidden"
        value={text}
        onChange={(e) => setText(e.target.value)}
        readOnly={readOnly}
        type={hidden ? "password" : "text"}
      />
      <VisibilityToggleIcon isHidden={hidden} onToggled={setHidden} />
      <IconButton
        className="w-5 text-stone-400 hover:text-stone-300 active:text-stone-500 transition"
        icon={<IconCopy />}
        label="Copy_SetupKey"
      />
    </div>
  )
}
export default CopyableField
