import * as THREE from 'three'

/**
 * MicroParticles — Background depth layer of tiny ambient particles
 * Creates a starfield-like effect behind the main scene.
 * 
 * Gesture response:
 *   fist → particles pull inward toward center, compress into a dense core
 *   open → particles push outward, expanding the field
 *   normal → gentle ambient drift
 */

const MICRO_COUNT_DESKTOP = 2000
const MICRO_COUNT_MOBILE = 250

function isMobile() {
  return window.innerWidth < 768
}

export class MicroParticles {
  constructor(scene) {
    this.scene = scene
    this.count = isMobile() ? MICRO_COUNT_MOBILE : MICRO_COUNT_DESKTOP
    this.gestureState = 'normal'
    this.gestureBlend = 0 // 0 = normal, -1 = fist (converge), +1 = open (expand)
    this.handPos = null // { x, y } in NDC
    this.handWorldX = 0
    this.handWorldY = 0
    this._init()
  }

  _init() {
    // Positions buffer
    this.positions = new Float32Array(this.count * 3)
    // Base positions (home positions for each particle)
    this.basePositions = new Float32Array(this.count * 3)
    // Velocity offsets for organic drift
    this.velocities = new Float32Array(this.count * 3)
    // Per-particle phase for unique motion
    this.phases = new Float32Array(this.count)
    // Per-particle depth layer (0-1, affects z and responsiveness)
    this.depthLayers = new Float32Array(this.count)

    const spreadX = 18
    const spreadY = 12
    const depthNear = -3
    const depthFar = -12

    for (let i = 0; i < this.count; i++) {
      const x = (Math.random() - 0.5) * spreadX
      const y = (Math.random() - 0.5) * spreadY
      const z = depthNear + Math.random() * (depthFar - depthNear)

      this.basePositions[i * 3] = x
      this.basePositions[i * 3 + 1] = y
      this.basePositions[i * 3 + 2] = z

      this.positions[i * 3] = x
      this.positions[i * 3 + 1] = y
      this.positions[i * 3 + 2] = z

      this.velocities[i * 3] = 0
      this.velocities[i * 3 + 1] = 0
      this.velocities[i * 3 + 2] = 0

      this.phases[i] = Math.random() * Math.PI * 2
      this.depthLayers[i] = Math.random()
    }

    // Points geometry
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))

    // Per-particle size attribute
    const sizes = new Float32Array(this.count)
    for (let i = 0; i < this.count; i++) {
      sizes[i] = 0.8 + this.depthLayers[i] * 1.5 // far particles slightly larger to compensate for distance
    }
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))

    // Per-particle opacity attribute
    const opacities = new Float32Array(this.count)
    for (let i = 0; i < this.count; i++) {
      opacities[i] = 0.15 + Math.random() * 0.35
    }
    geometry.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1))
    this.opacityAttr = opacities

    // Per-particle color — subtle palette
    const colors = new Float32Array(this.count * 3)
    const palette = [
      new THREE.Color(0x00d4ff).multiplyScalar(0.3), // dim cyan
      new THREE.Color(0x0af5a0).multiplyScalar(0.25), // dim green
      new THREE.Color(0x8b5cf6).multiplyScalar(0.2),  // dim purple
      new THREE.Color(0x1a3a4a),                       // dark teal
      new THREE.Color(0x0d2a3a),                       // near-black blue
    ]
    for (let i = 0; i < this.count; i++) {
      const c = palette[Math.floor(Math.random() * palette.length)]
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    // Custom shader material for point sprites with per-particle size/opacity
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        attribute float aSize;
        attribute float aOpacity;
        varying float vOpacity;
        varying vec3 vColor;

        void main() {
          vOpacity = aOpacity;
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * (200.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vOpacity;
        varying vec3 vColor;

        void main() {
          // Soft circular point
          float d = length(gl_PointCoord - 0.5) * 2.0;
          if (d > 1.0) discard;
          float alpha = vOpacity * (1.0 - d * d);
          // Subtle glow falloff
          alpha *= smoothstep(1.0, 0.3, d);
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      vertexColors: true,
    })

    this.points = new THREE.Points(geometry, material)
    this.points.renderOrder = -1 // render behind everything
    this.scene.add(this.points)
    this.geometry = geometry
  }

  setGestureState(state) {
    this.gestureState = state
  }

  setHandPosition(pos) {
    this.handPos = pos
  }

  update(delta, elapsedTime) {
    // Smooth blend toward target gesture
    let targetBlend = 0
    if (this.gestureState === 'fist') targetBlend = -1
    else if (this.gestureState === 'open') targetBlend = 1

    this.gestureBlend += (targetBlend - this.gestureBlend) * 0.04

    // Smooth hand world position
    if (this.handPos) {
      const tx = this.handPos.x * 12  // wider range for background
      const ty = this.handPos.y * 8
      this.handWorldX += (tx - this.handWorldX) * 0.08
      this.handWorldY += (ty - this.handWorldY) * 0.08
    }

    const posAttr = this.geometry.attributes.position
    const opAttr = this.geometry.attributes.aOpacity

    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3
      const phase = this.phases[i]
      const depth = this.depthLayers[i]

      const bx = this.basePositions[i3]
      const by = this.basePositions[i3 + 1]
      const bz = this.basePositions[i3 + 2]

      // Ambient drift
      const driftSpeed = 0.15 + depth * 0.1
      const driftAmp = 0.3 + depth * 0.2
      const driftX = Math.sin(elapsedTime * driftSpeed + phase) * driftAmp * 0.5
      const driftY = Math.cos(elapsedTime * driftSpeed * 0.7 + phase * 1.3) * driftAmp * 0.3
      const driftZ = Math.sin(elapsedTime * driftSpeed * 0.4 + phase * 2.1) * driftAmp * 0.15

      let tx = bx + driftX
      let ty = by + driftY
      let tz = bz + driftZ

      // Gesture influence — toward/away from hand position
      if (this.gestureBlend < -0.05 && this.handPos) {
        // Fist — pull toward hand position
        const pull = -this.gestureBlend
        const convergeFactor = pull * (0.5 + depth * 0.3)
        tx = tx + (this.handWorldX - tx) * convergeFactor
        ty = ty + (this.handWorldY - ty) * convergeFactor
        tz = tz + pull * (-2 - tz) * 0.2 // pull toward mid-depth
      } else if (this.gestureBlend > 0.05 && this.handPos) {
        // Open — push away from hand position
        const push = this.gestureBlend
        const dx = tx - this.handWorldX
        const dy = ty - this.handWorldY
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.1
        const expandForce = push * (0.6 + depth * 0.4) / (0.5 + dist * 0.3)
        tx += (dx / dist) * expandForce
        ty += (dy / dist) * expandForce
        tz = tz - push * 1.5 * depth // push deeper
      }

      // Smooth toward target position
      const smooth = 0.06
      this.positions[i3] += (tx - this.positions[i3]) * smooth
      this.positions[i3 + 1] += (ty - this.positions[i3 + 1]) * smooth
      this.positions[i3 + 2] += (tz - this.positions[i3 + 2]) * smooth

      // Opacity pulse — subtle twinkle
      const baseOp = 0.15 + depth * 0.2
      const twinkle = Math.sin(elapsedTime * (0.5 + depth * 0.8) + phase * 3) * 0.1
      let op = baseOp + twinkle

      // Fist: brighten as they converge
      if (this.gestureBlend < -0.05) {
        op += -this.gestureBlend * 0.25
      }
      // Open: dim as they spread
      if (this.gestureBlend > 0.05) {
        op -= this.gestureBlend * 0.08
      }

      this.opacityAttr[i] = Math.max(0.04, Math.min(0.6, op))
    }

    posAttr.needsUpdate = true
    opAttr.needsUpdate = true
  }

  dispose() {
    this.geometry.dispose()
    this.points.material.dispose()
    this.scene.remove(this.points)
  }
}
