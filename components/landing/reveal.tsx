"use client"

import { useEffect, useRef, useState, type ComponentPropsWithoutRef, type CSSProperties } from "react"

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)"

function useScrollReveal<T extends HTMLElement>(once: boolean) {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.unobserve(entry.target)
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  return { ref, visible }
}

interface RevealStyleProps {
  delay?: number
  y?: number
  visible: boolean
}

function revealStyle({ delay = 0, y = 42, visible }: RevealStyleProps): CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : `translateY(${y}px)`,
    transition: `opacity 0.9s ${EASE} ${delay}ms, transform 0.9s ${EASE} ${delay}ms`,
    willChange: "opacity, transform",
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
  const { ref, visible } = useScrollReveal<HTMLElement>(once)

  return (
    <section ref={ref} className={className} style={revealStyle({ delay, y, visible })} {...props}>
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
  const { ref, visible } = useScrollReveal<HTMLDivElement>(once)

  return (
    <div
      ref={ref}
      className={className}
      style={revealStyle({ delay, y, visible })}
      {...props}
    >
      {children}
    </div>
  )
}