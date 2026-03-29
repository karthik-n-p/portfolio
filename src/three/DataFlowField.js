import * as THREE from 'three'
import { threeColors, threeSectionColors } from '../design-tokens.js'

/**
 * DataFlowField — The Data Journey Particle System
 *
 * Formations represent the lifecycle of data engineering:
 *   0: hero       → Chaotic Nebula (raw unprocessed data)
 *   1: hub        → Magnetic Torus (streaming ingestion)
 *   2: pipeline   → ETL Parallel Streams (transformation)
 *   3: skills     → Hypercube Lattice (data warehouse)
 *   4: projects   → DAG Constellation (orchestration)
 *   5: certs      → Crystalline Pillars (validation checkpoints)
 *   6: education  → DNA Helix (knowledge foundation)
 *   7: connect    → Expanding Radar Rings (output/broadcast)
 *
 * Each section has a unique premium color scheme.
 * Audio reactivity: bass → scale/orbit expansion, mid → velocity, treble → shimmer
 */

const PARTICLE_COUNT_DESKTOP = 2000
const PARTICLE_COUNT_MOBILE = 600

function isMobile() {
  return window.innerWidth < 768
}

// ─── FORMATIONS ──────────────────────────────────────────
const FORMATIONS = {
  // 0: Data Accretion Disk — majestic, organized raw data vortex
  hero: (i, total) => {
    const t = i / total
    const angle = t * Math.PI * 2 * 60 // Dense spirals
    
    // Hollow inner core (starting at r=3.5), expanding out to r=11.0
    const r = 3.5 + Math.pow(Math.random(), 1.5) * 7.5
    
    // Smooth thickness: thickest at the core, tapering to the edges
    const normalizedD = (r - 3.5) / 7.5
    const thickness = 5.0 * Math.cos(normalizedD * (Math.PI / 2))
    const ySpread = (Math.random() - 0.5) * thickness
    
    return {
      x: r * Math.cos(angle),
      y: ySpread,
      z: r * Math.sin(angle) - 1.5,
    }
  },

  // 1: Magnetic Torus — data streaming ingestion
  hub: (i, total) => {
    const t = i / total
    const angle = t * Math.PI * 2 * 8
    const tubeAngle = t * Math.PI * 2 * 89
    const R = 3.0
    const r = 0.9 + Math.sin(i * 0.3) * 0.2
    return {
      x: (R + r * Math.cos(tubeAngle)) * Math.cos(angle),
      y: (R + r * Math.cos(tubeAngle)) * Math.sin(angle) * 0.4,
      z: r * Math.sin(tubeAngle) - 1,
    }
  },

  // 2: ETL Streams — 3 strict parallel laser channels
  pipeline: (i, total) => {
    const track = i % 3
    const t = (i / total)
    const mobile = isMobile()
    const spread = mobile ? 8 : 14
    return {
      x: t * spread - spread / 2,
      y: (track - 1) * 1.6,
      z: Math.sin(i * 0.08) * 0.3 - 1.5,
    }
  },

  // 3: Hypercube Lattice — multi-dimensional data warehouse
  skills: (i, total) => {
    const dim = 5
    const totalPoints = dim * dim * dim
    const idx = i % totalPoints
    const ix = idx % dim
    const iy = Math.floor(idx / dim) % dim
    const iz = Math.floor(idx / (dim * dim)) % dim
    const spacing = 1.2
    const offset = (dim - 1) * spacing / 2
    const w = (i / total) * Math.PI * 2
    const wFactor = Math.sin(w) * 0.3
    return {
      x: ix * spacing - offset + wFactor,
      y: iy * spacing - offset,
      z: iz * spacing - offset - 1 + Math.cos(w) * 0.3,
    }
  },

  // 4: DAG Constellation — distinct clusters connected by streams
  projects: (i, total) => {
    const mobile = isMobile()
    const cluster = i % 4
    const centers = mobile
      ? [{ x: -1, y: 1.2 }, { x: 1, y: 1.2 }, { x: -1, y: -1.2 }, { x: 1, y: -1.2 }]
      : [{ x: -3, y: 1.5 }, { x: -1, y: -1.5 }, { x: 1.5, y: 1 }, { x: 3.5, y: -0.5 }]
    const cx = centers[cluster].x
    const cy = centers[cluster].y
    const chunkTotal = total / 4
    const idx = Math.floor(i / 4)
    const phi = Math.acos(1 - 2 * (idx + 0.5) / chunkTotal)
    const theta = Math.PI * (1 + Math.sqrt(5)) * (idx + 0.5)
    const r = mobile ? 0.5 : 0.7
    return {
      x: cx + r * Math.cos(theta) * Math.sin(phi),
      y: cy + r * Math.cos(phi),
      z: r * Math.sin(theta) * Math.sin(phi) - 1,
    }
  },

  // 5: Crystalline Pillars — certification validation
  certs: (i, total) => {
    const pillar = i % 3
    const chunkTotal = total / 3
    const idx = Math.floor(i / 3)
    const t = idx / chunkTotal
    const pillarX = (pillar - 1) * 2.2
    const height = 5
    return {
      x: pillarX + Math.sin(t * Math.PI * 4) * 0.3,
      y: t * height - height / 2,
      z: Math.cos(t * Math.PI * 4) * 0.3 - 1,
    }
  },

  // 6: DNA Helix — knowledge foundation
  education: (i, total) => {
    const strand = i % 2
    const chunkTotal = total / 2
    const idx = Math.floor(i / 2)
    const t = idx / chunkTotal
    const height = 8
    const loops = 3
    const r = 1.6
    const angle = t * Math.PI * 2 * loops + (strand * Math.PI)
    return {
      x: Math.cos(angle) * r,
      y: t * height - (height / 2),
      z: Math.sin(angle) * r - 1,
    }
  },

  // 7: BI Serving Layers — Stacked curated presentation planes
  connect: (i, total) => {
    const mobile = isMobile()
    const layers = 3
    const layer = i % layers
    const layerTotal = Math.floor(total / layers)
    const idx = Math.floor(i / layers)
    
    // Make a rectangular grid for each BI layer
    const gridSize = Math.floor(Math.sqrt(layerTotal))
    const ix = idx % gridSize
    const iz = Math.floor(idx / gridSize)
    
    // Centered coordinates
    const spacing = mobile ? 0.25 : 0.35
    const offset = (gridSize - 1) * spacing / 2.0
    
    // Vertical spacing between layers
    const ySpacing = mobile ? 2.0 : 1.8
    let y = (layer - 1) * ySpacing
    
    // Add subtle structural wave to make it feel alive and flowing
    const wave = Math.sin(ix * 0.5) * Math.cos(iz * 0.5) * 0.25
    
    return {
      x: ix * spacing - offset,
      y: y + wave,
      z: iz * spacing - offset - 1,
    }
  },
}

