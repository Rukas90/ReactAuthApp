import type { ReactNode } from "react"

export type ReactChildrenProps = {
    children?: ReactNode
}
export type GeneralProps = {
    id?: string
    className?: string
    style?: React.CSSProperties
}