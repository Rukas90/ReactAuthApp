import * as React from "react"

const IconDesktop = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <title>Desktop</title>
      <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
        <g>
          <rect fillRule="nonzero" x={0} y={0} width={24} height={24}></rect>
          <rect
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            x={3}
            y={4}
            width={18}
            height={13}
            rx={2}
          ></rect>
          <line
            x1={7.5}
            y1={21}
            x2={16.5}
            y2={21}
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          ></line>
          <line
            x1={12}
            y1={17}
            x2={12}
            y2={21}
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          ></line>
        </g>
      </g>
    </svg>
  )
}

export default IconDesktop
