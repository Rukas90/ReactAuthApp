import React, { ReactNode, useEffect, useState, useRef } from "react"

interface Props {
  show?: boolean
  speed?: number
  node: ReactNode
}

const FoldableContent = ({ show = false, speed = 0.25, node }: Props) => {
  const [showing, setShowing] = useState(show)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setShowing(show)
  }, [show])

  const height = showing ? `${contentRef.current?.scrollHeight}px` : "0px"
  const transition = `height ${speed}s ease`

  return (
    <div className="smooth-collapse" style={{ height, transition }}>
      <div ref={contentRef}>{node}</div>
    </div>
  )
}
export default FoldableContent
