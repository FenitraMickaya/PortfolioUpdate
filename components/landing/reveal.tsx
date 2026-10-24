"use client"

import { useEffect, useRef, useState, type ComponentPropsWithoutRef, type CSSProperties } from "react"

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)"
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

function getReducedMotionPreference() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia(REDUCED_MOTION_QUERY).matches
  )
}

function useScrollReveal<T extends HTMLElement>(once: boolean) {
  const ref = useRef<T | null>(null)
  const [ready, setReady] = useState(false)
  const [visible, setVisible] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(getReducedMotionPreference)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const mediaQuery = window.matchMedia?.(REDUCED_MOTION_QUERY)
    const updateReducedMotion = () => setReducedMotion(mediaQuery?.matches ?? false)
    updateReducedMotion()
    setReady(true)

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true)
      return () => mediaQuery?.removeEventListener?.("change", updateReducedMotion)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.unobserve(entry.target)
        } else {
          setVisible(false)
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      mediaQuery?.removeEventListener?.("change", updateReducedMotion)
    }
  }, [once])

  return { ref, ready, visible, reducedMotion }
}

interface RevealStyleProps {
  delay?: number
  y?: number
  ready: boolean
  visible: boolean
  reducedMotion: boolean
}

function revealStyle({
  delay = 0,
  y = 42,
  ready,
  visible,
  reducedMotion,
}: RevealStyleProps): CSSProperties | undefined {
  if (!ready) return undefined

  return {
    opacity: visible ? 1 : 0,
    transform: reducedMotion ? "none" : visible ? "translateY(0)" : `translateY(${y}px)`,
    transition: reducedMotion
      ? `opacity 0.2s ease ${delay}ms`
      : `opacity 0.9s ${EASE} ${delay}ms, transform 0.9s ${EASE} ${delay}ms`,
  }
}

interface RevealProps extends ComponentPropsWithoutRef<"section"> {
  delay?: number
  y?: number
  once?: boolean
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 42,
  once = true,
  ...props
}: RevealProps) {
  const { ref, ready, visible, reducedMotion } = useScrollReveal<HTMLElement>(once)

  return (
    <section
      ref={ref}
      className={className}
      style={revealStyle({ delay, y, ready, visible, reducedMotion })}
      {...props}
    >
      {children}
    </section>
  )
}

interface RevealBlockProps extends ComponentPropsWithoutRef<"div"> {
  delay?: number
  y?: number
  once?: boolean
}

export function RevealBlock({
  children,
  className = "",
  delay = 0,
  y = 42,
  once = true,
  ...props
}: RevealBlockProps) {
  const { ref, ready, visible, reducedMotion } = useScrollReveal<HTMLDivElement>(once)

  return (
    <div
      ref={ref}
      className={className}
      style={revealStyle({ delay, y, ready, visible, reducedMotion })}
      {...props}
    >
      {children}
    </div>
  )
}