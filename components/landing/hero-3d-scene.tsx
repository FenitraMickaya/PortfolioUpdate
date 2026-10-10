"use client"

import HeroScene from "./hero-scene/HeroScene"

export default function Hero3DScene() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
      <HeroScene />
    </div>
  )
}