"use client"

import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, Float } from "@react-three/drei"
import * as THREE from "three"

function useIsMobile() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)")
    const update = () => setMobile(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  return mobile
}

interface RingConfig {
  radius: number
  tube: number
  tilt: [number, number, number]
  spin: number
  opacity: number
  ellipse?: [number, number, number]
}

const RINGS: RingConfig[] = [
  { radius: 1.42, tube: 0.012, tilt: [1.15, 0.35, 0.2], spin: 0.1, opacity: 0.3 },
  { radius: 1.74, tube: 0.009, tilt: [0.8, -0.7, 0.3], spin: -0.13, opacity: 0.22 },
  { radius: 2.04, tube: 0.007, tilt: [-0.5, 0.5, -0.4], spin: 0.16, opacity: 0.16 },
  { radius: 2.36, tube: 0.006, tilt: [0.3, 0.95, 0.35], spin: -0.09, opacity: 0.12, ellipse: [1.18, 1, 1] },
]

interface Orbiter {
  frame: number
  r: number
  speed: number
  phase: number
  size: number
  glow?: boolean
}

const ORBITERS: Orbiter[] = [
  { frame: 0, r: 1.46, speed: 0.5, phase: 0.0, size: 0.1 },
  { frame: 0, r: 1.36, speed: -0.42, phase: 1.3, size: 0.07, glow: true },
  { frame: 1, r: 1.78, speed: 0.34, phase: 2.5, size: 0.075, glow: true },
  { frame: 1, r: 1.68, speed: -0.55, phase: 3.1, size: 0.06 },
  { frame: 2, r: 2.06, speed: 0.42, phase: 4.0, size: 0.09 },
  { frame: 2, r: 1.98, speed: -0.3, phase: 5.0, size: 0.07, glow: true },
  { frame: 3, r: 2.39, speed: 0.28, phase: 0.6, size: 0.075, glow: true },
  { frame: 3, r: 2.31, speed: -0.5, phase: 1.8, size: 0.05 },
]

function makePlanetGeometry(radius: number, amp = 0.028, segments = 96) {
  const geo = new THREE.SphereGeometry(radius, segments, segments)
  const pos = geo.attributes.position as THREE.BufferAttribute
  const v = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    const n = v.clone().normalize()
    const d =
      Math.sin(n.x * 7.0 + 1.3) * Math.sin(n.y * 6.2 + 0.7) * Math.sin(n.z * 5.1 + 2.1) * 0.5 +
      Math.cos(n.x * 4.7 + n.y * 3.1 + n.z * 2.3) * 0.35 +
      Math.sin((n.x + n.y + n.z) * 8.7) * 0.15
    const rr = radius + d * amp
    pos.setXYZ(i, n.x * rr, n.y * rr, n.z * rr)
  }
  geo.computeVertexNormals()
  return geo
}

function makeGridGeometry(radius: number, meridians = 18, parallels = 9) {
  const positions: number[] = []
  const push = (a: THREE.Vector3, b: THREE.Vector3) => {
    positions.push(a.x, a.y, a.z, b.x, b.y, b.z)
  }

  for (let m = 0; m < meridians; m++) {
    const lon = (m / meridians) * Math.PI * 2
    const pts: THREE.Vector3[] = []
    for (let s = 0; s <= parallels * 2; s++) {
      const lat = -Math.PI / 2 + (s / (parallels * 2)) * Math.PI
      pts.push(
        new THREE.Vector3(Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon)).multiplyScalar(radius)
      )
    }
    for (let k = 0; k < pts.length - 1; k++) push(pts[k], pts[k + 1])
  }

  for (let p = 1; p < parallels; p++) {
    const lat = -Math.PI / 2 + (p / parallels) * Math.PI
    const pts: THREE.Vector3[] = []
    for (let s = 0; s <= meridians; s++) {
      const lon = (s / meridians) * Math.PI * 2
      pts.push(
        new THREE.Vector3(Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon)).multiplyScalar(radius)
      )
    }
    for (let k = 0; k < pts.length - 1; k++) push(pts[k], pts[k + 1])
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
  return geo
}

