import * as THREE from 'three'
import { nodePositions } from '../data/karthik.js'
import { threeColors } from '../design-tokens.js'

/**
 * SpatialGraph — Renders scene nodes and animated flow connections
 * Nodes represent portfolio sections: hub, pipeline, projects, skills, certs, education
 */

const NODE_CONFIG = {
  hub:       { label: 'KARTHIK NP',   color: threeColors.section.hub, size: 0.25, boundaries: 0.5 },
  pipeline:  { label: 'EXPERIENCE',   color: threeColors.section.pipeline, size: 0.15, boundaries: 0.35 },
  projects:  { label: 'PROJECTS',     color: threeColors.section.projects, size: 0.15, boundaries: 0.35 },
  skills:    { label: 'SKILLS',       color: threeColors.section.skills, size: 0.15, boundaries: 0.35 },
  certs:     { label: 'CERTIFICATIONS', color: threeColors.section.certs, size: 0.12, boundaries: 0.3 },
  education: { label: 'EDUCATION',    color: threeColors.section.education, size: 0.12, boundaries: 0.3 },
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
    this.packets = [] // For animated data passing between nodes
    this.clock = new THREE.Clock()
    this.activeNode = null
    this.hoveredNode = null
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

      // Core Data Node (Frosted Glass / Crystal feel)
      const coreGeo = new THREE.IcosahedronGeometry(cfg.size, 2) // slightly higher poly
      const coreMat = new THREE.MeshPhysicalMaterial({
        color: cfg.color,
        roughness: 0.15,
        transmission: 0.95,
        thickness: 0.5,
        transparent: true,
        opacity: 1,
      })
      const core = new THREE.Mesh(coreGeo, coreMat)
      group.add(core)

      // Aura Glow (Pulsing transparent outer sphere)
      const auraGeo = new THREE.SphereGeometry(cfg.size * 2.2, 32, 32)
      const auraMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
      const aura = new THREE.Mesh(auraGeo, auraMat)
      group.add(aura)

      // Technical boundary (Wireframe cage)
      const cageGeo = new THREE.IcosahedronGeometry(cfg.boundaries, 2)
      const cageMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        wireframe: true,
        transparent: true,
        opacity: 0.08,
      })
      const cage = new THREE.Mesh(cageGeo, cageMat)
      group.add(cage)

      // Inner orbital element
      const orbitalGeo = new THREE.RingGeometry(cfg.boundaries * 0.8, cfg.boundaries * 0.82, 32)
      const orbitalMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.15,
      })
      const orbital = new THREE.Mesh(orbitalGeo, orbitalMat)
      orbital.rotation.x = Math.PI / 2
      group.add(orbital)

      this.scene.add(group)
      this.nodes[key] = { group, core, aura, cage, orbital, cfg, pos }
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

      // Precision lines with a very slight arc for a clean structural look
      const distance = from.distanceTo(to)
      const ctrl = new THREE.Vector3(
        (from.x + to.x) / 2,
        (from.y + to.y) / 2 + distance * 0.1, // very slight upward arc
        (from.z + to.z) / 2,
      )

      const curve = new THREE.QuadraticBezierCurve3(from, ctrl, to)
      const points = curve.getPoints(50)
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points)
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x3A3A48, // slate accent for dark theme
        transparent: true,
        opacity: 0.3,
      })
      const line = new THREE.Line(lineGeo, lineMat)
      this.scene.add(line)
      
      this.lines.push({ line, lineMat, curve, fromKey, toKey })

      // Create flowing data packets traversing the pipeline
      const numPackets = 2
      for (let i = 0; i < numPackets; i++) {
        const packetMat = new THREE.MeshBasicMaterial({
          color: NODE_CONFIG[fromKey].color,
          transparent: true,
          opacity: 0.8
        })
        const packetGeo = new THREE.SphereGeometry(0.02, 8, 8)
        const packet = new THREE.Mesh(packetGeo, packetMat)
        this.scene.add(packet)
        
        this.packets.push({
          mesh: packet,
          curve: curve,
          progress: i * (1 / numPackets),
          speed: 0.15 + Math.random() * 0.1, // variance in flow speed
          baseColor: NODE_CONFIG[fromKey].color,
          activeColor: NODE_CONFIG[toKey].color,
          fromKey, toKey
        })
      }
    }
  }

  setActiveNode(nodeKey) {
    this.activeNode = nodeKey
  }

  setHoveredNode(nodeKey) {
    this.hoveredNode = nodeKey
  }

  getNodesForRaycasting() {
    return Object.entries(this.nodes).map(([key, n]) => ({
      mesh: n.core,
      key,
    }))
  }

  update() {
    const t = this.clock.getElapsedTime()

    // 1. Update Core Nodes
    for (const [key, node] of Object.entries(this.nodes)) {
      const isActive = this.activeNode === key
      const isHovered = this.hoveredNode === key
      const isHub = key === 'hub'

      // Slow, deliberate rotation of the core data mesh
      node.core.rotation.y = t * 0.2
      node.core.rotation.x = t * 0.1

      // Subtle pulse and scale up on active or hovered
      const pulse = 1 + Math.sin(t * 1.5 + (isHub ? 0 : Math.PI)) * 0.02
      node.core.scale.setScalar(isActive ? 1.3 : isHovered ? 1.15 : pulse)

      // Aura pulse and scaling
      const auraPulse = 0.25 + Math.sin(t * 2 + key.length) * 0.1
      node.aura.material.opacity = isActive ? 0.6 : isHovered ? 0.45 : auraPulse
      node.aura.scale.setScalar(isActive ? 1.5 : isHovered ? 1.35 : 1 + Math.sin(t * 1.5) * 0.08)

      // Technical cage rotation (counter to core)
      node.cage.rotation.y = -t * 0.1
      node.cage.rotation.z = t * 0.05
      
      // Orbital ring orientation
      node.orbital.rotation.x = (Math.PI / 2) + Math.sin(t * 0.5) * 0.2
      node.orbital.rotation.y = t * 0.5

      // Precision opacity management
      node.cage.material.opacity = isActive ? 0.2 : isHovered ? 0.15 : 0.05
      node.orbital.material.opacity = isActive ? 0.3 : isHovered ? 0.25 : 0.1
      node.core.material.opacity = isActive ? 1.0 : isHovered ? 0.95 : 0.85

      // Micro-levitation
      node.group.position.y = nodePositions[key].y + Math.sin(t * 1.2 + key.length) * 0.04
    }

    // 2. Update Connection Lines
    for (const conn of this.lines) {
      const isConnectedToActive = this.activeNode === conn.fromKey || this.activeNode === conn.toKey
      const isConnectedToHovered = this.hoveredNode === conn.fromKey || this.hoveredNode === conn.toKey
      
      conn.lineMat.opacity = isConnectedToActive ? 0.6 : isConnectedToHovered ? 0.4 : 0.15
      
      if (isConnectedToActive) {
        conn.lineMat.color.setHex(NODE_CONFIG[this.activeNode].color)
      } else if (isConnectedToHovered && this.hoveredNode) {
        conn.lineMat.color.setHex(NODE_CONFIG[this.hoveredNode].color)
      } else {
        conn.lineMat.color.setHex(0x52525B)
      }
    }

    // 3. Update Data Packets (Pulsing data flow along splines)
    const dt = 0.016 // approximate delta time for uniform speed
    for (const packet of this.packets) {
      packet.progress += packet.speed * dt
      if (packet.progress > 1) {
        packet.progress = 0 // loop packet traversal
      }

      // Hide packets if nodes aren't active, to keep UI clean, or emphasize them if they are in the active flow path
      const isPathActive = this.activeNode === null || this.activeNode === packet.fromKey || this.activeNode === packet.toKey
      packet.mesh.material.opacity = isPathActive ? 0.9 : 0.1

      if (isPathActive) {
        // Gradient color transition from source to sink
        const c1 = new THREE.Color(packet.baseColor)
        const c2 = new THREE.Color(packet.activeColor)
        packet.mesh.material.color.copy(c1.lerp(c2, packet.progress))
        // Pulse size
        const scale = 1 + Math.sin(packet.progress * Math.PI * 4) * 0.5
        packet.mesh.scale.setScalar(scale)
      }

      const point = packet.curve.getPoint(packet.progress)
      packet.mesh.position.copy(point)
    }
  }

  dispose() {
    for (const [, node] of Object.entries(this.nodes)) {
      node.core.geometry.dispose()
      node.core.material.dispose()
      node.aura.geometry.dispose()
      node.aura.material.dispose()
      node.cage.geometry.dispose()
      node.cage.material.dispose()
      node.orbital.geometry.dispose()
      node.orbital.material.dispose()
      this.scene.remove(node.group)
    }
    for (const conn of this.lines) {
      conn.line.geometry.dispose()
      conn.lineMat.dispose()
      this.scene.remove(conn.line)
    }
    for (const p of this.packets) {
      p.mesh.geometry.dispose()
      p.mesh.material.dispose()
      this.scene.remove(p.mesh)
    }
  }
}
