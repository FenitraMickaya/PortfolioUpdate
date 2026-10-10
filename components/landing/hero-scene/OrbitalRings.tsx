"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface RingProps {
  radius: number
  tube: number
  rotation: [number, number, number]
  speed: number
  color: string
  opacity: number
  arc?: number
}

function Ring({ radius, tube, rotation, speed, color, opacity, arc = 1 }: RingProps) {
  const ref = useRef<THREE.Mesh>(null!)

  const geometry = useMemo(() => {
    return new THREE.TorusGeometry(radius, tube, 16, 100, arc * Math.PI * 2)
  }, [radius, tube, arc])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    ref.current.rotation.x = rotation[0] + t * speed * 0.15
    ref.current.rotation.y = rotation[1] + t * speed * 0.1
    ref.current.rotation.z = rotation[2] + Math.sin(t * 0.2) * 0.02
  })

  return (
    <mesh ref={ref} geometry={geometry}>
      <meshPhysicalMaterial
        color={color}
        roughness={0.3}
        metalness={0.8}
        transparent
        opacity={opacity}
        emissive={color}
        emissiveIntensity={0.05}
      />
    </mesh>
  )
}

export default function OrbitalRings() {
  const rings: RingProps[] = [
    { radius: 1.6, tube: 0.008, rotation: [0.4, 0, 0.2], speed: 0.6, color: "#b8b0a4", opacity: 0.45 },
    { radius: 2.0, tube: 0.006, rotation: [1.1, 0.3, 0], speed: -0.4, color: "#a8a098", opacity: 0.35, arc: 0.75 },
    { radius: 2.4, tube: 0.01, rotation: [0.2, 0.8, 0.1], speed: 0.3, color: "#c0b8ac", opacity: 0.3 },
    { radius: 1.3, tube: 0.005, rotation: [1.4, 0.5, 0.3], speed: -0.7, color: "#b0a898", opacity: 0.4, arc: 0.6 },
    { radius: 2.8, tube: 0.007, rotation: [0.6, 1.2, 0], speed: 0.2, color: "#a09888", opacity: 0.2, arc: 0.85 },
  ]

  return (
    <group>
      {rings.map((ring, i) => (
        <Ring key={i} {...ring} />
      ))}
    </group>
  )
}
