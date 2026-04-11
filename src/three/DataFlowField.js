import * as THREE from 'three'
import { colors } from '../design-tokens.js'

/**
 * DataFlowField — Per-Section Geometric Formations
 *
 * Each section has a precise geometric shape that maps to its sys.diagram concept.
 * Particles smoothly morph (lerp) between formations when the section changes.
 * Uses THREE.Points for optimal GPU performance.
 */

const COUNT_DESKTOP = 2200
const COUNT_MOBILE  = 900
const isMobileDevice = () => window.innerWidth < 768

// ─── FORMATION FUNCTIONS ─────────────────────────────────────────────────────
// Each returns { x, z } target for particle i at given elapsedTime.
// Y is gently oscillated by the update loop for subtle life.

const formations = {

  // BRONZE: INGEST — A sweeping, majestic 3D Data River / Lake undulating with pure data streams.
  rawIngest(i, count, t) {
    const cols = Math.floor(Math.sqrt(count * 2.5));
    const rows = Math.ceil(count / cols);
    const cx = (i % cols) / cols - 0.5;
    const cz = Math.floor(i / cols) / rows - 0.5;
    
    const x = cx * 18.0;
    const z = cz * 12.0; 
    
    // Superposition of fluid waves for a hyper-smooth undulating surface
    const wave1 = Math.sin(x * 0.4 + t) * 1.5;
    const wave2 = Math.cos(z * 0.5 - t * 0.8) * 1.5;
    const wave3 = Math.sin((x + z) * 0.3 + t * 1.2) * 1.0;
    
    // Add particle thickness to the water surface
    const noise = Math.sin(i * 12.3) * 0.4;
    
    return { 
      x, 
      y: wave1 + wave2 + wave3 - 1.0 + noise, 
      z 
    }
  },

  // SILVER: DATA CLEANSING — An impossibly smooth Hourglass Funnel filtering chaotic data
  dataCleansing(i, count, t) {
    const t_l = i / count; 
    const y = 5.0 - t_l * 10.0; 
    
    // Hyperbola radius math for an exact hourglass pinch
    const radius = 0.4 + Math.pow(y * 0.28, 2) * 1.5;
    
    // 6 distinct glowing spiral ribbons sliding down the hourglass
    const strands = 6;
    const strandIdx = i % strands;
    const angleOffset = (Math.PI * 2 / strands) * strandIdx;
    
    // Twist accelerates as it reaches the center choke point
    const twist = Math.sin(t_l * Math.PI) * 4.0; 
    const angle = angleOffset + twist - t * 2.0;

    const thick = Math.sin(i * 11.3) * 0.4;
    
    return {
      x: Math.cos(angle) * (radius + thick),
      y: y,
      z: Math.sin(angle) * (radius + thick),
    }
  },

  // SILVER: CONFORMED MODELS — A breathtaking Star Schema (Dense Fact Core + Orbiting Dimensions)
  conformedModels(i, count, t) {
    const coreCount = Math.floor(count * 0.4); 
    
    if (i < coreCount) {
      // Intense, super-dense central sphere (Fact Table)
      const phi = Math.acos(1 - 2 * (i + 0.5) / coreCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const R = 2.0 + Math.sin(t * 2.0 + i) * 0.1; 
      return {
        x: Math.sin(phi) * Math.cos(theta + t * 0.4) * R,
        y: Math.cos(phi) * R,
        z: Math.sin(phi) * Math.sin(theta + t * 0.4) * R,
      }
    } else {
      // Exactly 5 precisely orbiting structural spheres (Dimension Tables)
      const sats = 5;
      const satIdx = i % sats;
      const t_sat = Math.PI * 2 * (satIdx / sats);
      
      const orbitR = 6.0;
      const orbitSpin = t * 0.6;
      
      const cx = Math.cos(t_sat + orbitSpin) * orbitR;
      const cz = Math.sin(t_sat + orbitSpin) * orbitR;
      const cy = Math.sin(t_sat * 3 + t * 0.5) * 1.5; 
      
      const pIdx = i - coreCount;
      const phi = Math.acos(1 - 2 * ((pIdx / sats) % 1));
      const theta = Math.PI * (1 + Math.sqrt(5)) * pIdx;
      const R = 1.0;
      
      return {
        x: cx + Math.sin(phi) * Math.cos(theta) * R,
        y: cy + Math.cos(phi) * R,
        z: cz + Math.sin(phi) * Math.sin(theta) * R,
      }
    }
  },

  // ORCHESTRATION: DAG PIPELINES — Particles physically flowing rapidly along graph branch edges
  dagPipelines(i, count, t) {
    const n = [
      {x: 0, y: 5.0, z: 0},     
      {x: -4.5, y: 1.5, z: 2.5},    
      {x:  4.5, y: 1.5, z: -2.5},   
      {x: -4.5, y: -2.0, z: -2.5},  
      {x:  4.5, y: -2.0, z: 2.5},   
      {x: 0, y: -5.0, z: 0},    
    ];
    // Directed graph data flows
    const edges = [
      [0, 1], [0, 2],
      [1, 3], [1, 4], [2, 4],
      [3, 5], [4, 5]
    ];
    
    // Track data packets actively travelling the pathways
    const edgeIdx = i % edges.length;
    const edge = edges[edgeIdx];
    const p1 = n[edge[0]];
    const p2 = n[edge[1]];
    
    // Infinite loop progression from Start Node to End Node on the wire
    const progress = ((t * 0.5 + (i / count) * 15) % 1); 
    
    const x = p1.x + (p2.x - p1.x) * progress;
    const y = p1.y + (p2.y - p1.y) * progress;
    const z = p1.z + (p2.z - p1.z) * progress;
    
    // Cylindrical wire volume
    const thick = 0.4 + Math.sin(progress * Math.PI) * 0.15; 
    const a = i * 2.3;
    
    return {
      x: x + Math.cos(a) * thick,
      y: y + Math.sin(a) * thick,
      z: z + Math.cos(a * 1.3) * thick,
    };
  },

  // GOLD: BUSINESS AGGREGATION — An exquisite Golden Spiral (Nautilus galaxy) of ascending truths.
  businessAggregation(i, count, t) {
    const t_l = i / count; 
    const R = Math.pow(1.6180339, t_l * 4.5) * 0.6; // Fibonacci growth
    
    const angle = t_l * Math.PI * 2 * 6 - t * 0.7; // 6 winding revolutions
    
    // Sweeps up into a conical blooming flower
    const y = -4.0 + t_l * 8.0; 
    
    // Split into 3 magnificent sweeping arms
    const arms = 3;
    const armAngle = (i % arms) * (Math.PI * 2 / arms);
    const finalAngle = angle + armAngle;
    
    const noiseOuter = Math.sin(i * 14.1) * 0.6 * t_l; 
    
    return {
      x: Math.cos(finalAngle) * (R + noiseOuter),
      y: y,
      z: Math.sin(finalAngle) * (R + noiseOuter),
    }
  },

  // GOVERNANCE & CATALOG — An ancient Astrolabe / Gyroscope of interlocking regulatory rules.
  governanceCatalog(i, count, t) {
    const rings = 4;
    const rIdx = i % rings;
    const pointsPerRing = count / rings;
    const pIdx = Math.floor(i / rings);
    
    // Baseline circle mathematics
    const angle = (pIdx / pointsPerRing) * Math.PI * 2;
    const R = 4.2;
    
    // Torus / structural ring thickness
    const thickR = Math.sin(i * 7.1) * 0.35;
    const thickZ = Math.cos(i * 8.3) * 0.35;
    const x = Math.cos(angle) * (R + thickR);
    const y = Math.sin(angle) * (R + thickR);
    const z = thickZ;
    
    // Universal spinning axis rotation per ring
    let rx = x, ry = y, rz = z;
    const tSpin = t * 0.6;
    
    if (rIdx === 0) {
      // Ring 0: Rotate solely around Y
      rx = x * Math.cos(tSpin) - z * Math.sin(tSpin);
      ry = y;
      rz = x * Math.sin(tSpin) + z * Math.cos(tSpin);
    } else if (rIdx === 1) {
      // Ring 1: Rotate solely around X
      rx = x;
      ry = y * Math.cos(tSpin * 1.3) - z * Math.sin(tSpin * 1.3);
      rz = y * Math.sin(tSpin * 1.3) + z * Math.cos(tSpin * 1.3);
    } else if (rIdx === 2) {
      // Ring 2: Static but physically tilted 45 degrees
      const tilt = Math.PI / 4;
      rx = x * Math.cos(tilt) - z * Math.sin(tilt);
      ry = y;
      rz = x * Math.sin(tilt) + z * Math.cos(tilt);
    } else {
      // Ring 3 / Internal spherical core containing the master catalog
      const phi = Math.acos(1 - 2 * (pIdx + 0.5) / pointsPerRing);
      const theta = Math.PI * (1 + Math.sqrt(5)) * pIdx;
      const coreR = 1.6;
      rx = Math.sin(phi) * Math.cos(theta - tSpin * 2) * coreR;
      ry = Math.cos(phi) * coreR;
      rz = Math.sin(phi) * Math.sin(theta - tSpin * 2) * coreR;
    }
    
    return { x: rx, y: ry, z: rz };
  },

  // SERVING: BI ANALYTICS — An awe-inspiring curved 3D Command-Center Dashboard wall.
  biAnalytics(i, count, t) {
    const cols = 15;
    const colIdx = i % cols;
    
    // Create an immersive cinematic sweeping curve enveloping the screen
    const angle = (colIdx / (cols - 1)) * Math.PI * 0.8 - Math.PI * 0.4; 
    const R = 6.5;
    
    // Calculate live dynamic equalizer heights responding to invisible math algorithms
    const targetHeightRatio = Math.sin(colIdx * 43.1 + t * 1.8) * 0.35 + 0.65; 
    
    // Distribute remaining dots to construct the pillar structure up to the target height
    const pointsInCol = count / cols;
    const pIdx = Math.floor(i / cols); 
    
    const yHeightLevel = (pIdx / pointsInCol) * targetHeightRatio; 
    const y = -3.0 + yHeightLevel * 6.5;
    
    // Expand mathematical line pillars into glowing dense structural tubes
    const dx = Math.sin(i * 4.3) * 0.3;
    const dz = Math.cos(i * 5.7) * 0.3;
    
    return {
      x: Math.sin(angle) * R + dx,
      y: y,
      z: Math.cos(angle) * R - 2.0 + dz,
    }
  },
}

const SECTION_ORDER = ['hub', 'pipeline', 'skills', 'projects', 'certs', 'education', 'connect']

const FORMATION_MAP = {
  'hub': 'rawIngest',
  'pipeline': 'dataCleansing',
  'skills': 'conformedModels',
  'projects': 'dagPipelines',
  'certs': 'businessAggregation',
  'education': 'governanceCatalog',
  'connect': 'biAnalytics'
}

// ─── CLASS ───────────────────────────────────────────────────────────────────

export class DataFlowField {
  constructor(scene) {
    this.scene         = scene
    this.count         = isMobileDevice() ? COUNT_MOBILE : COUNT_DESKTOP
    this.gestureState  = 'normal'
    this.handPos       = null
    this.handWorld     = { x: 0, y: 0 }
    this.activeSection = 'hub'
    this._init()
  }

  _init() {
    const positions  = new Float32Array(this.count * 3)
    const colorArray = new Float32Array(this.count * 3)

    // Slate-to-white colour gradient extracted strictly from design-tokens
    const palette = [
      new THREE.Color('#ffffff'),          // Pure white core highlights
      new THREE.Color(colors.neutral[100]), // #CCD0CF Lightest text
      new THREE.Color(colors.neutral[300]), // #9BA8AB Secondary text (primary particle color)
      new THREE.Color(colors.neutral[400]), // #72828B
      new THREE.Color(colors.neutral[500]), // #4A5C6A Muted text/icons
    ]

    this.particles = []

    for (let i = 0; i < this.count; i++) {
      // Initialise at raw data (entry formation)
      const pos = formations.rawIngest(i, this.count, 0)
      this.particles.push({
        x: pos.x, y: pos.y, z: pos.z,
        ox: pos.x, oy: pos.y, oz: pos.z,
        vx: 0, vy: 0, vz: 0,
        phase: Math.random() * Math.PI * 2,
        speed: 0.8 + Math.random() * 0.6,
      })

      positions[i * 3]     = pos.x
      positions[i * 3 + 1] = pos.y
      positions[i * 3 + 2] = pos.z

      const c = palette[Math.floor(Math.random() * palette.length)]
      colorArray[i * 3]     = c.r
      colorArray[i * 3 + 1] = c.g
      colorArray[i * 3 + 2] = c.b
    }

    this.geo = new THREE.BufferGeometry()
    this.geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.geo.setAttribute('color',    new THREE.BufferAttribute(colorArray, 3))

    this.mat = new THREE.PointsMaterial({
      size:            isMobileDevice() ? 0.18 : 0.12,
      sizeAttenuation: true,
      vertexColors:    true,
      transparent:     true,
      opacity:         0.95,
      blending:        THREE.NormalBlending,
      depthWrite:      false,
    })

    this.points = new THREE.Points(this.geo, this.mat)
    this.scene.add(this.points)
  }

  setActiveSection(section) {
    if (section === this.activeSection) return
    this.activeSection = section
  }

  setGestureState(s) { this.gestureState = s }

  setHandPosition(p) {
    this.handPos = p
    if (p) {
      this.handWorld.x += (p.x * 8 - this.handWorld.x) * 0.08
      this.handWorld.y += (p.y * 6 - this.handWorld.y) * 0.08
    }
  }

  update(delta, elapsed) {
    const activeShape = FORMATION_MAP[this.activeSection] || 'rawIngest'
    const fn     = formations[activeShape] || formations.rawIngest
    const posArr = this.geo.attributes.position.array

    // Lerp speed: slower = more cinematic morphing (0.018 = ~55 frames to settle fully)
    const lerpK = 1 - Math.pow(0.018, delta)

    for (let i = 0; i < this.count; i++) {
      const p   = this.particles[i]
      const tgt = fn(i, this.count, elapsed)

      // Gentle oscillation layered on top of formation target
      const osc = Math.sin(elapsed * 0.35 + p.phase) * 0.08

      // Smoothly interpolate toward formation target (base gravity)
      p.x += (tgt.x + osc - p.x) * lerpK * p.speed
      p.y += (tgt.y + osc * 0.5 + Math.sin(elapsed * 0.2 + p.phase * 0.7) * 0.06 - p.y) * lerpK * p.speed
      p.z += (tgt.z + osc - p.z) * lerpK * p.speed

      posArr[i * 3]     = p.x
      posArr[i * 3 + 1] = p.y
      posArr[i * 3 + 2] = p.z
    }

    this.geo.attributes.position.needsUpdate = true
  }

  dispose() {
    this.geo.dispose()
    this.mat.dispose()
    this.scene.remove(this.points)
  }
}
