import React, { useEffect } from "react"
import ConditionalItem from "./ConditionalItem"
import { ValidationGroupCondition } from "Utils/ValidationGroupCondition"

interface Props<T> {
  value: T // Current value to be evaluated
  conditions: ValidationGroupCondition<T>[] // Array of conditions to evaluate against the value
  onValidationStatusChange?: (status: boolean) => void // Callback function when the validation status changes
}

/**
 * ValidationGroup Component
 *
 * Dynamically generates a list of validation conditions and checks if the given value meets these conditions.
 * This component is generic and can be used for various types of values and conditions.
 *
 * Props:
 * - value: The value that needs to be validated.
 * - conditions: An array of conditions, each with an evaluation function and text.
 * - onValidationStatusChange: Optional callback triggered when the overall validation status changes.
 */
const ValidationGroup = <T,>({
  value,
  conditions,
  onValidationStatusChange,
}: Props<T>) => {
  useEffect(() => {
    // Determine if all conditions are met
    const allMet = conditions.every((condition) =>
      condition.evaluateFunc(value)
    )

    // Trigger the callback function if provided
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
    </>
  )
}
export default ValidationGroup