function usePlanetAssets(mobile: boolean) {
  return useMemo(() => {
    const radius = mobile ? 0.85 : 0.95

    const planetGeometry = makePlanetGeometry(radius, mobile ? 0.02 : 0.028)
    const gridGeometry = makeGridGeometry(radius * 1.035)
    const haloGeometry = new THREE.SphereGeometry(radius * 1.06, 48, 48)

    const orbiterBig = new THREE.SphereGeometry(0.1, 24, 24)
    const orbiterSmall = new THREE.SphereGeometry(0.06, 24, 24)

    const torusGeos = RINGS.map((r) => new THREE.TorusGeometry(r.radius, r.tube, 12, 160))

    const obsidian = new THREE.MeshPhysicalMaterial({
      color: "#191920",
      metalness: 0.85,
      roughness: 0.28,
      clearcoat: 0.7,
      clearcoatRoughness: 0.2,
      envMapIntensity: 1.0,
    })

    const chrome = new THREE.MeshPhysicalMaterial({
      color: "#1d1d23",
      metalness: 0.96,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      envMapIntensity: 1.3,
    })

    const steel = new THREE.MeshPhysicalMaterial({
      color: "#2a2a32",
      metalness: 0.94,
      roughness: 0.22,
      clearcoat: 0.8,
      envMapIntensity: 1.1,
    })

    const glow = new THREE.MeshBasicMaterial({ color: "#f5f0e6" })

    const gridLine = new THREE.LineBasicMaterial({
      color: "#efe9dc",
      transparent: true,
      opacity: 0.3,
    })

    const halo = new THREE.MeshBasicMaterial({
      color: "#e8e2d5",
      transparent: true,
      opacity: 0.055,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    })

    const ringMats = RINGS.map((r) => {
      const m = new THREE.MeshPhysicalMaterial({
        color: "#2c2c34",
        metalness: 0.95,
        roughness: 0.14,
        clearcoat: 0.8,
        transparent: true,
        opacity: r.opacity,
        envMapIntensity: 1.1,
      })
      return m
    })

    return {
      planetGeometry,
      gridGeometry,
      haloGeometry,
      orbiterBig,
      orbiterSmall,
      torusGeos,
      obsidian,
      chrome,
      steel,
      glow,
      gridLine,
      halo,
      ringMats,
    }
  }, [mobile])
}

