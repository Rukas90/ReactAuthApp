import React, { ReactNode, useState, useEffect } from "react"
import { ClampIndex } from "../utils/Math"

export interface Tab {
  name: string
  view: ReactNode
}
interface Props {
  tabs: Tab[]
  defaultIndex?: number
  disabled?: boolean
  onTabChanged?: (tab: Tab) => void
}

const Navigation = ({
  tabs,
  defaultIndex = 0,
  disabled = false,
  onTabChanged,
}: Props) => {
  const [index, setIndex] = useState(ClampIndex(defaultIndex, tabs))

  useEffect(() => {
    if (onTabChanged) {
      onTabChanged(tabs[index])
    }
  }, [index])
  return (
    <>
      <div className="w-100 d-flex flex-row justify-content-center">
        <ul className="nav nav-underline navigation-component justify-content-start d-flex flex-row gap-5 flex-nowrap overflow-scroll hide-scrollbar">
          {tabs.map((tab, i) => (
            <li
              key={tab.name}
              className={`nav-item fs-5 ${index === i ? "active" : ""}`}
            >
              <a
                className={`nav-link fw-normal text-light ${
                  index === i ? "active" : ""
                }`}
                aria-current="page"
                role="button"
                onClick={
                  disabled
                    ? undefined
                    : () => {
                        setIndex(i)
                        if (onTabChanged) {
                          onTabChanged(tab)
                        }
                      }
                }
              >
                {tab.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
export default Navigation
