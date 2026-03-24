import * as THREE from 'three'
import { nodePositions } from '../data/karthik.js'

/**
 * SpatialGraph — Renders scene nodes and animated flow connections
 * Nodes represent portfolio sections: hub, pipeline, projects, skills, certs, education
 */

const NODE_CONFIG = {
  hub:       { label: 'KARTHIK NP',   color: 0x00d4ff, size: 0.28, glowSize: 0.6 },
  pipeline:  { label: 'EXPERIENCE',   color: 0x0af5a0, size: 0.18, glowSize: 0.4 },
  projects:  { label: 'PROJECTS',     color: 0x8b5cf6, size: 0.18, glowSize: 0.4 },
  skills:    { label: 'SKILLS',       color: 0xf59e0b, size: 0.18, glowSize: 0.4 },
  certs:     { label: 'CERTIFICATIONS', color: 0xf43f5e, size: 0.16, glowSize: 0.35 },
  education: { label: 'EDUCATION',    color: 0xe879f9, size: 0.16, glowSize: 0.35 },
}

const CONNECTIONS = [
  ['hub', 'pipeline'],
  ['hub', 'projects'],
  ['hub', 'skills'],
  ['hub', 'certs'],
  ['hub', 'education'],
  ['pipeline', 'projects'],
  ['skills', 'certs'],
]

export class SpatialGraph {
  constructor(scene) {
    this.scene = scene
    this.nodes = {}
    this.lines = []
    this.clock = new THREE.Clock()
    this.activeNode = null
    this._init()
  }

  _init() {
    this._createNodes()
    this._createConnections()
  }

  _createNodes() {
    for (const [key, cfg] of Object.entries(NODE_CONFIG)) {
      const pos = nodePositions[key]
      const group = new THREE.Group()
      group.position.set(pos.x, pos.y, pos.z)
      group.userData = { nodeKey: key, config: cfg }

      // Core sphere
      const coreGeo = new THREE.SphereGeometry(cfg.size, 16, 16)
      const coreMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.85,
      })
      const core = new THREE.Mesh(coreGeo, coreMat)
      group.add(core)

      // Glow ring (torus)
      const ringGeo = new THREE.TorusGeometry(cfg.glowSize, 0.01, 8, 32)
      const ringMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.35,
      })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      group.add(ring)

      // Outer glow halo (larger ring)
      const haloGeo = new THREE.TorusGeometry(cfg.glowSize * 1.8, 0.005, 4, 32)
      const haloMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.15,
      })
      const halo = new THREE.Mesh(haloGeo, haloMat)
      group.add(halo)

      this.scene.add(group)
      this.nodes[key] = { group, core, ring, halo, cfg, pos }
    }
  }

  _createConnections() {
    for (const [fromKey, toKey] of CONNECTIONS) {
      const from = new THREE.Vector3(
        nodePositions[fromKey].x,
        nodePositions[fromKey].y,
        nodePositions[fromKey].z
      )
      const to = new THREE.Vector3(
        nodePositions[toKey].x,
        nodePositions[toKey].y,
        nodePositions[toKey].z
      )

      // Bezier curve for the connection
      const ctrl = new THREE.Vector3(
        (from.x + to.x) / 2 + (Math.random() - 0.5) * 1.5,
        (from.y + to.y) / 2 + (Math.random() - 0.5) * 1.5,
        (from.z + to.z) / 2,
      )

      const curve = new THREE.QuadraticBezierCurve3(from, ctrl, to)
      const points = curve.getPoints(40)
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points)
      const lineMat = new THREE.LineBasicMaterial({
        color: NODE_CONFIG[fromKey].color,
        transparent: true,
        opacity: 0.18,
      })
      const line = new THREE.Line(lineGeo, lineMat)
      this.scene.add(line)
      this.lines.push({ line, lineMat, fromKey, toKey, phase: Math.random() * Math.PI * 2 })
    }
  }

  setActiveNode(nodeKey) {
    this.activeNode = nodeKey
  }

  getNodesForRaycasting() {
    return Object.entries(this.nodes).map(([key, n]) => ({
      mesh: n.core,
      key,
    }))
  }

  update() {
    const t = this.clock.getElapsedTime()

    for (const [key, node] of Object.entries(this.nodes)) {
      const isActive = this.activeNode === key
      const isHub = key === 'hub'

      // Pulse scale on core
      const pulse = 1 + Math.sin(t * 1.8 + (isHub ? 0 : Math.PI)) * 0.05
      node.core.scale.setScalar(isActive ? 1.4 : pulse)

      // Ring rotation
      node.ring.rotation.x = t * 0.4 + node.cfg.size * 2
      node.ring.rotation.y = t * 0.6

      // Halo rotation (counter)
      node.halo.rotation.x = -t * 0.25
      node.halo.rotation.z = t * 0.35

      // Opacity pulse
      const op = 0.25 + Math.sin(t * 2.2 + (isHub ? 0 : 1)) * 0.15
      node.ring.material.opacity = isActive ? 0.7 : op
      node.halo.material.opacity = isActive ? 0.3 : op * 0.5
      node.core.material.opacity = isActive ? 1.0 : 0.8

      // Gentle float
      node.group.position.y = nodePositions[key].y + Math.sin(t * 0.8 + key.length) * 0.08
    }

    // Animate connection line opacities
    for (const conn of this.lines) {
      const baseOp = this.activeNode === conn.fromKey || this.activeNode === conn.toKey ? 0.5 : 0.18
      conn.lineMat.opacity = baseOp + Math.sin(t * 1.5 + conn.phase) * 0.08
    }
  }

  dispose() {
    for (const [, node] of Object.entries(this.nodes)) {
      node.core.geometry.dispose()
      node.core.material.dispose()
      node.ring.geometry.dispose()
      node.ring.material.dispose()
      node.halo.geometry.dispose()
      node.halo.material.dispose()
      this.scene.remove(node.group)
    }
    for (const conn of this.lines) {
      conn.line.geometry.dispose()
      conn.lineMat.dispose()
      this.scene.remove(conn.line)
    }
  }
}
