"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

const PARTICLE_COUNT = 120

export default function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null!)

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const vel = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 1.8 + Math.random() * 2.5
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
      vel[i * 3] = (Math.random() - 0.5) * 0.002
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.002
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.002
    }
    return { positions: pos, velocities: vel }
  }, [])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    return geo
  }, [positions])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = posAttr.array as Float32Array

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i * 3] += velocities[i * 3] + Math.sin(t * 0.3 + i) * 0.0003
      arr[i * 3 + 1] += velocities[i * 3 + 1] + Math.cos(t * 0.25 + i * 0.5) * 0.0003
      arr[i * 3 + 2] += velocities[i * 3 + 2] + Math.sin(t * 0.2 + i * 0.3) * 0.0002

      const x = arr[i * 3]
      const y = arr[i * 3 + 1]
      const z = arr[i * 3 + 2]
      const dist = Math.sqrt(x * x + y * y + z * z)
      if (dist > 4.5 || dist < 1.5) {
        velocities[i * 3] *= -1
        velocities[i * 3 + 1] *= -1
        velocities[i * 3 + 2] *= -1
      }
    }
    posAttr.needsUpdate = true
    pointsRef.current.rotation.y = t * 0.008
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.015}
        color="#b8b0a4"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
