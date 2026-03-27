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
    const isMobileInit = W < 768
    const camera = new THREE.PerspectiveCamera(isMobileInit ? 75 : 55, W / H, 0.1, 100)
    camera.position.set(0, 0, isMobileInit ? 14 : 8)

    // --- Scene ---
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(threeColors.background, 0.025)

    // Clean lighting: 1 directional + 1 ambient
    const ambient = new THREE.AmbientLight(0x2A2A35, 0.8)
    scene.add(ambient)

    const directional = new THREE.DirectionalLight(0xEDEDED, 0.3)
    directional.position.set(3, 5, 4)
    scene.add(directional)

    // --- Systems ---
    const dataFlow = new DataFlowField(scene)
    const grid = new NetworkGrid(scene)

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
      const elapsed = clock.getElapsedTime()

      // Sync state from parent via refs
      const currentGesture = stateRef.current.gestureState || 'normal'
      const currentHandPos = stateRef.current.handPosition || null
      const currentActive  = stateRef.current.activeNode || null

      dataFlow.setGestureState(currentGesture)
      dataFlow.setHandPosition(currentHandPos)
      dataFlow.setActiveSection(currentActive)
      dataFlow.update(delta)

      grid.setGestureState(currentGesture)
      grid.setHandPosition(currentHandPos)
      grid.setActiveSection(currentActive)
      grid.update(delta, elapsed)

      // Smooth 3D scene horizontal shift:
      // When a panel is open (active), we slide the camera LEFT (-3.5)
      // which visually pushes the 3D data formations to the RIGHT side of the screen,
      // perfectly balancing the left-aligned UI panel.
      const isMobile = window.innerWidth < 768
      const targetFocusX = currentActive && !isMobile ? -3.5 : 0

      // Let the camera drift gently around the target focus point
      const t = elapsed
      const camDriftX = Math.sin(t * 0.05) * 0.3
      const camDriftY = Math.cos(t * 0.07) * 0.15
      
      // Lerp camera position
      camera.position.x += ((targetFocusX + camDriftX) - camera.position.x) * delta * 5
      camera.position.y += (camDriftY - camera.position.y) * delta * 5
      
      // Keep camera pointed at the shifting center
      camera.lookAt(camera.position.x - camDriftX, 0, 0)

      renderer.render(scene, camera)
    }
    animate()

    // Store cleanup
    stateRef.current._cleanup = () => {
      cancelAnimationFrame(animId)
      resizeObs.disconnect()
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
