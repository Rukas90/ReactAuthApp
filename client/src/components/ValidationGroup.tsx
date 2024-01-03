import React, { useEffect } from "react"
import Spacer from "../templates/Spacer"
import ConditionalItem from "./ConditionalItem"
import { ValidationGroupCondition } from "../utils/ValidationGroupCondition"

interface Props<T> {
  value: T
  conditions: ValidationGroupCondition<T>[]
  onValidationStatusChange?: (status: boolean) => void
}

const ValidationGroup = <T,>({
  value,
  conditions,
  onValidationStatusChange,
}: Props<T>) => {
  useEffect(() => {
    const allMet = conditions.every((condition) =>
      condition.evaluateFunc(value)
    )
    if (onValidationStatusChange) {
      onValidationStatusChange(allMet)
    }
  }, [value, conditions, onValidationStatusChange])
  return (
    <>
      <div className="w-100">
        <ul className="text-secondary lh-lg list-group">
          {conditions.map((condition, index) => (
            <ConditionalItem
              key={index}
              value={value}
              evaluateFunc={condition.evaluateFunc}
              conditionText={condition.conditionText}
            />
          ))}
        </ul>
      </div>
      <Spacer space={1.5} unit="rem" isVertical />
    </>
  )
}
export default ValidationGroup
