import React, { useState, useEffect, ReactNode, useRef } from "react"
import Spacer from "./Spacer"
import { Clamp01 } from "Utils/Math"
import { OnValueChangeValidationHook } from "Data/OnValueChangeValidationHook"

interface Props {
  node: ReactNode // Content to display when the collapsible is expanded
  id: string // Identifier for the collapsible element
  label?: ReactNode // Label for the collapsible content
  state: boolean // Controlled state of collapsible (expanded/collapsed)
  onStateChange?: (newState: boolean) => void // Callback when state changes
  onBeforeStateChange?: OnValueChangeValidationHook<boolean> // Hook to intercept state change
  readonly?: boolean // If true, prevents interaction with the collapsible
}

/**
 * CollapsibleContent Component
 * Renders a section of content that can be shown or hidden based on a toggle switch.
 * Useful for settings or information that need to be collapsed to save space.
 *
 * Props:
 * - node: The content to be shown or hidden.
 * - id: Unique identifier for the collapsible element.
 * - label: Display label for the collapsible content.
 * - state: The initial and controlled state of the collapsible (expanded/collapsed).
 * - onStateChange: Callback triggered when the state changes.
 * - onBeforeStateChange: Hook function called before the state changes.
 * - readonly: If true, the collapsible cannot be interacted with.
 */
const CollapsibleContent = ({
  node,
  id,
  label = "No Label",
  state = false,
  onStateChange,
  onBeforeStateChange,
  readonly = false,
}: Props) => {
  const [enabled, setEnabled] = useState(state)
  const [fadeOpacityPercentage, setFadeOpacityPercentage] = useState(0.0)
  const ref = useRef(null)

  const updateFadeEffect = () => {
    if (ref.current) {
      const { scrollLeft, clientWidth, scrollWidth } = ref.current

      const maxScrollX = scrollWidth - clientWidth
      const scrollXPercentage = maxScrollX ? scrollLeft / maxScrollX : 0
      const threshold = 5

      setFadeOpacityPercentage(
        Clamp01(scrollXPercentage + (1.0 - Clamp01(maxScrollX / threshold)))
      )
    }
  }
  useEffect(() => {
    setEnabled(state)
    updateFadeEffect()
  }, [state])

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      updateFadeEffect()
    })

    if (ref.current) {
      resizeObserver.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        resizeObserver.disconnect()
      }
    }
  }, [])

  // Handle state change events from the checkbox
  const updateState = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newState = event.target.checked

    if (readonly) {
      return
    }
    // Call the onBeforeStateChange hook if provided
    if (onBeforeStateChange) {
      onBeforeStateChange(newState, (status) => {
        if (!status) {
          setEnabled(!newState)
          return
        }
        toState(newState)
      })
      return
    }
    toState(newState)
  }

  // Update state and call the onStateChange callback
  const toState = (newState: boolean) => {
    setEnabled(newState)

    if (onStateChange) {
      onStateChange(newState)
    }
  }
  const toggleStyle = {
    minWidth: "50px",
    height: "22px",
  }
  const fadeStyle = {
    opacity: 1.0 * (1.0 - fadeOpacityPercentage),
  }
  return (
    <>
      <div className="form-check form-switch d-flex w-100 py-3 px-4 rounded bg-dark m-auto flex-col">
        <div className="position-relative d-flex gap-4 align-items-center justify-content-between w-100">
          <div className="position-relative overflow-hidden">
            <div
              ref={ref}
              className="overflow-scroll hide-scrollbar"
              onScroll={updateFadeEffect}
            >
              <span className="form-check-label text-secondary align-middle text-nowrap mr-2">
                {label}
              </span>
            </div>
            <div
              className="position-absolute h-100 px-3 end-0 top-0 left-fade"
              style={fadeStyle}
            />
          </div>
          <div
            className="d-flex position-relative align-items-center"
            style={toggleStyle}
          >
            <input
              className="form-check-input position-absolute m-0"
              type="checkbox"
              role="switch"
              checked={enabled}
              id={id}
              style={toggleStyle}
              onChange={updateState}
              readOnly={readonly}
            />
          </div>
        </div>
        {enabled && node && (
          <div className="scale-0">
            <Spacer space={1.0} unit="rem" isVertical />
            <div className="bg-toggle-settings p-2 rounded">{node}</div>
            <Spacer space={0.5} unit="rem" isVertical />
          </div>
        )}
      </div>
    </>
  )
}
export default CollapsibleContent
