"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface FloatingObjProps {
  position: [number, number, number]
  scale: number
  speed: number
  axis: [number, number, number]
  children: React.ReactNode
}

function FloatingObj({ position, scale, speed, axis, children }: FloatingObjProps) {
  const ref = useRef<THREE.Group>(null!)
  const initialY = position[1]

  useFrame((state) => {
    const t = state.clock.elapsedTime
    ref.current.rotation.x = t * speed * axis[0]
    ref.current.rotation.y = t * speed * axis[1]
    ref.current.rotation.z = t * speed * axis[2]
    ref.current.position.y = initialY + Math.sin(t * 0.3 + position[0]) * 0.08
  })

  return (
    <group ref={ref} position={position} scale={scale}>
      {children}
    </group>
  )
}

export default function FloatingObjects() {
  const objects = useMemo(() => [
    { position: [-2.2, 1.0, -0.5] as [number, number, number], scale: 0.08, speed: 0.4, axis: [0.3, 0.5, 0.1] as [number, number, number], type: "octahedron" },
    { position: [2.5, -0.8, 0.3] as [number, number, number], scale: 0.06, speed: 0.5, axis: [0.2, 0.4, 0.3] as [number, number, number], type: "tetrahedron" },
    { position: [-1.5, -1.2, 0.8] as [number, number, number], scale: 0.1, speed: 0.3, axis: [0.4, 0.2, 0.5] as [number, number, number], type: "octahedron" },
    { position: [1.8, 1.3, -1.0] as [number, number, number], scale: 0.05, speed: 0.6, axis: [0.1, 0.6, 0.2] as [number, number, number], type: "box" },
    { position: [-0.8, 1.8, 0.2] as [number, number, number], scale: 0.07, speed: 0.35, axis: [0.5, 0.3, 0.4] as [number, number, number], type: "octahedron" },
    { position: [3.0, 0.3, -0.7] as [number, number, number], scale: 0.04, speed: 0.55, axis: [0.3, 0.5, 0.2] as [number, number, number], type: "tetrahedron" },
  ], [])

  const renderGeometry = (type: string) => {
    switch (type) {
      case "octahedron":
        return <octahedronGeometry args={[1, 0]} />
      case "tetrahedron":
        return <tetrahedronGeometry args={[1, 0]} />
      case "box":
        return <boxGeometry args={[1, 1, 1]} />
      default:
        return <octahedronGeometry args={[1, 0]} />
    }
  }

  return (
    <group>
      {objects.map((obj, i) => (
        <FloatingObj key={i} position={obj.position} scale={obj.scale} speed={obj.speed} axis={obj.axis}>
          <mesh>
            {renderGeometry(obj.type)}
            <meshPhysicalMaterial
              color="#c0b8a8"
              roughness={0.25}
              metalness={0.75}
              transparent
              opacity={0.7}
              emissive="#a09888"
              emissiveIntensity={0.08}
            />
          </mesh>
        </FloatingObj>
      ))}
    </group>
  )
}
