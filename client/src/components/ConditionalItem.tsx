import React from "react"
import { ConditionalItemProps } from "../utils/ConditionalItemProps"

const ConditionalItem = <T,>({
  value,
  evaluateFunc,
  conditionText,
}: ConditionalItemProps<T>) => {
  const status = evaluateFunc(value)

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
