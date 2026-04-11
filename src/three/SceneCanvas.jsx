import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { DataFlowField } from './DataFlowField.js'
import { NetworkGrid } from './NetworkGrid.js'
import { threeColors, threeSectionColors, SECTIONS } from '../design-tokens.js'

/**
 * SceneCanvas — Three.js renderer
 * Manages camera, renderer, DataFlowField, NetworkGrid.
 * Camera alternates left/right per section for the "zigzag" scroll layout.
 * Receives activeSection key, sectionIndex, gesture state, audio data.
 */
export default function SceneCanvas({ gestureState, activeSection, sectionIndex, handPosition, headPosition, audioData }) {
  const mountRef = useRef(null)
  const stateRef = useRef({})

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W = mount.clientWidth
    const H = mount.clientHeight

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // --- Camera ---
    const aspect = W / H
    const isMobileInit = W < 768
    const camera = new THREE.PerspectiveCamera(isMobileInit ? Math.max(75, 90 - aspect * 20) : 55, aspect, 0.1, 100)
    camera.position.set(0, 0, isMobileInit ? Math.max(14, 18 - aspect * 6) : 8)

    // --- Scene ---
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(threeColors.background, 0.02)

    // Premium lighting
    const ambient = new THREE.AmbientLight(0x16161E, 1.5)
    scene.add(ambient)

    const directional = new THREE.DirectionalLight(0xffffff, 0.4)
    directional.position.set(3, 5, 4)
    scene.add(directional)

    // Dynamic accent point light — changes color per section
    const accentLight = new THREE.PointLight(threeColors.accent, 2, 20)
    accentLight.position.set(-5, 0, 5)
    scene.add(accentLight)

    // Secondary glow light for rim effect
    const rimLight = new THREE.PointLight(0x0055FF, 1, 15)
    rimLight.position.set(5, 2, 3)
    scene.add(rimLight)

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

    // --- Click interaction ---
    const onCanvasClick = (e) => {
      const isMobileClick = window.innerWidth < 768
      if (!isMobileClick && e.target !== renderer.domElement && e.target !== mount) return
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

      const currentGesture = stateRef.current.gestureState || 'normal'
      const currentHandPos = stateRef.current.handPosition || null
      const currentHeadPos = stateRef.current.headPosition || null
      const currentActive  = stateRef.current.activeSection || 'hero'
      const currentIndex   = stateRef.current.sectionIndex || 0
      const currentAudio   = stateRef.current.audioData || { bass: 0, mid: 0, treble: 0, overall: 0 }

      // Transition detection
      if (currentActive !== stateRef.current._prevActive) {
        stateRef.current._prevActive = currentActive
        stateRef.current._transitionPhase = 1.0
      }
      if (stateRef.current._transitionPhase > 0) {
        stateRef.current._transitionPhase = Math.max(0, stateRef.current._transitionPhase - delta * 1.5)
      }
      const transition = stateRef.current._transitionPhase || 0

      dataFlow.setGestureState(currentGesture)
      dataFlow.setHandPosition(currentHandPos)
      dataFlow.setActiveSection(currentActive)
      dataFlow.setAudioData(currentAudio)
      dataFlow.update(delta)

      grid.setGestureState(currentGesture)
      grid.setHandPosition(currentHandPos)
      grid.setActiveSection(currentActive)
      grid.setAudioData(currentAudio)
      grid.update(delta, elapsed)

      const W = window.innerWidth
      const isMobileNow = W < 768

      // ─── ALTERNATING LEFT/RIGHT CAMERA POSITION ───
      // Hero: centered. Odd sections: 3D shifts right. Even sections: 3D shifts left.
      const isHero = currentIndex === 0
      let targetFocusX, targetFocusY

      if (isHero) {
        targetFocusX = 0
        targetFocusY = 0
      } else if (isMobileNow) {
        // Mobile: 3D model beautifully centered inside its dedicated top 45vh frame
        targetFocusX = 0
        targetFocusY = 0
      } else {
        // Desktop: alternate 3D position left ↔ right
        // Odd index: content LEFT, 3D RIGHT → camera shifts LEFT
        // Even index: content RIGHT, 3D LEFT → camera shifts RIGHT
        const isOddSection = currentIndex % 2 === 1
        targetFocusX = isOddSection ? -3.0 : 3.0
        targetFocusY = 0
      }

      const t = elapsed
      const camDriftX = Math.sin(t * 0.05) * 0.2
      const camDriftY = Math.cos(t * 0.07) * 0.1

      // Holographic head parallax
      let headParallaxX = 0, headParallaxY = 0
      if (currentHeadPos) {
        const scalarX = isMobileNow ? -3.5 : -6.0
        const scalarY = isMobileNow ? 3.5 : 6.0
        headParallaxX = currentHeadPos.x * scalarX
        headParallaxY = currentHeadPos.y * scalarY
      }

      const finalTargetX = targetFocusX + camDriftX + headParallaxX
      const finalTargetY = targetFocusY + camDriftY + headParallaxY

      camera.position.x += (finalTargetX - camera.position.x) * delta * 4
      camera.position.y += (finalTargetY - camera.position.y) * delta * 4

      // Volumetric pivot from head tracking
      let targetRotY = 0, targetRotX = 0
      if (currentHeadPos) {
        targetRotY = currentHeadPos.x * (isMobileNow ? 0.3 : 0.15)
        targetRotX = currentHeadPos.y * (isMobileNow ? -0.2 : -0.1)
      }
      scene.rotation.y += (targetRotY - scene.rotation.y) * delta * 5
      scene.rotation.x += (targetRotX - scene.rotation.x) * delta * 5

      camera.lookAt(targetFocusX - camDriftX, targetFocusY - camDriftY, 0)

      // ─── UPDATE DYNAMIC LIGHTS PER SECTION ───
      const sectionPalette = threeSectionColors[currentActive] || threeSectionColors.hero
      const targetAccentColor = new THREE.Color(sectionPalette.primary)
      const targetRimColor = new THREE.Color(sectionPalette.secondary)

      accentLight.color.lerp(targetAccentColor, delta * 3)
      rimLight.color.lerp(targetRimColor, delta * 3)

      // Move accent light to opposite side of content
      const lightSide = isHero ? -5 : (currentIndex % 2 === 1 ? 3 : -7)
      accentLight.position.x += (lightSide - accentLight.position.x) * delta * 3
      rimLight.position.x += (-lightSide * 0.5 - rimLight.position.x) * delta * 3

      // Smooth FOV interpolation, eliminating dramatic jumps and buggy rotateZ accumulation
      const targetFov = isMobileNow ? Math.max(75, 90 - (W / window.innerHeight) * 20) : 55
      camera.fov += (targetFov - camera.fov) * delta * 4
      camera.updateProjectionMatrix()

      renderer.render(scene, camera)
    }
    animate()

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

  // Sync external state without re-mounting
  useEffect(() => { stateRef.current.gestureState = gestureState }, [gestureState])
  useEffect(() => { stateRef.current.activeSection = activeSection }, [activeSection])
  useEffect(() => { stateRef.current.sectionIndex = sectionIndex }, [sectionIndex])
  useEffect(() => { stateRef.current.handPosition = handPosition }, [handPosition])
  useEffect(() => { stateRef.current.headPosition = headPosition }, [headPosition])
  useEffect(() => { stateRef.current.audioData = audioData }, [audioData])

  return (
    <div
      ref={mountRef}
      className={`scene-canvas-container ${sectionIndex === 0 ? 'is-hero' : ''}`}
      style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
    />
  )
}
