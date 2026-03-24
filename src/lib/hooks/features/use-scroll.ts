import { useState, useEffect, useRef } from "react"

export function useScrollThreshold(threshold: number) {
  const [exceeded, setExceeded] = useState(false)
  const ticking = useRef(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true

      window.requestAnimationFrame(() => {
        setExceeded(window.scrollY > threshold)
        ticking.current = false
      })
    }

    onScroll()

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [threshold])

  return exceeded
}