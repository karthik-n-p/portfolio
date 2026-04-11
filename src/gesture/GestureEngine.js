import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * GestureEngine — MediaPipe Hands integration
 *
 * Finger-count gesture mapping (stable, no velocity-based swipe):
 *   0 fingers (fist)   → converge particles toward hand
 *   5 fingers (open)   → scatter particles from hand
 *   1 finger  (point)  → gentle focus/follow mode
 *   2 fingers (peace)  → navigate to next section (held 0.4s)
 *   3 fingers          → return to home (held 0.4s)
 *
 * Hand position always tracked for particle influence.
 */

const GESTURE_LABELS = {
  peace: '✌ Peace — Next',
  three: '🤟 Three — Prev',
  idle:  '...',
}

function countRaisedFingers(landmarks) {
  const wrist = landmarks[0]
  const mcpList = [landmarks[5], landmarks[9], landmarks[13], landmarks[17]]

  // palmSize = avg distance from wrist to knuckles
  let palmSize = 0
  for (const mcp of mcpList) {
    palmSize += Math.hypot(mcp.x - wrist.x, mcp.y - wrist.y)
  }
  palmSize /= 4

  const tips = [
    { tip: landmarks[4],  idx: 4 },  // thumb
    { tip: landmarks[8],  idx: 8 },  // index
    { tip: landmarks[12], idx: 12 }, // middle
    { tip: landmarks[16], idx: 16 }, // ring
    { tip: landmarks[20], idx: 20 }, // pinky
  ]

  let raised = 0
  const raisedFlags = []
  for (const { tip, idx } of tips) {
    const distToWrist = Math.hypot(tip.x - wrist.x, tip.y - wrist.y)
    const isRaised = distToWrist > palmSize * 1.25
    raisedFlags.push(isRaised)
    if (isRaised) raised++
  }

  return { count: raised, flags: raisedFlags }
}

function classifyGesture(landmarks) {
  const { count, flags } = countRaisedFingers(landmarks)
  // flags: [thumb, index, middle, ring, pinky]

  if (count === 2 && flags[1] && flags[2]) return 'peace'  // index + middle
  if (count === 3 && flags[1] && flags[2] && flags[3]) return 'three'  // index + middle + ring

  return 'idle'
}

function getPalmCenter(landmarks) {
  const indices = [0, 5, 9, 13, 17]
  let cx = 0, cy = 0
  for (const idx of indices) {
    cx += landmarks[idx].x
    cy += landmarks[idx].y
  }
  cx /= indices.length
  cy /= indices.length
  return { x: -(cx * 2 - 1), y: -(cy * 2 - 1) }
}

