"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function TechCore() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null!)
  const wireRef = useRef<THREE.Mesh>(null!)

  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1, 6)
    const pos = geo.attributes.position
    const vertex = new THREE.Vector3()
    for (let i = 0; i < pos.count; i++) {
      vertex.fromBufferAttribute(pos, i)
      const noise = Math.sin(vertex.x * 3.2) * 0.04 +
        Math.cos(vertex.y * 2.8) * 0.03 +
        Math.sin(vertex.z * 2.5) * 0.035
      vertex.normalize().multiplyScalar(1 + noise)
      pos.setXYZ(i, vertex.x, vertex.y, vertex.z)
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime

    const pulse = 1 + Math.sin(t * 0.4) * 0.035
    meshRef.current.scale.setScalar(pulse)

    meshRef.current.rotation.y = t * 0.06
    meshRef.current.rotation.x = Math.sin(t * 0.08) * 0.08

    if (wireRef.current) {
      wireRef.current.rotation.y = -t * 0.03
      wireRef.current.rotation.z = Math.sin(t * 0.05) * 0.05
      wireRef.current.scale.setScalar(pulse * 1.12)
    }

    if (materialRef.current) {
      materialRef.current.emissiveIntensity = 0.15 + Math.sin(t * 0.5) * 0.05
    }
  })

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry}>
        <meshPhysicalMaterial
          ref={materialRef}
          color="#c8c4be"
          roughness={0.2}
          metalness={0.7}
          clearcoat={0.6}
          clearcoatRoughness={0.15}
          emissive="#b8a88a"
          emissiveIntensity={0.15}
          transparent
          opacity={0.95}
        />
      </mesh>
      <mesh ref={wireRef} geometry={geometry} scale={1.12}>
        <meshBasicMaterial
          color="#a09888"
          wireframe
          transparent
          opacity={0.06}
        />
      </mesh>
    </group>
  )
}
