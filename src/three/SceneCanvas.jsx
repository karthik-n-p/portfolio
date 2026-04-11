import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { DataFlowField } from './DataFlowField.js'
import { NetworkGrid } from './NetworkGrid.js'
import { threeColors } from '../design-tokens.js'

/**
 * SceneCanvas — 3D particle system
 * 
 * Renders inside whatever container it's placed in (fills 100% of parent).
 * Uses ResizeObserver to adapt to container resize.
 */
export default function SceneCanvas({
  gestureState,
  activeSection,
  sectionIndex,
  handPosition,
  headPosition,
  isMobile,
}) {
  const containerRef = useRef()
  const stateRef = useRef({ gestureState, activeSection, handPosition, headPosition, isMobile })

  useEffect(() => {
    stateRef.current = { gestureState, activeSection, handPosition, headPosition, isMobile }
  }, [gestureState, activeSection, handPosition, headPosition, isMobile])

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5))
    container.appendChild(renderer.domElement)

    // Measure container
    const W = container.clientWidth || window.innerWidth
    const H = container.clientHeight || window.innerHeight

    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 200)
    camera.position.set(0, 2, 20)
    camera.lookAt(0, 0, 0)

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(threeColors.background, 30, 120)

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.9))

    const dir = new THREE.DirectionalLight(0xE0EAF0, 0.7)
    dir.position.set(8, 12, 10)
    scene.add(dir)

    const fill = new THREE.PointLight(0x9BA8AB, 3.0, 40)
    fill.position.set(-6, 2, 10)
    scene.add(fill)

    const rim = new THREE.PointLight(0x4A5C6A, 1.8, 35)
    rim.position.set(6, -3, -5)
    scene.add(rim)

    // Systems
    const dataFlow = new DataFlowField(scene)
    const grid = new NetworkGrid(scene)
    const clock = new THREE.Clock()

    let camX = 0, headPX = 0, headPY = 0

    // ── Resize handler ───────────────────────────────────
    const onResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      if (w === 0 || h === 0) return
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)
    const ro = new ResizeObserver(onResize)
    ro.observe(container)
    onResize()

    // ── Animation loop ───────────────────────────────────
    let frameId
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const delta = Math.min(clock.getDelta(), 0.05)
      const elapsed = clock.getElapsedTime()
      const s = stateRef.current

      dataFlow.setActiveSection(s.activeSection)
      dataFlow.setGestureState(s.gestureState)
      grid.setGestureState(s.gestureState)
      grid.setActiveSection(s.activeSection)

      if (s.handPosition) {
        dataFlow.setHandPosition(s.handPosition)
        grid.setHandPosition(s.handPosition)
      } else {
        dataFlow.setHandPosition(null)
        grid.setHandPosition(null)
      }

      dataFlow.update(delta, elapsed)
      grid.update(delta, elapsed)

      // Camera drift
      if (s.headPosition) {
        headPX += (s.headPosition.x * 1.5 - headPX) * delta * 2
        headPY += (s.headPosition.y * 1.0 - headPY) * delta * 2
      } else {
        headPX *= (1 - delta * 2)
        headPY *= (1 - delta * 2)
      }

      const breathX = Math.sin(elapsed * 0.15) * 0.2
      const breathY = Math.cos(elapsed * 0.11) * 0.12

      camX += (headPX + breathX - camX) * delta * 1.5
      camera.position.x = camX
      camera.position.y = 2 + headPY + breathY
      camera.lookAt(camX * 0.1, 0, 0)

      fill.color.setHSL((elapsed * 0.02) % 1, 0.15, 0.65)

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', onResize)
      ro.disconnect()
      dataFlow.dispose()
      grid.dispose()
      renderer.dispose()
      if (container) container.innerHTML = ''
    }
  }, []) // eslint-disable-line

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    />
  )
}
