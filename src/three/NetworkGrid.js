import * as THREE from 'three'
import { threeColors } from '../design-tokens.js'

/**
 * NetworkGrid — Premium geometric lattice background
 *
 * Three depth planes of dots + lines creating parallax.
 * Audio reactivity: opacity and dot size pulse with bass.
 */

const GRID_ROWS = 12
const GRID_COLS = 18
const SPACING = 1.2
const LAYERS = [
  { z: -10,  opacity: 0.02,  dotSize: 1.2, scale: 2.0 },
  { z: -25,  opacity: 0.012, dotSize: 0.8, scale: 3.5 },
  { z: -45,  opacity: 0.007, dotSize: 0.5, scale: 5.0 },
]

export class NetworkGrid {
  constructor(scene) {
    this.scene = scene
    this.gestureState = 'normal'
    this.handPos = null
    this.handWorld = new THREE.Vector3()
    this.activeSection = null
    this.audioData = { bass: 0, mid: 0, treble: 0, overall: 0 }
    this.layers = []
    this.isMobile = window.innerWidth < 768
    this._init()
  }

  _init() {
    for (const layer of LAYERS) {
      this._createLayer(layer)
    }
  }

  _createLayer({ z, opacity, dotSize, scale }) {
    const halfX = (GRID_COLS - 1) * SPACING * scale / 2
    const halfY = (GRID_ROWS - 1) * SPACING * scale / 2

    const dotPositions = []
    const dotBasePositions = []
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const x = col * SPACING * scale - halfX
        const y = row * SPACING * scale - halfY
        dotPositions.push(x, y, z)
        dotBasePositions.push(x, y, z)
      }
    }

    const dotGeo = new THREE.BufferGeometry()
    dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(dotPositions, 3))

    const dotMat = new THREE.PointsMaterial({
      color: threeColors.gridDot,
      size: dotSize,
      sizeAttenuation: true,
      transparent: true,
      opacity: opacity * 2.5,
      depthWrite: false,
    })

    const dots = new THREE.Points(dotGeo, dotMat)
    dots.renderOrder = -2
    this.scene.add(dots)

    const linePositions = []
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const x = col * SPACING * scale - halfX
        const y = row * SPACING * scale - halfY

        if (col < GRID_COLS - 1 && Math.random() > 0.35) {
          const nx = (col + 1) * SPACING * scale - halfX
          linePositions.push(x, y, z, nx, y, z)
        }
        if (row < GRID_ROWS - 1 && Math.random() > 0.35) {
          const ny = (row + 1) * SPACING * scale - halfY
          linePositions.push(x, y, z, x, ny, z)
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))

    const lineMat = new THREE.LineBasicMaterial({
      color: threeColors.gridLine,
      transparent: true,
      opacity: opacity,
      depthWrite: false,
    })

    const lines = new THREE.LineSegments(lineGeo, lineMat)
    lines.renderOrder = -2
    this.scene.add(lines)

    this.layers.push({
      dots, dotGeo, dotMat, dotBasePositions: [...dotBasePositions],
      lines, lineGeo, lineMat,
      z, baseOpacity: opacity,
    })
  }

  setActiveSection(section) { this.activeSection = section }
  setGestureState(state)    { this.gestureState = state }
  setHandPosition(pos)      { this.handPos = pos }
  setAudioData(data)        { this.audioData = data }

  update(delta, elapsedTime) {
    if (this.handPos) {
      this.handWorld.x += (this.handPos.x * 10 - this.handWorld.x) * 0.06
      this.handWorld.y += (this.handPos.y * 7 - this.handWorld.y) * 0.06
    }

    for (const layer of this.layers) {
      const posAttr = layer.dotGeo.attributes.position
      const base = layer.dotBasePositions
      const hx = this.handWorld.x
      const hy = this.handWorld.y

      for (let i = 0; i < posAttr.count; i++) {
        let bx = base[i * 3]
        let by = base[i * 3 + 1]
        let bz = base[i * 3 + 2]

        bx += Math.sin(elapsedTime * 0.15 + i * 0.1) * 0.05
        by += Math.cos(elapsedTime * 0.12 + i * 0.15) * 0.05

        // Extremely slight magnetic push/pull just to give life to the background grid
        if (this.handPos) {
           const dx = bx - hx
           const dy = by - hy
           const dist = Math.sqrt(dx*dx + dy*dy) || 0.1
           if (dist < 6) {
             const push = 0.05 / (0.5 + dist*0.3)
             bx += dx*push
             by += dy*push
           }
        }
        posAttr.setXYZ(i, bx, by, bz)
      }
      posAttr.needsUpdate = true

      let opMult = 1.0
      if (this.isMobile) opMult *= 0.3

      layer.lineMat.opacity = layer.baseOpacity * opMult
      layer.dotMat.opacity = layer.baseOpacity * 2.5 * opMult
      layer.dotMat.size = (layer === this.layers[0] ? 1.5 : layer === this.layers[1] ? 1.0 : 0.7)
    }
  }

  dispose() {
    for (const layer of this.layers) {
      layer.dotGeo.dispose()
      layer.dotMat.dispose()
      layer.lineGeo.dispose()
      layer.lineMat.dispose()
      this.scene.remove(layer.dots)
      this.scene.remove(layer.lines)
    }
  }
}
