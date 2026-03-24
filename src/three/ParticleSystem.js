import * as THREE from 'three'
import { nodePositions } from '../data/karthik.js'

/**
 * ParticleSystem — Instanced mesh of data-packet particles
 * Each particle flows along bezier paths between scene nodes.
 * Mouse disturbs flow; click creates ripple burst.
 */

const PARTICLE_COUNT_DESKTOP = 3000
const PARTICLE_COUNT_MOBILE = 700

// Bezier path seeds between nodes
const FLOW_PATHS = [
  ['hub', 'skills'],
  ['hub', 'pipeline'],
  ['hub', 'projects'],
  ['hub', 'certs'],
  ['hub', 'education'],
  ['pipeline', 'projects'],
  ['skills', 'certs'],
  ['projects', 'education'],
]

function isMobile() {
  return window.innerWidth < 768
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

function bezier3(p0, p1, p2, t) {
  const mt = 1 - t
  return {
    x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
    y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y,
    z: mt * mt * p0.z + 2 * mt * t * p1.z + t * t * p2.z,
  }
}

export class ParticleSystem {
  constructor(scene) {
    this.scene = scene
    this.count = isMobile() ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP
    this.mouse = new THREE.Vector3(0, 0, 0)
    this.gestureState = 'normal' // 'normal' | 'fist' | 'open'
    this.handPos = null // { x, y } in NDC [-1,1]
    this.handWorld = new THREE.Vector3(0, 0, 0) // smoothed world-space hand position
    this.ripples = []
    this._init()
  }

  _init() {
    // Geometry — single quad per particle via instanced mesh
    const geo = new THREE.SphereGeometry(0.025, 4, 4)
    const mat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.7,
    })

    this.mesh = new THREE.InstancedMesh(geo, mat, this.count)
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    this.scene.add(this.mesh)

    // Per-particle state
    this.particles = []
    const pathCount = FLOW_PATHS.length

    for (let i = 0; i < this.count; i++) {
      const pathIdx = i % pathCount
      const [fromKey, toKey] = FLOW_PATHS[pathIdx]
      const from = { ...nodePositions[fromKey] }
      const to = { ...nodePositions[toKey] }

      // Random control point for bezier curve
      const ctrl = {
        x: (from.x + to.x) / 2 + (Math.random() - 0.5) * 3,
        y: (from.y + to.y) / 2 + (Math.random() - 0.5) * 3,
        z: (from.z + to.z) / 2 + (Math.random() - 0.5) * 2,
      }

      this.particles.push({
        t: Math.random(),          // position along path [0,1]
        speed: 0.0008 + Math.random() * 0.0014,
        from,
        to,
        ctrl,
        baseOpacity: 0.3 + Math.random() * 0.6,
        size: 0.015 + Math.random() * 0.025,
        // color channel: index into skill palette
        colorHue: Math.random(),
        pathIdx,
        // disturb offset
        ox: 0, oy: 0, oz: 0,
        // burst
        bursting: false,
        bvx: 0, bvy: 0, bvz: 0,
        bLife: 0,
      })
    }

    // Color palette based on skill groups
    this.colors = [
      new THREE.Color(0x00d4ff), // cyan  — programming
      new THREE.Color(0x0af5a0), // green — bigdata
      new THREE.Color(0xf59e0b), // amber — dataeng
      new THREE.Color(0x8b5cf6), // purple — databases
      new THREE.Color(0xf43f5e), // rose  — cloud
      new THREE.Color(0xe879f9), // pink  — workflow
    ]

    // Per-instance color buffer
    const colorAttr = new Float32Array(this.count * 3)
    for (let i = 0; i < this.count; i++) {
      const c = this.colors[this.particles[i].pathIdx % this.colors.length]
      colorAttr[i * 3] = c.r
      colorAttr[i * 3 + 1] = c.g
      colorAttr[i * 3 + 2] = c.b
    }
    this.mesh.instanceColor = new THREE.InstancedBufferAttribute(colorAttr, 3)

    this._dummy = new THREE.Object3D()
  }

  setMouse(mx, my) {
    // Convert normalized device coords to approx world position
    this.mouse.set(mx * 6, my * 4, 0)
  }

  setGestureState(state) {
    this.gestureState = state
  }

  setHandPosition(pos) {
    this.handPos = pos
  }

  addRipple(x, y) {
    this.ripples.push({ x, y, z: 0, life: 1.0 })
  }

  update(delta) {
    const dummy = this._dummy
    const isFist = this.gestureState === 'fist'
    const isOpen = this.gestureState === 'open'

    // Smooth hand world position
    if (this.handPos) {
      const targetX = this.handPos.x * 6
      const targetY = this.handPos.y * 4
      this.handWorld.x += (targetX - this.handWorld.x) * 0.12
      this.handWorld.y += (targetY - this.handWorld.y) * 0.12
    }

    for (let i = 0; i < this.count; i++) {
      const p = this.particles[i]

      if (p.bursting) {
        // Burst physics
        p.ox += p.bvx * delta
        p.oy += p.bvy * delta
        p.oz += p.bvz * delta
        p.bLife -= delta * 1.5
        p.bvx *= 0.95
        p.bvy *= 0.95
        p.bvz *= 0.95
        if (p.bLife <= 0) p.bursting = false
      } else {
        // Normal flow along bezier
        let speed = p.speed * 60 * delta
        if (isFist) speed *= 0.05   // converge slowdown
        if (isOpen) speed *= 1.8    // expand

        p.t += speed
        if (p.t > 1) p.t -= 1

        // Get base position on bezier early to compute pull/push offsets
        const bp = bezier3(p.from, p.ctrl, p.to, p.t)
        const currentPx = bp.x + p.ox
        const currentPy = bp.y + p.oy
        const currentPz = bp.z + p.oz

        // Hand-position based gesture overrides
        const hx = this.handWorld.x
        const hy = this.handWorld.y

        if (isFist && this.handPos) {
          // Pull toward hand position
          const pull = 0.08
          p.ox += (hx - bp.x - p.ox) * pull
          p.oy += (hy - bp.y - p.oy) * pull
          p.oz += (0 - bp.z - p.oz) * pull * 0.5
        } else if (isOpen && this.handPos) {
          // Push away from hand position
          const dx = currentPx - hx
          const dy = currentPy - hy
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.1
          const nx = dx / dist
          const ny = dy / dist
          const spreadForce = 0.1 / (0.5 + dist * 0.5)
          
          p.ox += nx * spreadForce
          p.oy += ny * spreadForce
          
          p.ox *= 0.96
          p.oy *= 0.96
          p.oz *= 0.96
        } else if (this.handPos) {
          // Gentle attraction toward hand when visible but idle
          const dx = hx - currentPx
          const dy = hy - currentPy
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.1
          if (dist < 3) {
            const attract = 0.003 / (0.3 + dist)
            p.ox += dx * attract
            p.oy += dy * attract
          }
          p.ox *= 0.95
          p.oy *= 0.95
          p.oz *= 0.95
        } else {
          // Normal: decay offsets
          p.ox *= 0.95
          p.oy *= 0.95
          p.oz *= 0.95
        }
      }

      // Get base position on bezier
      const bp = bezier3(p.from, p.ctrl, p.to, p.t)
      const px = bp.x + p.ox
      const py = bp.y + p.oy
      const pz = bp.z + p.oz

      // Mouse repulsion
      const mdx = px - this.mouse.x
      const mdy = py - this.mouse.y
      const mDist = Math.sqrt(mdx * mdx + mdy * mdy)
      if (mDist < 1.5 && mDist > 0.01) {
        const force = (1.5 - mDist) * 0.04
        p.ox += (mdx / mDist) * force
        p.oy += (mdy / mDist) * force
      }

      // Ripple effect
      for (const r of this.ripples) {
        const rdx = px - r.x
        const rdy = py - r.y
        const rDist = Math.sqrt(rdx * rdx + rdy * rdy) + 0.01
        const rForce = r.life * 0.12 / rDist
        if (rDist < 3) {
          p.ox += (rdx / rDist) * rForce
          p.oy += (rdy / rDist) * rForce
        }
      }

      // Clamp extreme offsets
      const maxOff = 3
      p.ox = Math.max(-maxOff, Math.min(maxOff, p.ox))
      p.oy = Math.max(-maxOff, Math.min(maxOff, p.oy))
      p.oz = Math.max(-maxOff / 2, Math.min(maxOff / 2, p.oz))

      // Scale based on proximity to mouse (highlight near cursor)
      const scale = p.size * (mDist < 0.8 ? 1.8 : 1.0)

      dummy.position.set(px, py, pz)
      dummy.scale.set(scale, scale, scale)
      dummy.updateMatrix()
      this.mesh.setMatrixAt(i, dummy.matrix)
    }

    // Decay ripples
    for (let r = this.ripples.length - 1; r >= 0; r--) {
      this.ripples[r].life -= delta * 1.2
      if (this.ripples[r].life <= 0) this.ripples.splice(r, 1)
    }

    this.mesh.instanceMatrix.needsUpdate = true
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true
  }

  triggerBurst(wx, wy) {
    // Find nearest ~80 particles and burst them
    let burst = 0
    for (let i = 0; i < this.count && burst < 80; i++) {
      const p = this.particles[i]
      const bp = bezier3(p.from, p.ctrl, p.to, p.t)
      const d = Math.sqrt((bp.x - wx) ** 2 + (bp.y - wy) ** 2)
      if (d < 2.5) {
        p.bursting = true
        const angle = Math.random() * Math.PI * 2
        const speed = 0.5 + Math.random() * 1.5
        p.bvx = Math.cos(angle) * speed * 0.1
        p.bvy = Math.sin(angle) * speed * 0.1
        p.bvz = (Math.random() - 0.5) * 0.05
        p.bLife = 0.6 + Math.random() * 0.4
        burst++
      }
    }
    this.addRipple(wx, wy)
  }

  dispose() {
    this.mesh.geometry.dispose()
    this.mesh.material.dispose()
    this.scene.remove(this.mesh)
  }
}