export function useGestureEngine({ enabled, onGesture, onNavigate, onHandPosition, onHeadPosition }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const handsRef = useRef(null)
  const faceMeshRef = useRef(null)
  const cameraRef = useRef(null)
  const [gestureLabel, setGestureLabel] = useState('idle')
  const [handVisible, setHandVisible] = useState(false)
  const [headVisible, setHeadVisible] = useState(false)
  const [faceError, setFaceError] = useState(null)
  const [handError, setHandError] = useState(null)
  const [lightError, setLightError] = useState(null)
  const lumaCanvasRef = useRef(null)

  // Hold detection for peace/three
  const holdGestureRef = useRef(null)
  const holdTimerRef = useRef(null)
  const navigateCooldown = useRef(false)

  // Stable refs for callbacks
  const onGestureRef = useRef(onGesture)
  const onNavigateRef = useRef(onNavigate)
  const onHandPositionRef = useRef(onHandPosition)
  const onHeadPositionRef = useRef(onHeadPosition)
  useEffect(() => { onGestureRef.current = onGesture }, [onGesture])
  useEffect(() => { onNavigateRef.current = onNavigate }, [onNavigate])
  useEffect(() => { onHandPositionRef.current = onHandPosition }, [onHandPosition])
  useEffect(() => { onHeadPositionRef.current = onHeadPosition }, [onHeadPosition])

  const handleResults = useCallback((results) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      setHandVisible(false)
      onGestureRef.current('normal')
      onHandPositionRef.current?.(null)
      setGestureLabel('idle')
      // Clear any hold
      holdGestureRef.current = null
      clearTimeout(holdTimerRef.current)
      return
    }

    if (results.multiHandLandmarks.length > 1) {
      setHandError('MULTIPLE HANDS DETECTED: INTERFERENCE')
    } else {
      setHandError(null)
    }

    setHandVisible(true)
    const landmarks = results.multiHandLandmarks[0]

    // Track hand position
    const palmPos = getPalmCenter(landmarks)
    onHandPositionRef.current?.(palmPos)

    // Draw dots at joints only (no skeleton lines)
    const wristNode = landmarks[0]
    let pSize = 0
    ;[landmarks[5], landmarks[9], landmarks[13], landmarks[17]].forEach(mcp => {
      pSize += Math.hypot(mcp.x - wristNode.x, mcp.y - wristNode.y)
    })
    pSize /= 4

    // Draw joint dots
    ctx.fillStyle = 'rgba(99, 102, 241, 0.4)'
    landmarks.forEach((lm, idx) => {
      if (![4, 8, 12, 16, 20].includes(idx)) {
        ctx.beginPath()
        ctx.arc(lm.x * canvas.width, lm.y * canvas.height, 2, 0, Math.PI * 2)
        ctx.fill()
      }
    })

    // Fingertips with color coding
    ;[4, 8, 12, 16, 20].forEach(tipIdx => {
      const tip = landmarks[tipIdx]
      const dist = Math.hypot(tip.x - wristNode.x, tip.y - wristNode.y)
      const isRaised = dist > pSize * 1.25
      ctx.fillStyle = isRaised ? '#34D399' : '#FB7185'
      ctx.beginPath()
      ctx.arc(tip.x * canvas.width, tip.y * canvas.height, 3.5, 0, Math.PI * 2)
      ctx.fill()
    })

    // Classify gesture
    const gesture = classifyGesture(landmarks)

    // Handle navigation gestures with hold confirmation
    if ((gesture === 'peace' || gesture === 'three') && !navigateCooldown.current) {
      if (holdGestureRef.current !== gesture) {
        holdGestureRef.current = gesture
        clearTimeout(holdTimerRef.current)
        holdTimerRef.current = setTimeout(() => {
          if (holdGestureRef.current === gesture) {
            const dir = gesture === 'peace' ? 'next' : 'prev'
            onNavigateRef.current?.(dir)
            navigateCooldown.current = true
            setTimeout(() => { navigateCooldown.current = false }, 1000)
          }
          holdGestureRef.current = null
        }, 400)
      }
      // While holding, still send normal gesture state
      onGestureRef.current('normal')
      setGestureLabel(GESTURE_LABELS[gesture])
    } else {
      holdGestureRef.current = null
      clearTimeout(holdTimerRef.current)
      onGestureRef.current('normal')
      setGestureLabel(GESTURE_LABELS.idle)
    }
  }, [])

  useEffect(() => {
    if (!enabled) {
      handsRef.current?.close?.()
      faceMeshRef.current?.close?.()
      cameraRef.current?.stop?.()
      handsRef.current = null
      faceMeshRef.current = null
      cameraRef.current = null
      onGestureRef.current('normal')
      onHandPositionRef.current?.(null)
      onHeadPositionRef.current?.(null)
      holdGestureRef.current = null
      clearTimeout(holdTimerRef.current)
      return
    }

    let active = true

    async function initMediaPipe() {
      try {
        const mpHands = await import('@mediapipe/hands')
        const Hands = mpHands.Hands || mpHands.default?.Hands || window.Hands
        const HAND_CONNECTIONS = mpHands.HAND_CONNECTIONS || mpHands.default?.HAND_CONNECTIONS || window.HAND_CONNECTIONS

        const mpCam = await import('@mediapipe/camera_utils')
        const Camera = mpCam.Camera || mpCam.default?.Camera || window.Camera

        window.HAND_CONNECTIONS = HAND_CONNECTIONS

        const hands = new Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        })
        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 0,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.5,
        })
        hands.onResults(handleResults)
        handsRef.current = hands

        try {
          const mpFace = await import('@mediapipe/face_mesh')
          const FaceMesh = mpFace.FaceMesh || mpFace.default?.FaceMesh || window.FaceMesh
          const faceMesh = new FaceMesh({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
          })
          faceMesh.setOptions({
            maxNumFaces: 2,
            refineLandmarks: false,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
          })
          faceMesh.onResults((results) => {
             if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
                if (results.multiFaceLandmarks.length > 1) {
                   setFaceError("MULTIPLE FACES DETECTED")
                   setHeadVisible(false)
                   onHeadPositionRef.current?.(null)
                } else {
                   setFaceError(null)
                   setHeadVisible(true)
                   const nose = results.multiFaceLandmarks[0][1]
                   onHeadPositionRef.current?.({ x: -(nose.x * 2 - 1), y: -(nose.y * 2 - 1) })
                }
             } else {
               setHeadVisible(false)
               onHeadPositionRef.current?.(null)
               setFaceError(null)
             }
          })
          faceMeshRef.current = faceMesh
        } catch(e) { 
          console.warn("FaceMesh init failed:", e)
          setFaceError(String(e.message || e))
        }

        const video = videoRef.current
        if (!video || !active) return

        const cam = new Camera(video, {
          onFrame: async () => {
            if (!active) return
            
            if (handsRef.current) await handsRef.current.send({ image: video })
            if (faceMeshRef.current) await faceMeshRef.current.send({ image: video })
            
            // Luma (brightness) check
            if (!lumaCanvasRef.current) {
              lumaCanvasRef.current = document.createElement('canvas')
              lumaCanvasRef.current.width = 16
              lumaCanvasRef.current.height = 12
            }
            const lumaCtx = lumaCanvasRef.current.getContext('2d', { willReadFrequently: true })
            lumaCtx.drawImage(video, 0, 0, 16, 12)
            const data = lumaCtx.getImageData(0,0,16,12).data
            let sum = 0
            for (let i = 0; i < data.length; i += 4) {
              sum += 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2]
            }
            const avg = sum / (16 * 12)
            if (avg < 20) {
              setLightError("LOW LIGHT DETECTED")
            } else {
              setLightError(null)
            }
          },
          width: 320,
          height: 240,
        })
        await cam.start()
        cameraRef.current = cam
      } catch (err) {
        console.warn('MediaPipe not available:', err)
        onGestureRef.current('normal')
      }
    }

    initMediaPipe()

    return () => {
      active = false
      cameraRef.current?.stop?.()
      handsRef.current?.close?.()
      faceMeshRef.current?.close?.()
      handsRef.current = null
      faceMeshRef.current = null
      cameraRef.current = null
    }
  }, [enabled])

  return { videoRef, canvasRef, gestureLabel, handVisible, headVisible, faceError, handError, lightError }
}

export { GESTURE_LABELS }
