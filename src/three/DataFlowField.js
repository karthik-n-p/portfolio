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
    // Parallel streams flowing gently
    const lane = (i % 5) - 2
    const progress = (i / total) * 12 - 6
    return {
      x: progress + Math.sin(i * 0.3) * 0.3,
      y: lane * 1.5 + Math.cos(i * 0.7) * 0.3,
      z: Math.sin(i * 0.4) * 1.5 - 1,
    }
  },
  hub: (i, total) => {
    // Dense rotating cluster at center
    const phi = (i / total) * Math.PI * 2 * 6
    const r = (i / total) * 2.5
    const h = ((i / total) - 0.5) * 3
    return {
      x: Math.cos(phi) * r * 0.8,
      y: h,
      z: Math.sin(phi) * r * 0.8 - 1,
    }
  },
  pipeline: (i, total) => {
    // Horizontal pipeline lanes flowing L→R
    const lane = (i % 4) - 1.5
    const t = (i / total)
    return {
      x: t * 10 - 5,
      y: lane * 1.2,
      z: Math.sin(i * 0.2) * 0.5 - 1,
    }
  },
  projects: (i, total) => {
    // 2-3 distinct clusters
    const cluster = i % 3
    const cx = [-3, 0, 3][cluster]
    const cy = [0.5, -0.8, 0.5][cluster]
    const perCluster = total / 3
    const localIdx = Math.floor(i / 3)
    const angle = (localIdx / perCluster) * Math.PI * 2
    const r = 0.4 + (localIdx / perCluster) * 1.2
    return {
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
      z: Math.sin(angle * 2) * 0.5 - 1,
    }
  },
  skills: (i, total) => {
    // Radial burst pattern
    const angle = (i / total) * Math.PI * 2 * 3
    const r = 0.5 + (i / total) * 3.5
    return {
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r,
      z: ((i / total) - 0.5) * 2 - 1,
    }
  },
  certs: (i, total) => {
    // Stacked horizontal bands
    const band = i % 3
    const perBand = total / 3
    const localIdx = Math.floor(i / 3)
    return {
      x: (localIdx / perBand) * 8 - 4,
      y: (band - 1) * 2,
      z: Math.sin(localIdx * 0.15) * 0.5 - 1,
    }
  },
  education: (i, total) => {
    // Ascending spiral
    const t = i / total
    const angle = t * Math.PI * 2 * 4
    const r = 1.0 + t * 2
    return {
      x: Math.cos(angle) * r,
      y: t * 5 - 2.5,
      z: Math.sin(angle) * r - 1,
    }
  },
  connect: (i, total) => {
    // Expanding ring
    const angle = (i / total) * Math.PI * 2
    const r = 2.0 + Math.sin(i * 0.5) * 0.8
    const h = ((i / total) - 0.5) * 2
    return {
      x: Math.cos(angle) * r,
      y: h,
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

  update(delta) {
    const t = this.clock.getElapsedTime()
    const dummy = this._dummy
    const isFist = this.gestureState === 'fist'
    const isOpen = this.gestureState === 'open'

    // Smooth hand world position
    if (this.handPos) {
      this.handWorld.x += (this.handPos.x * 6 - this.handWorld.x) * 0.1
      this.handWorld.y += (this.handPos.y * 4 - this.handWorld.y) * 0.1
    }

    const lerpSpeed = 0.02 + delta * 2  // ~0.02-0.05 per frame
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
        const pull = 0.06
        p.ox += (hx - p.x - p.ox) * pull
        p.oy += (hy - p.y - p.oy) * pull
        p.oz += (0 - p.z - p.oz) * pull * 0.3
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
      } else {
        p.ox *= 0.94
        p.oy *= 0.94
        p.oz *= 0.94
      }

      // Clamp offsets
      const maxOff = 3
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

  dispose() {
    this.mesh.geometry.dispose()
    this.mesh.material.dispose()
    this.scene.remove(this.mesh)
  }
}
