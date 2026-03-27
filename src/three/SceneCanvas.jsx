import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { DataFlowField } from './DataFlowField.js'
import { NetworkGrid } from './NetworkGrid.js'
import { threeColors } from '../design-tokens.js'

/**
 * SceneCanvas — Three.js renderer
 * Manages camera, renderer, DataFlowField, NetworkGrid.
 * No raycasting/click — navigation is UI-only.
 */
export default function SceneCanvas({ gestureState, activeNode, handPosition }) {
  const mountRef = useRef(null)
  const stateRef = useRef({})

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W = mount.clientWidth
    const H = mount.clientHeight

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.setClearColor(threeColors.background, 1)
    mount.appendChild(renderer.domElement)

    // --- Camera ---
    const aspect = W / H
    const isMobileInit = W < 768
    const camera = new THREE.PerspectiveCamera(isMobileInit ? Math.max(75, 90 - aspect * 20) : 55, aspect, 0.1, 100)
    camera.position.set(0, 0, isMobileInit ? Math.max(14, 18 - aspect * 6) : 8)

    // --- Scene ---
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(threeColors.background, 0.025)

    // Premium lighting for physical materials
    const ambient = new THREE.AmbientLight(0x1A1A22, 1.5)
    scene.add(ambient)

    const directional = new THREE.DirectionalLight(0xffffff, 0.5)
    directional.position.set(3, 5, 4)
    scene.add(directional)

    const pointCyan = new THREE.PointLight(threeColors.accent, 2, 20)
    pointCyan.position.set(-5, 0, 5)
    scene.add(pointCyan)

    const pointPurple = new THREE.PointLight(threeColors.violet, 2, 20)
    pointPurple.position.set(5, 5, 5)
    scene.add(pointPurple)

    // --- Systems ---
    const dataFlow = new DataFlowField(scene)
    const grid = new NetworkGrid(scene)

    // --- Resize handler ---
    const onResize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      const currentAspect = w / h
      const isMobile = w < 768
      camera.aspect = currentAspect
      camera.fov = isMobile ? Math.max(75, 90 - currentAspect * 20) : 55
      camera.position.z = isMobile ? Math.max(14, 18 - currentAspect * 6) : 8
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    const resizeObs = new ResizeObserver(onResize)
    resizeObs.observe(mount)

    // --- Clock ---
    const clock = new THREE.Clock()

    // --- Interaction ---
    const mouseParams = { x: 0, y: 0 }
    const onMouseMove = (e) => {
      mouseParams.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseParams.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMouseMove)

    // --- Animate ---
    let animId
    const animate = () => {
      animId = requestAnimationFrame(animate)
      const delta = Math.min(clock.getDelta(), 0.05)
      const elapsed = clock.getElapsedTime()

      // Sync state from parent via refs
      const currentGesture = stateRef.current.gestureState || 'normal'
      const currentHandPos = stateRef.current.handPosition || null
      const currentActive  = stateRef.current.activeNode || null

      dataFlow.setGestureState(currentGesture)
      dataFlow.setHandPosition(currentHandPos)
      dataFlow.setActiveSection(currentActive)
      if (dataFlow.setMousePosition) dataFlow.setMousePosition(mouseParams)
      dataFlow.update(delta)

      grid.setGestureState(currentGesture)
      grid.setHandPosition(currentHandPos)
      grid.setActiveSection(currentActive)
      grid.update(delta, elapsed)

      // Smooth 3D scene shift:
      // Desktop: panel is on left, shift camera LEFT -> object to RIGHT
      // Mobile: panel is on bottom, shift camera DOWN -> object to TOP
      const isMobileNow = window.innerWidth < 768
      const targetFocusX = currentActive && !isMobileNow ? -4.0 : 0
      const targetFocusY = currentActive && isMobileNow ? -8.5 : 0

      // Let the camera drift gently around the target focus point
      const t = elapsed
      const camDriftX = Math.sin(t * 0.05) * 0.3
      const camDriftY = Math.cos(t * 0.07) * 0.15
      
      // Lerp camera position
      camera.position.x += ((targetFocusX + camDriftX) - camera.position.x) * delta * 5
      camera.position.y += ((targetFocusY + camDriftY) - camera.position.y) * delta * 5
      
      // Keep camera pointed at the shifting center (with drift)
      camera.lookAt(camera.position.x - camDriftX, camera.position.y - camDriftY, 0)

      renderer.render(scene, camera)
    }
    animate()

    // Store cleanup
    stateRef.current._cleanup = () => {
      cancelAnimationFrame(animId)
      resizeObs.disconnect()
      window.removeEventListener('mousemove', onMouseMove)
      dataFlow.dispose()
      grid.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement)
      }
    }

    return () => stateRef.current._cleanup?.()
  }, [])

  // Sync external state to scene without re-mounting
  useEffect(() => { stateRef.current.gestureState = gestureState }, [gestureState])
  useEffect(() => { stateRef.current.activeNode = activeNode }, [activeNode])
  useEffect(() => { stateRef.current.handPosition = handPosition }, [handPosition])

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
    />
  )
}
