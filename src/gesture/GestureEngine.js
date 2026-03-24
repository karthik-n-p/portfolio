import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * GestureEngine — MediaPipe Hands integration
 * Detects: Closed Fist, Open Palm
 * Tracks: Hand position (palm center)
 * Particles follow the hand and respond to fist/open gestures.
 *
 * Gestures:
 *   fist   → particles converge toward hand position
 *   open   → particles spread from hand position
 *   move   → particles follow hand position
 */

const GESTURE_LABELS = {
  fist:   '✊ Fist — Converge',
  open:   '🖐 Open — Expand',
  idle:   '...',
}

function classifyHand(landmarks) {
  const wrist = landmarks[0]
  const mcpList = [landmarks[5], landmarks[9], landmarks[13], landmarks[17]]
  
  // palmSize = avg distance from wrist to knuckles
  let palmSize = 0
  for (const mcp of mcpList) {
    palmSize += Math.hypot(mcp.x - wrist.x, mcp.y - wrist.y)
  }
  palmSize /= 4

  // Check how many fingers are "closed"
  const tips = [landmarks[8], landmarks[12], landmarks[16], landmarks[20]]
  let closedCount = 0
  tips.forEach(tip => {
    const distToWrist = Math.hypot(tip.x - wrist.x, tip.y - wrist.y)
    if (distToWrist < palmSize * 1.2) {
      closedCount++
    }
  })

  if (closedCount >= 3) return 'fist'
  if (closedCount <= 1) return 'open'
  
  return 'idle'
}

// Compute palm center from landmarks (average of wrist + MCP joints)
function getPalmCenter(landmarks) {
  const indices = [0, 5, 9, 13, 17] // wrist + 4 MCP knuckles
  let cx = 0, cy = 0
  for (const idx of indices) {
    cx += landmarks[idx].x
    cy += landmarks[idx].y
  }
  cx /= indices.length
  cy /= indices.length
  // Convert from [0,1] range to normalized device coords [-1,1]
  // MediaPipe x is mirrored, so we flip it
  return { x: -(cx * 2 - 1), y: -(cy * 2 - 1) }
}

export function useGestureEngine({ enabled, onGesture, onNavigate, onHandPosition }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const handsRef = useRef(null)
  const cameraRef = useRef(null)
  const [gestureLabel, setGestureLabel] = useState('idle')
  const [handVisible, setHandVisible] = useState(false)

  // Tracking for swipe velocity
  const prevPosRef = useRef(null)
  const lastTimeRef = useRef(0)
  const navigateCooldown = useRef(false)

  // Stable refs for callbacks
  const onGestureRef = useRef(onGesture)
  const onNavigateRef = useRef(onNavigate)
  const onHandPositionRef = useRef(onHandPosition)
  useEffect(() => { onGestureRef.current = onGesture }, [onGesture])
  useEffect(() => { onNavigateRef.current = onNavigate }, [onNavigate])
  useEffect(() => { onHandPositionRef.current = onHandPosition }, [onHandPosition])

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
      return
    }

    setHandVisible(true)
    const landmarks = results.multiHandLandmarks[0]

    // --- Track hand position and velocity for swipe ---
    const palmPos = getPalmCenter(landmarks)
    onHandPositionRef.current?.(palmPos)

    const now = performance.now()
    if (prevPosRef.current && !navigateCooldown.current) {
      const dt = now - lastTimeRef.current
      if (dt > 0 && dt < 100) { // ensure consistent framerate
        const vX = (palmPos.x - prevPosRef.current.x) / dt
        const vY = (palmPos.y - prevPosRef.current.y) / dt

        const flickThresholdX = 0.0035
        const flickThresholdY = 0.004

        let swipeDir = null
        if (vX > flickThresholdX) swipeDir = 'swipeR'
        else if (vX < -flickThresholdX) swipeDir = 'swipeL'
        else if (vY > flickThresholdY) swipeDir = 'home'

        if (swipeDir) {
          onNavigateRef.current?.(swipeDir)
          navigateCooldown.current = true
          setTimeout(() => { navigateCooldown.current = false }, 800)
        }
      }
    }
    prevPosRef.current = palmPos
    lastTimeRef.current = now

    // Draw hand skeleton (minimal)
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.5)'
    ctx.lineWidth = 1.5
    const connections = window.HAND_CONNECTIONS || []
    for (const [a, b] of connections) {
      if (landmarks[a] && landmarks[b]) {
        ctx.beginPath()
        ctx.moveTo(landmarks[a].x * canvas.width, landmarks[a].y * canvas.height)
        ctx.lineTo(landmarks[b].x * canvas.width, landmarks[b].y * canvas.height)
        ctx.stroke()
      }
    }

    // Draw all non-tip landmarks
    ctx.fillStyle = 'rgba(0, 212, 255, 0.6)'
    landmarks.forEach((lm, idx) => {
      if (![4, 8, 12, 16, 20].includes(idx)) {
        ctx.beginPath()
        ctx.arc(lm.x * canvas.width, lm.y * canvas.height, 2.5, 0, Math.PI * 2)
        ctx.fill()
      }
    })

    // Draw fingertips with color coding (Green = Raised, Red = Folded)
    const wristNode = landmarks[0]
    let pSize = 0
    ;[landmarks[5], landmarks[9], landmarks[13], landmarks[17]].forEach(mcp => {
      pSize += Math.hypot(mcp.x - wristNode.x, mcp.y - wristNode.y)
    })
    pSize /= 4

    ;[4, 8, 12, 16, 20].forEach(tipIdx => {
      const tip = landmarks[tipIdx]
      const dist = Math.hypot(tip.x - wristNode.x, tip.y - wristNode.y)
      const isRaised = dist > pSize * 1.25
      
      ctx.fillStyle = isRaised ? '#0af5a0' : '#f43f5e'
      ctx.beginPath()
      ctx.arc(tip.x * canvas.width, tip.y * canvas.height, 4, 0, Math.PI * 2)
      ctx.fill()
    })

    // Classify gesture (fist or open only)
    const gesture = classifyHand(landmarks)

    if (gesture === 'fist') {
      onGestureRef.current('fist')
      setGestureLabel(GESTURE_LABELS.fist)
    } else if (gesture === 'open') {
      onGestureRef.current('open')
      setGestureLabel(GESTURE_LABELS.open)
    } else {
      onGestureRef.current('normal')
      setGestureLabel(GESTURE_LABELS.idle)
    }
  }, []) // stable — reads from refs

  useEffect(() => {
    if (!enabled) {
      handsRef.current?.close?.()
      cameraRef.current?.stop?.()
      handsRef.current = null
      cameraRef.current = null
      onGestureRef.current('normal')
      onHandPositionRef.current?.(null)
      prevPosRef.current = null
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

        const video = videoRef.current
        if (!video || !active) return

        const cam = new Camera(video, {
          onFrame: async () => {
            if (handsRef.current && active) {
              await handsRef.current.send({ image: video })
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
      handsRef.current = null
      cameraRef.current = null
    }
  }, [enabled])

  return { videoRef, canvasRef, gestureLabel, handVisible }
}

export { GESTURE_LABELS }
