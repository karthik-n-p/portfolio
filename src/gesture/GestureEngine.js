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
  fist:  '✊ Fist — Converge',
  open:  '🖐 Open — Scatter',
  point: '☝ Point — Focus',
  peace: '✌ Peace — Next',
  three: '🤟 Three — Home',
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

  if (count <= 0) return 'fist'
  if (count >= 5) return 'open'
  if (count === 1 && flags[1]) return 'point'  // only index raised
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
  const faceLandmarkerRef = useRef(null)
  const cameraRef = useRef(null)
  const [gestureLabel, setGestureLabel] = useState('idle')
  const [handVisible, setHandVisible] = useState(false)
  const [headVisible, setHeadVisible] = useState(false)
  const [faceError, setFaceError] = useState(null)

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
            const dir = gesture === 'peace' ? 'next' : 'home'
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
    } else if (gesture === 'fist') {
      holdGestureRef.current = null
      clearTimeout(holdTimerRef.current)
      onGestureRef.current('fist')
      setGestureLabel(GESTURE_LABELS.fist)
    } else if (gesture === 'open') {
      holdGestureRef.current = null
      clearTimeout(holdTimerRef.current)
      onGestureRef.current('open')
      setGestureLabel(GESTURE_LABELS.open)
    } else if (gesture === 'point') {
      holdGestureRef.current = null
      clearTimeout(holdTimerRef.current)
      onGestureRef.current('normal')
      setGestureLabel(GESTURE_LABELS.point)
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
      faceLandmarkerRef.current?.close?.()
      cameraRef.current?.stop?.()
      handsRef.current = null
      faceLandmarkerRef.current = null
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
        const { Hands, HAND_CONNECTIONS } = await import('@mediapipe/hands')
        const { Camera } = await import('@mediapipe/camera_utils')

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
          const { FilesetResolver, FaceLandmarker } = await import('@mediapipe/tasks-vision')
          const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm"
          )
          faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
              delegate: "GPU"
            },
            runningMode: "VIDEO",
            numFaces: 1
          })
        } catch(e) { 
          console.warn("FaceLandmarker init failed:", e)
          setFaceError(String(e.message || e))
        }

        const video = videoRef.current
        if (!video || !active) return

        const cam = new Camera(video, {
          onFrame: async () => {
            if (handsRef.current && active) {
              await handsRef.current.send({ image: video })
            }
            if (faceLandmarkerRef.current && active) {
              const faceResults = faceLandmarkerRef.current.detectForVideo(video, performance.now())
              if (faceResults.faceLandmarks && faceResults.faceLandmarks.length > 0) {
                // Nose tip is index 1
                const nose = faceResults.faceLandmarks[0][1]
                const headPos = {
                  x: -(nose.x * 2 - 1),
                  y: -(nose.y * 2 - 1)
                }
                setHeadVisible(true)
                onHeadPositionRef.current?.(headPos)
              } else {
                setHeadVisible(false)
                onHeadPositionRef.current?.(null)
              }
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
      faceLandmarkerRef.current?.close?.()
      handsRef.current = null
      faceLandmarkerRef.current = null
      cameraRef.current = null
    }
  }, [enabled])

  return { videoRef, canvasRef, gestureLabel, handVisible, headVisible, faceError }
}

export { GESTURE_LABELS }
