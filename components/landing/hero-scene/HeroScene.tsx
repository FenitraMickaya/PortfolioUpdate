"use client"

import { useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import TechCore from "./TechCore"
import OrbitalRings from "./OrbitalRings"
import FloatingParticles from "./FloatingParticles"
import FloatingObjects from "./FloatingObjects"

function MouseParallax() {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })

  useFrame((state) => {
    target.current.x = state.pointer.x * 0.3
    target.current.y = state.pointer.y * 0.2

    mouse.current.x += (target.current.x - mouse.current.x) * 0.02
    mouse.current.y += (target.current.y - mouse.current.y) * 0.02

    camera.position.x = mouse.current.x
    camera.position.y = mouse.current.y
    camera.lookAt(0, 0, 0)
  })

  return null
}

function FloatingGroup({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null!)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    ref.current.position.y = Math.sin(t * 0.25) * 0.08
  })

  return <group ref={ref}>{children}</group>
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 35 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.15} />
      <directionalLight position={[4, 4, 5]} intensity={0.8} color="#f5efe6" />
      <directionalLight position={[-3, 2, 3]} intensity={0.3} color="#e8e0d4" />
      <pointLight position={[0, 0, 0]} intensity={0.4} color="#d4c8b8" distance={5} decay={2} />
      <spotLight
        position={[0, 6, 3]}
        angle={0.35}
        penumbra={0.9}
        intensity={0.5}
        color="#fff8f0"
      />

      <MouseParallax />

      <FloatingGroup>
        <TechCore />
        <OrbitalRings />
        <FloatingParticles />
        <FloatingObjects />
      </FloatingGroup>
    </Canvas>
  )
}
