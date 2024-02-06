import React, { useState, ChangeEvent, KeyboardEvent } from "react"

interface Props {
  onCodeChanged?: (newCode: string) => void
}

const DigitField = ({ onCodeChanged }: Props) => {
  const [digits, setDigits] = useState(Array(6).fill(""))
  const [focused, setFocused] = useState(Array(6).fill(false))

  const handleKeyDown =
    (index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
      if (
        (event.key === "Backspace" ||
          event.key === "Delete" ||
          event.key === "ArrowLeft") &&
        index > 0
      ) {
        shiftFocus(event.target as HTMLInputElement, index, false)
        return
      }
      if (event.key !== "ArrowRight" || index >= digits.length - 1) {
        return
      }
      shiftFocus(event.target as HTMLInputElement, index, true)
    }
  const handleChange =
    (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
      const newDigits = [...digits]
      newDigits[index] = event.target.value.slice(0, 1)

      setDigits(newDigits)

      const updatedCode = newDigits.join("")

      if (onCodeChanged) {
        onCodeChanged(updatedCode)
      }

      const inputValueSet = !!event.target.value
      shiftFocus(event.target, index, inputValueSet)
    }
  const shiftFocus = (
    target: HTMLInputElement,
    index: number,
    shiftNext: boolean
  ) => {
    const newFocusedStates = [...focused]
    newFocusedStates[index] = false

    setTimeout(() => {
      target?.blur()

      const parent = target.parentElement
      const sibling = shiftNext
        ? parent?.nextElementSibling
        : parent?.previousElementSibling
      const otherInput = sibling?.querySelector("input")

      if (otherInput) {
        ;(otherInput as HTMLInputElement).focus()
        newFocusedStates[shiftNext ? index + 1 : index - 1] = true
      }
      setFocused(newFocusedStates)
    }, 0)
  }

  const updateFocus = (index: number, state: boolean) => () => {
    const newFocusedStates = [...focused]
    newFocusedStates[index] = state
    setFocused(newFocusedStates)
  }

  return (
    <div className="d-flex gap-3 position-relative">
      {digits.map((digit, index) => (
        <div
          key={index}
          className={`digit-field w-div-6 position-relative ${
            focused[index] && "focused"
          }`}
        >
          <input
            type="text"
            inputMode="numeric"
            maxLength={2}
            value={digit}
            onChange={handleChange(index)}
            onKeyDown={handleKeyDown(index)}
            onFocus={updateFocus(index, true)}
            onBlur={updateFocus(index, false)}
            className="m-0 p-0 w-100 border-0 bg-clear text-center fs-2 outline-0"
          />
        </div>
      ))}
    </div>
  )
}

export default DigitField