const FORMATION_KEYS = ['hero', 'hub', 'pipeline', 'skills', 'projects', 'certs', 'education', 'connect']

export class DataFlowField {
  constructor(scene) {
    this.scene = scene
    this.count = isMobile() ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP
    this.activeSection = 'hero'
    this.gestureState = 'normal'
    this.handPos = null
    this.handWorld = new THREE.Vector3()
    this.hoverPos = null
    this.clock = new THREE.Clock()
    this.audioData = { bass: 0, mid: 0, treble: 0, overall: 0 }
    this._init()
  }

  _init() {
    const geo = new THREE.SphereGeometry(0.04, 6, 6)
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    this.mesh = new THREE.InstancedMesh(geo, mat, this.count)
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)

    // Per-instance color — initialize with hero section colors
    const sectionPalette = threeSectionColors.hero
    const primaryColor = new THREE.Color(sectionPalette.primary)
    const secondaryColor = new THREE.Color(sectionPalette.secondary)
    const dimColor = new THREE.Color(sectionPalette.dim)

    const colorArr = new Float32Array(this.count * 3)
    for (let i = 0; i < this.count; i++) {
      const t = i / this.count
      // Create a gradient from primary → secondary → dim
      let c
      if (t < 0.4) {
        c = primaryColor.clone().lerp(secondaryColor, t / 0.4)
      } else if (t < 0.7) {
        c = secondaryColor.clone().lerp(dimColor, (t - 0.4) / 0.3)
      } else {
        c = dimColor.clone().lerp(primaryColor, (t - 0.7) / 0.3 * 0.5)
      }
      colorArr[i * 3]     = c.r
      colorArr[i * 3 + 1] = c.g
      colorArr[i * 3 + 2] = c.b
    }
    this.mesh.instanceColor = new THREE.InstancedBufferAttribute(colorArr, 3)
    this.scene.add(this.mesh)

