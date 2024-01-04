import React from "react"
import { ConditionalItemProps } from "../utils/ConditionalItemProps"

/**
 * ConditionalItem Component
 *
 * Renders an individual list item that visually indicates whether a certain condition is met.
 * It's used as part of a list to display validation rules or similar criteria.
 *
 * Props:
 * - value: The value to be evaluated against the condition.
 * - evaluateFunc: Function to evaluate the condition. Returns true if the condition is met.
 * - conditionText: Text describing the condition.
 *
 * Behavior:
 * - The component uses `evaluateFunc` to determine if the condition is met based on the given `value`.
 * - Changes class based on the condition status to visually indicate validity.
 */
const ConditionalItem = <T,>({
  value,
  evaluateFunc,
  conditionText,
}: ConditionalItemProps<T>) => {
  const status = evaluateFunc(value) // Determines if the condition is met

  return (
    <>
      <li
        className={`list-group-item ${
          status ? "valid text-light" : "invalid opacity-75"
        }`}
      >
        {conditionText}
      </li>
    </>
  )
}
export default ConditionalItem