function PlanetScene({ mobile }: { mobile: boolean }) {
  const { camera } = useThree()
  const spin = useRef<THREE.Group>(null!)
  const orb = useRef<THREE.Group>(null!)
  const ringRefs = useRef<(THREE.Mesh | null)[]>([])
  const satRefs = useRef<(THREE.Mesh | null)[]>([])

  const mouse = useRef({ x: 0, y: 0 })
  const scroll = useRef(0)
  const smooth = useRef({ yaw: 0, pitch: 0, scroll: 0, camX: 0, camY: 0 })

  const assets = usePlanetAssets(mobile)
  const {
    planetGeometry,
    gridGeometry,
    haloGeometry,
    orbiterBig,
    orbiterSmall,
    torusGeos,
    obsidian,
    chrome,
    steel,
    glow,
    gridLine,
    halo,
    ringMats,
  } = assets

  const activeRings = mobile ? RINGS.slice(0, 3) : RINGS
  const activeOrbiters = mobile ? ORBITERS.slice(0, 4) : ORBITERS

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    const onScroll = () => {
      scroll.current = window.scrollY
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  useEffect(() => {
    return () => {
      planetGeometry.dispose()
      gridGeometry.dispose()
      haloGeometry.dispose()
      orbiterBig.dispose()
      orbiterSmall.dispose()
      torusGeos.forEach((g) => g.dispose())
      obsidian.dispose()
      chrome.dispose()
      steel.dispose()
      glow.dispose()
      gridLine.dispose()
      halo.dispose()
      ringMats.forEach((m) => m.dispose())
    }
  }, [
    planetGeometry,
    gridGeometry,
    haloGeometry,
    orbiterBig,
    orbiterSmall,
    torusGeos,
    obsidian,
    chrome,
    steel,
    glow,
    gridLine,
    halo,
    ringMats,
  ])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const m = mouse.current
    const s = smooth.current
    const k = 1 - Math.exp(-delta * 4.5)

    const targetYaw = m.x * 0.3
    const targetPitch = -m.y * 0.2 + Math.min(scroll.current * 0.00005, 0.2)
    const targetDrift = Math.min(scroll.current * 0.0006, 0.45)

    s.yaw += (targetYaw - s.yaw) * k
    s.pitch += (targetPitch - s.pitch) * k
    s.scroll += (targetDrift - s.scroll) * k

    const g = spin.current
    g.rotation.y = t * 0.14 + s.yaw
    g.rotation.x = 0.4 + Math.sin(t * 0.12) * 0.08 + s.pitch
    g.rotation.z = Math.sin(t * 0.07) * 0.04
    g.position.y = s.scroll

    // Planet: slow axial rotation + gentle wobble
    if (orb.current) {
      orb.current.rotation.y = t * 0.35
      orb.current.rotation.z = 0.09 + Math.sin(t * 0.15) * 0.03
    }

    // Each orbit spins independently, in its own plane
    for (let i = 0; i < activeRings.length; i++) {
      const ring = ringRefs.current[i]
      if (!ring) continue
      ring.rotation.z = activeRings[i].spin * t * 2
    }

    // Satellites follow their orbit path
    for (let i = 0; i < activeOrbiters.length; i++) {
      const sat = satRefs.current[i]
      if (!sat) continue
      const cfg = activeOrbiters[i]
      const theta = t * cfg.speed * 2 + cfg.phase
      sat.position.set(Math.cos(theta) * cfg.r, Math.sin(theta) * cfg.r, 0)
    }

    const camK = 1 - Math.exp(-delta * 4)
    s.camX += (m.x * 0.08 - s.camX) * camK
    s.camY += (m.y * 0.05 - s.camY) * camK
    camera.position.x = s.camX
    camera.position.y = 0.1 + s.camY
    camera.lookAt(0, 0, 0)
  })

  return (
    <group ref={spin} scale={mobile ? 0.72 : 0.9}>
      <Float speed={0.7} rotationIntensity={0.1} floatIntensity={0.35}>
        <group>
          {/* Central planet: displaced core + tech grid + halo */}
          <group ref={orb}>
            <mesh geometry={planetGeometry} material={obsidian} />
            <lineSegments geometry={gridGeometry} material={gridLine} />
            <mesh geometry={haloGeometry} material={halo} />
          </group>

          {/* Orbital rings (independent inclination + in-plane spin) */}
          {activeRings.map((ring, i) => (
            <group key={i} rotation={ring.tilt}>
              <group scale={ring.ellipse ?? [1, 1, 1]}>
                <mesh ref={(el) => (ringRefs.current[i] = el)} geometry={torusGeos[i]} material={ringMats[i]} />
              </group>
            </group>
          ))}

          {/* Satellites traveling on their orbit plane */}
          {activeOrbiters.map((o, i) => (
            <group key={i} rotation={RINGS[o.frame].tilt}>
              <group scale={RINGS[o.frame].ellipse ?? [1, 1, 1]}>
                <mesh
                  ref={(el) => (satRefs.current[i] = el)}
                  geometry={o.size > 0.085 ? orbiterBig : orbiterSmall}
                  material={o.glow ? glow : o.size < 0.075 ? steel : chrome}
                />
              </group>
            </group>
          ))}
        </group>
      </Float>
    </group>
  )
}

export function PlanetSculpture({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [inView, setInView] = useState(false)
  const mobile = useIsMobile()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === "undefined") {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "240px 0px 240px 0px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={className} aria-hidden style={{ position: "relative" }}>
      {inView ? (
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0.1, 4.4], fov: 40 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          style={{ position: "absolute", inset: 0, background: "transparent" }}
        >
          <Suspense fallback={null}>
            <PlanetScene mobile={mobile} />

            <ambientLight intensity={0.5} />
            <directionalLight position={[4, 6, 5]} intensity={1.5} />
            <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#efebe6" />
            <spotLight position={[0, 4, -4]} angle={0.5} penumbra={1} intensity={0.85} color="#ffffff" />

            <Environment preset="studio" />
          </Suspense>
        </Canvas>
      ) : null}
    </div>
  )
}