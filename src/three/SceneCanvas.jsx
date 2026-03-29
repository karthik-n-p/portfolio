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
export default function SceneCanvas({ gestureState, activeNode, handPosition, headPosition }) {
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
    const onCanvasClick = (e) => {
      // Only react if clicking directly on the canvas or its mount
      if (e.target !== renderer.domElement && e.target !== mount) return;
      
      const rect = mount.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera)
      
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
      const target = new THREE.Vector3()
      if (raycaster.ray.intersectPlane(plane, target)) {
        dataFlow.triggerPulse(target)
      } else {
        dataFlow.triggerPulse()
      }
    }
    window.addEventListener('click', onCanvasClick)

    const onPointerMove = (e) => {
      const rect = mount.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera)
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
      const target = new THREE.Vector3()
      if (raycaster.ray.intersectPlane(plane, target)) {
        dataFlow.setHoverPosition(target)
      } else {
        dataFlow.setHoverPosition(null)
      }
    }
    window.addEventListener('pointermove', onPointerMove)

    // --- Animate ---
    let animId
    const animate = () => {
      animId = requestAnimationFrame(animate)
      const delta = Math.min(clock.getDelta(), 0.05)
      const elapsed = clock.getElapsedTime()

      // Sync state from parent via refs
      const currentGesture = stateRef.current.gestureState || 'normal'
      const currentHandPos = stateRef.current.handPosition || null
      const currentHeadPos = stateRef.current.headPosition || null
      const currentActive  = stateRef.current.activeNode || null
      
      // Hyperspace transition trigger
      if (currentActive !== stateRef.current._prevActiveNode) {
         stateRef.current._prevActiveNode = currentActive
         stateRef.current._transitionPhase = 1.0
      }
      if (stateRef.current._transitionPhase > 0) {
         stateRef.current._transitionPhase = Math.max(0, stateRef.current._transitionPhase - delta * 1.5)
      }
      const transition = stateRef.current._transitionPhase || 0

      dataFlow.setGestureState(currentGesture)
      dataFlow.setHandPosition(currentHandPos)
      dataFlow.setActiveSection(currentActive)
      dataFlow.update(delta)

      grid.setGestureState(currentGesture)
      grid.setHandPosition(currentHandPos)
      grid.setActiveSection(currentActive)
      grid.update(delta, elapsed)

      // Smooth 3D scene shift:
      const W = window.innerWidth
      const isMobileNow = W < 768
      
      // Shift camera so 3D forms are visible alongside UI panels
      // If mobile, panel is usually at bottom, so push camera down (scene moves up)
      // If desktop, panel is usually centered or wide, let's push camera left (scene moves right)
      const targetFocusX = currentActive ? (isMobileNow ? 0 : -4.5) : 0
      const targetFocusY = currentActive ? (isMobileNow ? -5.5 : 0) : 0

      // Let the camera drift gently around the target focus point
      const t = elapsed
      const camDriftX = Math.sin(t * 0.05) * 0.3
      const camDriftY = Math.cos(t * 0.07) * 0.15
      
      // Holographic parallax effect based on head position
      let headParallaxX = 0
      let headParallaxY = 0
      if (currentHeadPos) {
        // True "Looking Glass" effect: 
        // X must be inverted since webcam space nose.x=0 (left) translates to positive. We want camera to move left (negative X).
        const scalarX = isMobileNow ? -3.5 : -8.0
        // Y is kept positive because top of webcam (y=0) becomes positive, which moves camera UP (+Y).
        const scalarY = isMobileNow ? 3.5 : 8.0
        
        headParallaxX = currentHeadPos.x * scalarX
        headParallaxY = currentHeadPos.y * scalarY
      }

      const finalTargetX = targetFocusX + camDriftX + headParallaxX
      const finalTargetY = targetFocusY + camDriftY + headParallaxY
      
      // Lerp camera physical position
      camera.position.x += (finalTargetX - camera.position.x) * delta * 5
      camera.position.y += (finalTargetY - camera.position.y) * delta * 5
      
      // Volumetric pivot: physically rotate the whole structure gently to reveal lateral sides on mobile/desktop
      let targetRotY = 0
      let targetRotX = 0
      if (currentHeadPos) {
         // positive X head -> look left side -> pivot Y negatively to expose side
         targetRotY = currentHeadPos.x * (isMobileNow ? 0.35 : 0.2)
         // positive Y head -> look top side -> pivot X down to expose top
         targetRotX = currentHeadPos.y * (isMobileNow ? -0.25 : -0.15)
      }
      scene.rotation.y += (targetRotY - scene.rotation.y) * delta * 5
      scene.rotation.x += (targetRotX - scene.rotation.x) * delta * 5

      // Strictly look at the original content focus core so camera pivots correctly, generating massive 3D depth
      camera.lookAt(targetFocusX - camDriftX, targetFocusY - camDriftY, 0)
      
      // Cinematic Camera Choreography: apply FOV and Dutch Angle Z-roll during UI hyperjumps
      if (transition > 0) {
        const currentAspect = W / window.innerHeight
        const baseFov = isMobileNow ? Math.max(75, 90 - currentAspect * 20) : 55
        const jumpCurve = Math.sin(transition * Math.PI) // 0 -> 1 -> 0 parabolic arc
        
        camera.fov = baseFov + jumpCurve * 45 // extreme FOV pullback
        camera.updateProjectionMatrix()
        
        // Add dynamic roll (Dutch angle) relative to the lookAt orientation
        camera.rotateZ(jumpCurve * 0.15)
      } else {
        const currentAspect = W / window.innerHeight
        camera.fov = isMobileNow ? Math.max(75, 90 - currentAspect * 20) : 55
        camera.updateProjectionMatrix()
      }

      renderer.render(scene, camera)
    }
    animate()

    // Store cleanup
    stateRef.current._cleanup = () => {
      window.removeEventListener('click', onCanvasClick)
      window.removeEventListener('pointermove', onPointerMove)
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
  useEffect(() => { stateRef.current.headPosition = headPosition }, [headPosition])

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
    />
  )
}
