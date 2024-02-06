import { useEffect, useState } from "react"

type EffectProperties = {
  effectType?: "fade" | "slide"
  effectSpeed?: number // in milliseconds
  startVisible?: boolean
  showEffectInitially?: boolean
}

const useVisualEffect = ({
  effectType = "slide",
  effectSpeed = 250,
  startVisible = false,
  showEffectInitially = true,
}: EffectProperties) => {
  const [visible, setVisible] = useState(startVisible)

  useEffect(() => {
    if (showEffectInitially) {
      setVisible(true)
    }
  }, [effectSpeed, showEffectInitially])

  const effectStyle = () => {
    switch (effectType) {
      case "slide":
        return {
          transform: visible ? "translateY(0)" : "translateY(-100%)",
          opacity: visible ? 1 : 0,
          transition: `transform ${effectSpeed}ms ease-out, opacity ${effectSpeed}ms ease-out`,
        }
      case "fade":
      default:
        return {
          opacity: visible ? 1 : 0,
          transition: `opacity ${effectSpeed}ms ease-out`,
        }
    }
  }

  return effectStyle
}

export default useVisualEffect
export type { EffectProperties }
