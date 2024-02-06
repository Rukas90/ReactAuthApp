import React, { ReactNode } from "react"

interface Props {
  labelID: LocalizableText
  node: ReactNode
}

const WrappedLabeledNode = ({ labelID, node }: Props) => {
  return (
    <div className="d-flex bg-darker rounded gap-2 justify-content-between align-items-start align-items-sm-center letter-spacing-1 flex-col flex-sm-row">
      <div className="w-100 px-4 bg-dark rounded">
        <div className="fs-7 my-auto text-light opacity-75 py-3 w-100 overflow-scroll text-nowrap hide-scrollbar">
          <span>{Translate(labelID)}:</span>
        </div>
      </div>
      <div className="p-2">{node}</div>
    </div>
  )
}
export default WrappedLabeledNode
