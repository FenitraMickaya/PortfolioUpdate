"use client"

import { lazy, Suspense, useEffect, useRef, useState } from "react"

const PlanetSculpture = lazy(() =>
  import("./planet-sculpture").then((module) => ({
    default: module.PlanetSculpture,
  })),
)

const DESKTOP_QUERY = "(min-width: 768px)"
const NEAR_VIEWPORT_ROOT_MARGIN = "320px 0px"

export function DesktopPlanetSculpture({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const mediaQuery = window.matchMedia(DESKTOP_QUERY)
    let isNearViewport = false

    const update = () => {
      setShouldLoad(mediaQuery.matches && isNearViewport)
    }

    const handleMediaChange = () => update()

    mediaQuery.addEventListener("change", handleMediaChange)

    if (typeof IntersectionObserver === "undefined") {
      isNearViewport = true
      update()

      return () => mediaQuery.removeEventListener("change", handleMediaChange)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isNearViewport = entry.isIntersecting
        update()
      },
      { rootMargin: NEAR_VIEWPORT_ROOT_MARGIN },
    )
    observer.observe(container)

    return () => {
      observer.disconnect()
      mediaQuery.removeEventListener("change", handleMediaChange)
    }
  }, [])

  return (
    <div ref={containerRef} className={className} aria-hidden>
      {shouldLoad ? (
        <Suspense fallback={null}>
          <PlanetSculpture className="h-full w-full" />
        </Suspense>
      ) : null}
    </div>
  )
}
