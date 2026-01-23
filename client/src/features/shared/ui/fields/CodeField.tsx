import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react"

interface Props extends Pick<React.ComponentProps<"input">, "name" | "id"> {
  digits?: number
  onCodeChanged?: (code: string) => void
  onCompleted?: (code: string) => void
  allowedPattern?: RegExp
  placeholder?: string
}
const CodeField = ({
  name,
  id,
  digits = 6,
  onCodeChanged,
  onCompleted,
  allowedPattern = /^[0-9]$/,
  placeholder = "X",
}: Props) => {
  const [values, setValues] = useState<string[]>([])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const hiddenInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setValues(new Array(digits).fill(""))
    inputRefs.current = new Array(digits).fill(null)
  }, [digits])

  const onValueChanged = (
    index: number,
    evt: ChangeEvent<HTMLInputElement>,
  ) => {
    const newValue = evt.target.value
    let value = validateValue(newValue)

    setInputValue(index, value)

    if (newValue) {
      selectInput(index + 1)
    }
    deselectInput(index)
  }
  const setInputValue = (index: number, value: string) => {
    setValues((v) => {
      const newValues = [...v]
      newValues[index] = value

      const newCode = newValues.join("")
      onCodeChanged?.(newCode)

      if (newCode.length === digits) {
        onCompleted?.(newCode)
      }
      return newValues
    })
  }
  const validateValue = (value: string): string => {
    if (!value || !allowedPattern.test(value)) {
      return ""
    }
    return value
  }
  const handleKeyDown = (
    index: number,
    evt: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (evt.key === values[index].toString()) {
      evt.preventDefault()
      deselectInput(index)
      selectInput(index + 1)
      return
    }
    if (evt.key === "Backspace" || evt.key === "Delete") {
      setInputValue(index, "")
    }
    if (
      evt.key === "Backspace" ||
      evt.key === "Delete" ||
      evt.key === "ArrowLeft"
    ) {
      selectInput(index - 1)
    }
    if (evt.key === "ArrowRight") {
      selectInput(index + 1)
    }
  }
  const deselectInput = (index: number) => {
    const input = inputRefs.current[index]
    input!!.blur()
  }
  const selectInput = (index: number) => {
    let newIndex = index

    if (newIndex < 0) {
      newIndex = 0
    }
    if (newIndex >= digits) {
      newIndex = digits - 1
    }
    const input = inputRefs.current[newIndex]
    input!!.focus()
  }
  const handleClick = (evt: MouseEvent<HTMLInputElement>) => {
    evt.currentTarget.select()
  }
  const handleHiddenInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const code = evt.target.value

    const newValues = code.split("").slice(0, digits)

    while (newValues.length < digits) {
      newValues.push("")
    }
    setValues(newValues)

    if (onCodeChanged) {
      onCodeChanged(newValues.join(""))
    }
    selectInput(0)
  }

  return (
    <div className="relative">
      <input
        ref={hiddenInputRef}
        type="text"
        id={id}
        name={name}
        autoComplete="one-time-code"
        inputMode="numeric"
        data-lpignore="false"
        className="absolute opacity-0 pointer-events-none"
        tabIndex={-1}
        onChange={handleHiddenInputChange}
        aria-hidden="true"
      />
      <div className="flex">
        {values.map((value, index) => (
          <input
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            name={`digit-${index}`}
            id={`digit-${index}`}
            key={`CodeField_Value_${index}`}
            className="w-8 mx-1 rounded-sm text-center p-1.5 text-stone-300 bg-stone-800 hover:bg-stone-700 focus:bg-stone-700 outline-amber-400 focus:outline-2 transition"
            value={value}
            placeholder={placeholder}
            type="text"
            onFocus={(e) => e.target.select()}
            maxLength={2}
            onChange={(c) => {
              onValueChanged(index, c)
            }}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onClick={handleClick}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            data-lpignore="true"
            data-bwignore="true"
          />
        ))}
      </div>
    </div>
  )
}
export default CodeField
