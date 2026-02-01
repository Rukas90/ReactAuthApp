import { useLayoutEffect, useRef, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { IconArrowDown } from "../icons"
import clsx from "clsx"
import { DropdownContext } from "./contexts/DropdownContext"

interface Props extends Pick<React.ComponentProps<"div">, "children"> {
  label: ReactNode | string
}
const DropdownMenu = ({ label, children }: Props) => {
  const [showing, setShowing] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 })

  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const updatePosition = () => {
    if (!buttonRef.current) {
      return
    }
    const rect = buttonRef.current.getBoundingClientRect()

    const menuHeight = menuRef.current?.offsetHeight || 200
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top

    const openUpward = spaceBelow < menuHeight && spaceAbove > spaceBelow

    setPosition({
      top: openUpward ? rect.top - menuHeight : rect.bottom,
      left: rect.left,
      width: rect.width,
    })
  }
  const closeMenu = () => setShowing(false)

  const handleClickAway = (e: MouseEvent) => {
    if (
      buttonRef.current &&
      !buttonRef.current.contains(e.target as Node) &&
      menuRef.current &&
      !menuRef.current.contains(e.target as Node)
    ) {
      closeMenu()
    }
  }
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      closeMenu()
    }
  }
  useLayoutEffect(() => {
    if (!showing) {
      return
    }
    updatePosition()

    setTimeout(() => {
      document.addEventListener("mousedown", handleClickAway)
      document.addEventListener("keydown", handleEscape)
      window.addEventListener("resize", updatePosition)
      window.addEventListener("blur", closeMenu)
    }, 0)

    return () => {
      document.removeEventListener("mousedown", handleClickAway)
      document.removeEventListener("keydown", handleEscape)
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("blur", closeMenu)
    }
  }, [showing])

  const toggleMenu = () => setShowing((prev) => !prev)

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className={clsx(
          "flex gap-1 items-center cursor-pointer px-2 py-1.25 rounded-md transition-colors",
          "text-stone-300 bg-stone-800 hover:bg-[#302b2a] active:bg-[#201d1c]",
        )}
      >
        {label}
        <IconArrowDown
          className={clsx(
            "text-stone-300 size-6 transition-transform",
            showing && "-rotate-180",
          )}
        />
      </button>
      {showing &&
        createPortal(
          <DropdownContext.Provider value={{ close: closeMenu }}>
            <div
              ref={menuRef}
              className={clsx(
                "flex flex-col absolute bg-stone-800 rounded-md shadow-lg border border-stone-700 py-1 min-w-40 max-w-full opacity-0 transition-transform -translate-y-full",
                showing && "opacity-100 translate-y-0",
              )}
              style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                minWidth: `${position.width}px`,
                zIndex: 9999,
              }}
            >
              {children}
            </div>
          </DropdownContext.Provider>,
          document.body,
        )}
    </>
  )
}
export default DropdownMenu
