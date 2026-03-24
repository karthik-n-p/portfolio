import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { ParticleSystem } from './ParticleSystem.js'
import { MicroParticles } from './MicroParticles.js'
import { SpatialGraph } from './SpatialGraph.js'
import { nodePositions } from '../data/karthik.js'

/**
 * SceneCanvas — Three.js renderer with full scene lifecycle management
 * Handles camera, renderer, particle system, spatial graph, raycasting, and input events.
 */
export default function SceneCanvas({ onNodeSelect, gestureState, activeNode, handPosition }) {
  const mountRef = useRef(null)
  const stateRef = useRef({})

  const handleNodeSelect = useCallback(onNodeSelect, [])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W = mount.clientWidth
    const H = mount.clientHeight

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.setClearColor(0x050a0e, 1)
    mount.appendChild(renderer.domElement)

    // --- Camera ---
    const isMobileInit = W < 768
    const camera = new THREE.PerspectiveCamera(isMobileInit ? 75 : 55, W / H, 0.1, 100)
    camera.position.set(0, 0, isMobileInit ? 14 : 8)

    // --- Scene ---
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x050a0e, 0.04)

    // Ambient light
    const ambient = new THREE.AmbientLight(0x003344, 0.5)
    scene.add(ambient)

    // Subtle point lights at key nodes
    const lights = [
      { pos: nodePositions.hub,      color: 0x00d4ff },
      { pos: nodePositions.pipeline, color: 0x0af5a0 },
      { pos: nodePositions.projects, color: 0x8b5cf6 },
    ]
    lights.forEach(({ pos, color }) => {
      const light = new THREE.PointLight(color, 0.6, 8)
      light.position.set(pos.x, pos.y, pos.z)
      scene.add(light)
    })

    // --- Systems ---
    const microParticles = new MicroParticles(scene)
    const particles = new ParticleSystem(scene)
    const graph = new SpatialGraph(scene)

    // --- Raycaster for node click ---
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()

    // --- Mouse tracking ---
    const onMouseMove = (e) => {
      const rect = mount.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      particles.setMouse(x, y)
      pointer.set(x, y)
    }

    const onTouchMove = (e) => {
      const touch = e.touches[0]
      const rect = mount.getBoundingClientRect()
      const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1
      particles.setMouse(x, y)
      pointer.set(x, y)
    }

    const onClick = (e) => {
      // Raycast to find clicked node
      pointer.set(
        ((e.clientX - mount.getBoundingClientRect().left) / mount.clientWidth) * 2 - 1,
        -(((e.clientY - mount.getBoundingClientRect().top) / mount.clientHeight) * 2 - 1)
      )
      raycaster.setFromCamera(pointer, camera)

      const nodeObjs = graph.getNodesForRaycasting()
      const meshes = nodeObjs.map(n => n.mesh)
      const hits = raycaster.intersectObjects(meshes)

      if (hits.length > 0) {
        const hit = hits[0]
        const nodeEntry = nodeObjs.find(n => n.mesh === hit.object)
        if (nodeEntry) {
          handleNodeSelect(nodeEntry.key)
          // Convert hit point to approx world space ripple
          particles.triggerBurst(hit.point.x, hit.point.y)
          return
        }
      }

      // Click on empty space — ripple at approx world position
      raycaster.setFromCamera(pointer, camera)
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
      const worldPt = new THREE.Vector3()
      raycaster.ray.intersectPlane(plane, worldPt)
      particles.triggerBurst(worldPt.x, worldPt.y)
      particles.addRipple(worldPt.x, worldPt.y)
    }

    mount.addEventListener('mousemove', onMouseMove)
    mount.addEventListener('touchmove', onTouchMove, { passive: true })
    mount.addEventListener('click', onClick)

    // --- Resize handler ---
    const onResize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      const isMobile = w < 768
      
      camera.aspect = w / h
      camera.fov = isMobile ? 75 : 55
      camera.position.z = isMobile ? 14 : 8
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    const resizeObs = new ResizeObserver(onResize)
    resizeObs.observe(mount)

    // --- Clock ---
    const clock = new THREE.Clock()

    // --- Animate ---
    let animId
    const animate = () => {
      animId = requestAnimationFrame(animate)
      const delta = Math.min(clock.getDelta(), 0.05)

      // Update gesture + hand position from parent
      const currentGesture = stateRef.current.gestureState || 'normal'
      const currentHandPos = stateRef.current.handPosition || null
      particles.setGestureState(currentGesture)
      particles.setHandPosition(currentHandPos)
      microParticles.setGestureState(currentGesture)
      microParticles.setHandPosition(currentHandPos)

      graph.setActiveNode(stateRef.current.activeNode || null)

      microParticles.update(delta, clock.getElapsedTime())
      particles.update(delta)
      graph.update()

      // Gentle camera drift
      const t = clock.getElapsedTime()
      camera.position.x = Math.sin(t * 0.05) * 0.3
      camera.position.y = Math.cos(t * 0.07) * 0.15
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }
    animate()

    // Store cleanup refs
    stateRef.current._cleanup = () => {
      cancelAnimationFrame(animId)
      resizeObs.disconnect()
      mount.removeEventListener('mousemove', onMouseMove)
      mount.removeEventListener('touchmove', onTouchMove)
      mount.removeEventListener('click', onClick)
      microParticles.dispose()
      particles.dispose()
      graph.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement)
      }
    }

    return () => stateRef.current._cleanup?.()
  }, [])

  // Sync external state to scene without re-mounting
  useEffect(() => {
    stateRef.current.gestureState = gestureState
  }, [gestureState])

  useEffect(() => {
    stateRef.current.activeNode = activeNode
  }, [activeNode])

  useEffect(() => {
    stateRef.current.handPosition = handPosition
  }, [handPosition])

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
    />
  )
}
