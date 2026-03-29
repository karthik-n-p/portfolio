import * as THREE from 'three'
import { threeColors } from '../design-tokens.js'

/**
 * DataFlowField — Unified particle system replacing SpatialGraph + ParticleSystem + MicroParticles
 *
 * A living data-flow architecture. Particles drift in structured streams and reorganize
 * into different formations based on the active section:
 *   hub       → dense rotating cluster at center
 *   pipeline  → horizontal pipeline lanes flowing L→R
 *   projects  → 2-3 distinct clusters
 *   skills    → radial burst grouped by category
 *   certs     → stacked horizontal bands
 *   education → ascending spiral
 *   connect   → expanding ring
 *   null      → gentle parallel streams (idle)
 *
 * Gesture response:
 *   fist  → pull toward hand
 *   open  → push away from hand
 *   point → gentle follow
 */

const PARTICLE_COUNT_DESKTOP = 1800
const PARTICLE_COUNT_MOBILE = 500

function isMobile() {
  return window.innerWidth < 768
}

// Per-section target formation generators
// Each returns (index, total) => { x, y, z } target position
const FORMATIONS = {
  idle: (i, total) => {
    // Premium Global Data Core (Fibonacci Sphere)
    // A flawless, mathematically perfect sphere of data points.
    // Extremely minimalist, ordered, and world-class, conveying absolute control over data.
    const phi = Math.acos(1 - 2 * (i + 0.5) / total)
    const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5)
    
    // Large, imposing but clean radius with microscopic breathing
    const R = 3.8 + Math.sin(i * 0.1) * 0.05

    return {
      x: R * Math.cos(theta) * Math.sin(phi),
      y: R * Math.cos(phi) * 0.9, // Slight polar flattening like an oblate spheroid
      z: R * Math.sin(theta) * Math.sin(phi),
    }
  },
  hub: (i, total) => {
    // Central Data Lake: A dense, dual-shell spherical storage core representing centralized raw data
    const isInner = i % 2 === 0
    const r = isInner ? 1.2 : 2.5
    const chunkTotal = total / 2
    const idx = Math.floor(i / 2)
    const phi = Math.acos(1 - 2 * (idx + 0.5) / chunkTotal)
    const theta = Math.PI * (1 + Math.sqrt(5)) * (idx + 0.5)
    return {
      x: r * Math.cos(theta) * Math.sin(phi),
      y: r * Math.cos(phi),
      z: r * Math.sin(theta) * Math.sin(phi) - 1.5,
    }
  },
  pipeline: (i, total) => {
    // High-Velocity ETL Streaming Pipeline
    // 3 pristine, strict parallel channels (Extract, Transform, Load) flowing rapidly
    const track = i % 3
    const t = (i / total)
    return {
      x: t * 14 - 7, // long stretch for velocity impact
      y: (track - 1) * 1.5, // 3 distinct vertical lanes
      z: Math.sin(i * 0.1) * 0.5 - 2, // strict alignment
    }
  },
  projects: (i, total) => {
    // Isolated Production Deployments: 3 perfectly distinct, dense functional spheres (Nodes)
    const mobile = window.innerWidth < 768
    const cluster = i % 3
    const cx = mobile ? [-1.2, 0, 1.2][cluster] : [-2.5, 0, 2.5][cluster]
    const cy = mobile ? [1.2, 0, -1.2][cluster] : [1.0, -1.0, 1.0][cluster]
    
    const chunkTotal = total / 3
    const idx = Math.floor(i / 3)
    const phi = Math.acos(1 - 2 * (idx + 0.5) / chunkTotal)
    const theta = Math.PI * (1 + Math.sqrt(5)) * (idx + 0.5)
    const r = mobile ? 0.55 : 0.8
    
    return {
      x: cx + r * Math.cos(theta) * Math.sin(phi),
      y: cy + r * Math.cos(phi),
      z: r * Math.sin(theta) * Math.sin(phi) - 1,
    }
  },
  skills: (i, total) => {
    // Architectural Stack Orbits: 4 concentric planetary rings representing the layered tech stack
    const orbitLayer = i % 4
    const r = [1.2, 2.4, 3.6, 4.8][orbitLayer]
    
    const chunkTotal = total / 4
    const idx = Math.floor(i / 4)
    const angle = (idx / chunkTotal) * Math.PI * 2
    
    return {
      x: Math.cos(angle) * r,
      y: (orbitLayer - 1.5) * 0.5, // slightly tiered vertically for massive 3D depth
      z: Math.sin(angle) * r - 1,
    }
  },
  certs: (i, total) => {
    // Verified Ledgers (Blockchain blocks / Milestones): Stacked, pristine crystalline server plates
    const tier = i % 3
    const chunkTotal = total / 3
    const idx = Math.floor(i / 3)
    
    // Arrange in a dense flat grid pattern
    const cols = Math.ceil(Math.sqrt(chunkTotal))
    const row = Math.floor(idx / cols)
    const col = idx % cols
    
    const spacing = 0.35
    const width = cols * spacing
    
    return {
      x: col * spacing - (width / 2),
      y: (tier - 1) * 2.0, // 3 stacked verification plates
      z: row * spacing - (width / 2) - 1,
    }
  },
  education: (i, total) => {
    // The Knowledge Foundation: A majestic, ascending DNA Double Helix structure
    const strand = i % 2
    const chunkTotal = total / 2
    const idx = Math.floor(i / 2)
    const t = idx / chunkTotal
    
    const height = 9
    const loops = 3
    const r = 1.4
    
    const angle = t * Math.PI * 2 * loops + (strand * Math.PI)
    
    return {
      x: Math.cos(angle) * r,
      y: t * height - (height / 2),
      z: Math.sin(angle) * r - 1,
    }
  },
  connect: (i, total) => {
    // Radar Sonar Pulse: Flat, infinite concentric rings broadcasting a connection signal
    const ring = i % 5
    const chunkTotal = total / 5
    const idx = Math.floor(i / 5)
    
    const r = 0.6 + ring * 1.2
    const angle = (idx / chunkTotal) * Math.PI * 2
    
    return {
      x: Math.cos(angle) * r,
      y: 0, // Perfectly flat to resemble radar arrays
      z: Math.sin(angle) * r - 1,
    }
  },
}

