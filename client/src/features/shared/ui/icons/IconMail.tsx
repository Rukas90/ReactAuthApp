import * as React from "react"

const IconMail = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="1 0 24 24" {...props}>
      <title />
      <g>
        <g>
          <g>
            <polyline
              fill="none"
              points="4 8.2 12 14.1 20 8.2"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
            <rect
              fill="none"
              height={14}
              rx={2}
              ry={2}
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              width={18}
              x={3}
              y={6.5}
            />
          </g>
        </g>
      </g>
    </svg>
  )
}

export default IconMail