    // Per-particle state
    this.particles = []
    for (let i = 0; i < this.count; i++) {
      const target = FORMATIONS.hero(i, this.count)
      this.particles.push({
        x: (Math.random() - 0.5) * 12,
        y: (Math.random() - 0.5) * 12,
        z: (Math.random() - 0.5) * 6,
        tx: target.x,
        ty: target.y,
        tz: target.z,
        ox: 0, oy: 0, oz: 0,
        size: 0.5 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 0.5,
      })
    }
    this._dummy = new THREE.Object3D()
  }

  setActiveSection(sectionKey) {
    if (sectionKey === this.activeSection) return
    this.activeSection = sectionKey || 'hero'

    const formation = FORMATIONS[this.activeSection] || FORMATIONS.hero
    const colorAttr = this.mesh.instanceColor

    // Premium per-section color palette
    const palette = threeSectionColors[this.activeSection] || threeSectionColors.hero
    const primaryColor = new THREE.Color(palette.primary)
    const secondaryColor = new THREE.Color(palette.secondary)
    const dimColor = new THREE.Color(palette.dim)

    for (let i = 0; i < this.count; i++) {
      const target = formation(i, this.count)
      this.particles[i].tx = target.x
      this.particles[i].ty = target.y
      this.particles[i].tz = target.z

      // Create rich gradient across particles
      const t = i / this.count
      const rand = Math.random() * 0.3
      let c
      if (t < 0.35) {
        c = primaryColor.clone().lerp(secondaryColor, (t / 0.35) + rand * 0.2)
      } else if (t < 0.65) {
        c = secondaryColor.clone().lerp(primaryColor, ((t - 0.35) / 0.3) * 0.6 + rand * 0.15)
      } else {
        c = primaryColor.clone().lerp(dimColor, ((t - 0.65) / 0.35) * 0.5 + rand * 0.1)
      }
      // Add slight brightness variation for sparkle
      const brightness = 0.85 + Math.random() * 0.3
      c.r *= brightness
      c.g *= brightness
      c.b *= brightness

      colorAttr.array[i * 3]     = c.r
      colorAttr.array[i * 3 + 1] = c.g
      colorAttr.array[i * 3 + 2] = c.b
    }
    colorAttr.needsUpdate = true
  }

  setGestureState(state) { this.gestureState = state }
  setHandPosition(pos)  { this.handPos = pos }
  setHoverPosition(pos) { this.hoverPos = pos }
  setAudioData(data) { this.audioData = data }

  update(delta) {
    const t = this.clock.getElapsedTime()
    const dummy = this._dummy
    const isFist = this.gestureState === 'fist'
    const isOpen = this.gestureState === 'open'
    const audio = this.audioData

    // Formation-specific ambient rotation
    const isHero = this.activeSection === 'hero'
    const isHub = this.activeSection === 'hub'
    if (isHero || isHub) {
      this.baseRotY = (this.baseRotY || 0) + delta * (isHub ? 0.15 : 0.08) // Faster spin for hero vortex
      
      // Hero tilts forward to show off the accretion disk structure
      const targetPitch = isHero ? (Math.PI / 5) : 0
      this.baseRotX = (this.baseRotX || 0) + (targetPitch - (this.baseRotX || 0)) * delta * 2.0
      
      this.mesh.rotation.y += (this.baseRotY - this.mesh.rotation.y) * delta * 3
      this.mesh.rotation.x += (this.baseRotX - this.mesh.rotation.x) * delta * 3
    } else {
      this.mesh.rotation.y += (0 - this.mesh.rotation.y) * delta * 4
      this.mesh.rotation.x += (0 - this.mesh.rotation.x) * delta * 4
    }

    // Smooth hand world position
    if (this.handPos) {
      this.handWorld.x += (this.handPos.x * 6 - this.handWorld.x) * 0.1
      this.handWorld.y += (this.handPos.y * 4 - this.handWorld.y) * 0.1
    }

    this.currentMaxOff = this.currentMaxOff || 3
    const targetMaxOff = isFist ? 30 : 3
    this.currentMaxOff += (targetMaxOff - this.currentMaxOff) * (delta * 5)

    // Audio-reactive scale factor
    const audioScale = 1.0 + audio.bass * 0.6
    const audioSpeed = 1.0 + audio.mid * 2.0
    const audioShimmer = audio.treble * 0.5

    const lerpSpeed = (0.01 + delta * 1.5) * audioSpeed
    const hx = this.handWorld.x
    const hy = this.handWorld.y

    for (let i = 0; i < this.count; i++) {
      const p = this.particles[i]

      // Lerp toward target (with audio-driven speed boost)
      p.x += (p.tx * audioScale - p.x) * lerpSpeed * p.speed
      p.y += (p.ty * audioScale - p.y) * lerpSpeed * p.speed
      p.z += (p.tz * audioScale - p.z) * lerpSpeed * p.speed

      // Organic drift (subtle)
      const drift = 0.06
      p.x += Math.sin(t * 0.3 + p.phase) * drift * delta
      p.y += Math.cos(t * 0.25 + p.phase * 1.3) * drift * delta
      p.z += Math.sin(t * 0.2 + p.phase * 2.1) * drift * 0.3 * delta

      // Gesture offsets
      if (isFist && this.handPos) {
        const phi = Math.acos(1 - 2 * (i + 0.5) / this.count)
        const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5)
        const rT = t * 2.5
        const cY = Math.cos(rT), sY = Math.sin(rT)
        const cX = Math.cos(rT * 0.7), sX = Math.sin(rT * 0.7)
        const r = 0.9 + Math.sin(t * 8 + p.phase) * 0.06
        let bx = Math.cos(theta) * Math.sin(phi) * r
        let by = Math.cos(phi) * r
        let bz = Math.sin(theta) * Math.sin(phi) * r
        let y1 = by * cX - bz * sX
        let z1 = by * sX + bz * cX
        let x2 = bx * cY + z1 * sY
        let z2 = -bx * sY + z1 * cY
        const targetX = hx + x2
        const targetY = hy + y1
        const targetZ = z2
        p.ox += (targetX - (p.x + p.ox)) * 0.16
        p.oy += (targetY - (p.y + p.oy)) * 0.16
        p.oz += (targetZ - (p.z + p.oz)) * 0.16
      } else if (isOpen && this.handPos) {
        const dx = p.x + p.ox - hx
        const dy = p.y + p.oy - hy
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.1
        const force = 0.08 / (0.5 + dist * 0.5)
        p.ox += (dx / dist) * force
        p.oy += (dy / dist) * force
        p.ox *= 0.97; p.oy *= 0.97; p.oz *= 0.97
      } else if (this.handPos) {
        const dx = hx - (p.x + p.ox)
        const dy = hy - (p.y + p.oy)
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.1
        if (dist < 3) {
          const attract = 0.002 / (0.3 + dist)
          p.ox += dx * attract
          p.oy += dy * attract
        }
        p.ox *= 0.96; p.oy *= 0.96; p.oz *= 0.96
      } else if (this.hoverPos) {
        const dx = (p.x + p.ox) - this.hoverPos.x
        const dy = (p.y + p.oy) - this.hoverPos.y
        const dz = (p.z + p.oz) - this.hoverPos.z
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.1
        if (dist < 2.0) {
          const force = 0.5 * (2.0 - dist)
          p.ox += (dx / dist) * force * delta * 4
          p.oy += (dy / dist) * force * delta * 4
          p.oz += (dz / dist) * force * delta * 4
        }
        p.ox *= 0.92; p.oy *= 0.92; p.oz *= 0.92
      } else {
        p.ox *= 0.94; p.oy *= 0.94; p.oz *= 0.94
      }

      // Clamp offsets
      const maxOff = this.currentMaxOff
      p.ox = Math.max(-maxOff, Math.min(maxOff, p.ox))
      p.oy = Math.max(-maxOff, Math.min(maxOff, p.oy))
      p.oz = Math.max(-maxOff / 2, Math.min(maxOff / 2, p.oz))

      const px = p.x + p.ox
      const py = p.y + p.oy
      const pz = p.z + p.oz

      // Audio-reactive shimmer on particle size
      const shimmer = 1 + audioShimmer * Math.sin(t * 12 + p.phase * 3)
      const scale = p.size * (1 + Math.sin(t * 1.5 + p.phase) * 0.1) * shimmer
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
        const dx = (p.x + p.ox) - point.x
        const dy = (p.y + p.oy) - point.y
        const dz = (p.z + p.oz) - point.z
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (dist < 6) {
          const force = 4.0 / (dist + 0.1)
          p.ox += (dx / dist) * force
          p.oy += (dy / dist) * force
          p.oz += (dz / dist) * force
        }
      }
    } else {
      for (let i = 0; i < this.count; i++) {
        const p = this.particles[i]
        p.ox += (Math.random() - 0.5) * 6
        p.oy += (Math.random() - 0.5) * 6
        p.oz += (Math.random() - 0.5) * 6
      }
    }
  }

  dispose() {
    this.mesh.geometry.dispose()
    this.mesh.material.dispose()
    this.scene.remove(this.mesh)
  }
}