// Section → hex color
const SECTION_COLORS = {
  hub:       new THREE.Color(threeColors.section.hub),
  pipeline:  new THREE.Color(threeColors.section.pipeline),
  projects:  new THREE.Color(threeColors.section.projects),
  skills:    new THREE.Color(threeColors.section.skills),
  certs:     new THREE.Color(threeColors.section.certs),
  education: new THREE.Color(threeColors.section.education),
  connect:   new THREE.Color(threeColors.section.connect),
}

const BASE_COLOR = new THREE.Color(threeColors.accent)
const DIM_COLOR  = new THREE.Color(threeColors.gridDot)

export class DataFlowField {
  constructor(scene) {
    this.scene = scene
    this.count = isMobile() ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP
    this.activeSection = null
    this.gestureState = 'normal'
    this.handPos = null
    this.handWorld = new THREE.Vector3()
    this.clock = new THREE.Clock()
    this._init()
  }

  _init() {
    const geo = new THREE.SphereGeometry(0.045, 8, 8)
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
    })

    this.mesh = new THREE.InstancedMesh(geo, mat, this.count)
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)

    // Per-instance color
    const colorArr = new Float32Array(this.count * 3)
    for (let i = 0; i < this.count; i++) {
      const blend = Math.random()
      const c = BASE_COLOR.clone().lerp(DIM_COLOR, blend * 0.6)
      colorArr[i * 3]     = c.r
      colorArr[i * 3 + 1] = c.g
      colorArr[i * 3 + 2] = c.b
    }
    this.mesh.instanceColor = new THREE.InstancedBufferAttribute(colorArr, 3)
    this.scene.add(this.mesh)

    // Per-particle state
    this.particles = []
    for (let i = 0; i < this.count; i++) {
      const idle = FORMATIONS.idle(i, this.count)
      this.particles.push({
        x: idle.x + (Math.random() - 0.5) * 2,
        y: idle.y + (Math.random() - 0.5) * 2,
        z: idle.z + (Math.random() - 0.5) * 1,
        tx: idle.x,
        ty: idle.y,
        tz: idle.z,
        ox: 0, oy: 0, oz: 0,  // gesture offset
        size: 0.6 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 0.5,
      })
    }

    this._dummy = new THREE.Object3D()
  }

  setActiveSection(section) {
    if (section === this.activeSection) return
    this.activeSection = section

    // Update target positions
    const formation = FORMATIONS[section] || FORMATIONS.idle
    const sectionColor = section ? SECTION_COLORS[section] : null
    const colorAttr = this.mesh.instanceColor

    for (let i = 0; i < this.count; i++) {
      const target = formation(i, this.count)
      this.particles[i].tx = target.x
      this.particles[i].ty = target.y
      this.particles[i].tz = target.z

      // Update color toward section color
      let c
      if (sectionColor) {
        const blend = 0.3 + Math.random() * 0.5
        c = sectionColor.clone().lerp(DIM_COLOR, blend)
      } else {
        const blend = Math.random()
        c = BASE_COLOR.clone().lerp(DIM_COLOR, blend * 0.6)
      }
      colorAttr.array[i * 3]     = c.r
      colorAttr.array[i * 3 + 1] = c.g
      colorAttr.array[i * 3 + 2] = c.b
    }
    colorAttr.needsUpdate = true
  }

  setGestureState(state) { this.gestureState = state }
  setHandPosition(pos)  { this.handPos = pos }
  setHoverPosition(pos) { this.hoverPos = pos }

  update(delta) {
    const t = this.clock.getElapsedTime()
    const dummy = this._dummy
    const isFist = this.gestureState === 'fist'
    const isOpen = this.gestureState === 'open'

    // Gentle, minimalist rotation of the global sphere in Home state
    if (!this.activeSection) {
      // Keep track of the continuous ambient spin
      this.baseRotY = (this.baseRotY || 0) + delta * 0.04
      this.baseRotX = (this.baseRotX || 0) + delta * 0.01

      let targetRotX = this.baseRotX
      let targetRotY = this.baseRotY

      // Smoothly interpolate current rotation toward the interactive target
      this.mesh.rotation.y += (targetRotY - this.mesh.rotation.y) * delta * 4
      this.mesh.rotation.x += (targetRotX - this.mesh.rotation.x) * delta * 4
    } else {
      // Smoothly snap back to origin instantly on navigation
      this.mesh.rotation.y += (0 - this.mesh.rotation.y) * delta * 4
      this.mesh.rotation.x += (0 - this.mesh.rotation.x) * delta * 4
    }

    // Smooth hand world position
    if (this.handPos) {
      this.handWorld.x += (this.handPos.x * 6 - this.handWorld.x) * 0.1
      this.handWorld.y += (this.handPos.y * 4 - this.handWorld.y) * 0.1
    }

    // Dynamically adjust maximum offset to let particles aggregate to a single point on 'fist'
    this.currentMaxOff = this.currentMaxOff || 3
    const targetMaxOff = isFist ? 30 : 3
    this.currentMaxOff += (targetMaxOff - this.currentMaxOff) * (delta * 5)

    // Luxurious, smooth structural morphing (slower lerp)
    const lerpSpeed = 0.01 + delta * 1.5  // ultra-premium smoothness
    const hx = this.handWorld.x
    const hy = this.handWorld.y

    for (let i = 0; i < this.count; i++) {
      const p = this.particles[i]

      // Lerp toward target formation
      p.x += (p.tx - p.x) * lerpSpeed * p.speed
      p.y += (p.ty - p.y) * lerpSpeed * p.speed
      p.z += (p.tz - p.z) * lerpSpeed * p.speed

      // Add gentle organic drift
      const drift = 0.08
      p.x += Math.sin(t * 0.3 + p.phase) * drift * delta
      p.y += Math.cos(t * 0.25 + p.phase * 1.3) * drift * delta
      p.z += Math.sin(t * 0.2 + p.phase * 2.1) * drift * 0.3 * delta

      // Gesture offsets
      if (isFist && this.handPos) {
        // World-class Data Engineer Transition: Assemble particles into a rapidly spinning, structured holographic data core
        const phi = Math.acos(1 - 2 * (i + 0.5) / this.count)
        const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5)
        
        // Dynamic rotation to simulate an active processing core
        const rT = t * 2.5
        const cY = Math.cos(rT), sY = Math.sin(rT)
        const cX = Math.cos(rT * 0.7), sX = Math.sin(rT * 0.7)

        const r = 0.9 + Math.sin(t * 8 + p.phase) * 0.06
        
        let bx = Math.cos(theta) * Math.sin(phi) * r
        let by = Math.cos(phi) * r
        let bz = Math.sin(theta) * Math.sin(phi) * r

        // Rotate core around X then Y
        let y1 = by * cX - bz * sX
        let z1 = by * sX + bz * cX
        let x2 = bx * cY + z1 * sY
        let z2 = -bx * sY + z1 * cY
        let y2 = y1

        const targetX = hx + x2
        const targetY = hy + y2
        const targetZ = z2

        const dx = targetX - (p.x + p.ox)
        const dy = targetY - (p.y + p.oy)
        const dz = targetZ - (p.z + p.oz)
        
        const pull = 0.16
        p.ox += dx * pull
        p.oy += dy * pull
        p.oz += dz * pull
      } else if (isOpen && this.handPos) {
        const dx = p.x + p.ox - hx
        const dy = p.y + p.oy - hy
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.1
        const force = 0.08 / (0.5 + dist * 0.5)
        p.ox += (dx / dist) * force
        p.oy += (dy / dist) * force
        p.ox *= 0.97
        p.oy *= 0.97
        p.oz *= 0.97
      } else if (this.handPos) {
        // Gentle follow
        const dx = hx - (p.x + p.ox)
        const dy = hy - (p.y + p.oy)
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.1
        if (dist < 3) {
          const attract = 0.002 / (0.3 + dist)
          p.ox += dx * attract
          p.oy += dy * attract
        }
        p.ox *= 0.96
        p.oy *= 0.96
        p.oz *= 0.96
      } else if (this.hoverPos) {
        // Mouse hover interaction (gentle push)
        const dx = (p.x + p.ox) - this.hoverPos.x
        const dy = (p.y + p.oy) - this.hoverPos.y
        const dz = (p.z + p.oz) - this.hoverPos.z
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.1
        if (dist < 2.0) {
          const force = 0.6 * (2.0 - dist)
          p.ox += (dx / dist) * force * delta * 5
          p.oy += (dy / dist) * force * delta * 5
          p.oz += (dz / dist) * force * delta * 5
        }
        p.ox *= 0.92
        p.oy *= 0.92
        p.oz *= 0.92
      } else {
        p.ox *= 0.94
        p.oy *= 0.94
        p.oz *= 0.94
      }

      // Clamp offsets
      const maxOff = this.currentMaxOff
      p.ox = Math.max(-maxOff, Math.min(maxOff, p.ox))
      p.oy = Math.max(-maxOff, Math.min(maxOff, p.oy))
      p.oz = Math.max(-maxOff / 2, Math.min(maxOff / 2, p.oz))

      const px = p.x + p.ox
      const py = p.y + p.oy
      const pz = p.z + p.oz

      const scale = p.size * (1 + Math.sin(t * 1.5 + p.phase) * 0.15)
      dummy.position.set(px, py, pz)
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      this.mesh.setMatrixAt(i, dummy.matrix)
    }

    this.mesh.instanceMatrix.needsUpdate = true
  }

  triggerPulse(point) {
    if (point) {
      for (let i = 0; i < this.count; i++) {
        const p = this.particles[i]
        
        // World position of the particle (approximate)
        const dx = (p.x + p.ox) - point.x
        const dy = (p.y + p.oy) - point.y
        const dz = (p.z + p.oz) - point.z
        
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (dist < 6) {
          const force = 5.0 / (dist + 0.1)
          p.ox += (dx / dist) * force
          p.oy += (dy / dist) * force
          p.oz += (dz / dist) * force
        }
      }
    } else {
      for (let i = 0; i < this.count; i++) {
        const p = this.particles[i]
        p.ox += (Math.random() - 0.5) * 8
        p.oy += (Math.random() - 0.5) * 8
        p.oz += (Math.random() - 0.5) * 8
      }
    }
  }

  dispose() {
    this.mesh.geometry.dispose()
    this.mesh.material.dispose()
    this.scene.remove(this.mesh)
  }
}
