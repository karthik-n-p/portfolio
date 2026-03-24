import { useState, useEffect } from 'react'
import { useGestureEngine, GESTURE_LABELS } from './GestureEngine.js'

/**
 * GestureOverlay — Camera view + gesture instructions + toggle button
 * Simplified: only fist/open gestures + hand position tracking
 */
export default function GestureOverlay({ enabled, onToggle, onGesture, onNavigate, onHandPosition }) {
  const [showInstructions, setShowInstructions] = useState(false)
  const { videoRef, canvasRef, gestureLabel, handVisible } = useGestureEngine({
    enabled,
    onGesture,
    onNavigate,
    onHandPosition,
  })

  useEffect(() => {
    if (enabled) {
      setShowInstructions(true)
      const t = setTimeout(() => setShowInstructions(false), 8000)
      return () => clearTimeout(t)
    } else {
      setShowInstructions(false)
    }
  }, [enabled])

  // Animated guide components
  const GuideFist = () => (
    <div style={{ position: 'relative', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 2, border: '1px solid rgba(0,212,255,0.4)', borderRadius: '50%', animation: 'rippleIn 1.5s infinite' }} />
      <span style={{ fontSize: '18px', zIndex: 2 }}>✊</span>
    </div>
  )

  const GuideOpen = () => (
    <div style={{ position: 'relative', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 6, border: '1px solid rgba(10,245,160,0.4)', borderRadius: '50%', animation: 'rippleOut 1.5s infinite' }} />
      <span style={{ fontSize: '18px', zIndex: 2 }}>🖐</span>
    </div>
  )

  const GuideMove = () => (
    <div style={{ position: 'relative', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 4, border: '1px solid rgba(139,92,246,0.4)', borderRadius: '50%', animation: 'rippleOut 1.5s infinite' }} />
      <span style={{ fontSize: '18px', zIndex: 2 }}>👋</span>
    </div>
  )

  const GuideSwipeL = () => <div style={{ fontSize: '24px', opacity: 0.8 }}>👈</div>
  const GuideSwipeR = () => <div style={{ fontSize: '24px', opacity: 0.8 }}>👉</div>
  const GuideSwipeU = () => <div style={{ fontSize: '24px', opacity: 0.8 }}>👆</div>

  return (
    <>
      {/* Help toggle */}
      {enabled && (
        <button
          onClick={() => setShowInstructions(p => !p)}
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px', // moved from right: 180px to left to prevent clash on mobile
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            border: `1px solid ${showInstructions ? 'rgba(0,212,255,0.8)' : 'rgba(0,212,255,0.25)'}`,
            borderRadius: '4px',
            background: showInstructions ? 'rgba(0,212,255,0.1)' : 'rgba(5,10,14,0.8)',
            color: showInstructions ? '#00d4ff' : '#7ab3cc',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(8px)',
          }}
          title="Toggle Gesture Instructions"
        >
          ?
        </button>
      )}

      {/* Mode toggle */}
      <button
        onClick={onToggle}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          border: `1px solid ${enabled ? 'rgba(0,212,255,0.8)' : 'rgba(0,212,255,0.25)'}`,
          borderRadius: '4px',
          background: enabled ? 'rgba(0,212,255,0.1)' : 'rgba(5,10,14,0.8)',
          color: enabled ? '#00d4ff' : '#7ab3cc',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '11px',
          cursor: 'pointer',
          letterSpacing: '0.1em',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(8px)',
          boxShadow: enabled ? '0 0 20px rgba(0,212,255,0.2)' : 'none',
        }}
      >
        <span style={{
          width: 8, height: 8,
          borderRadius: '50%',
          background: enabled ? '#00d4ff' : '#3d6b7a',
          boxShadow: enabled ? '0 0 6px #00d4ff' : 'none',
          transition: 'all 0.3s ease',
        }} />
        {enabled ? 'GESTURE MODE' : 'NORMAL MODE'}
      </button>

      {/* Hidden video element for MediaPipe */}
      <video
        ref={videoRef}
        style={{ position: 'fixed', top: -9999, left: -9999, width: 1, height: 1 }}
        autoPlay
        playsInline
        muted
      />

      {/* Hand landmark canvas — bottom right corner */}
      {enabled && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 100,
          border: '1px solid rgba(0,212,255,0.2)',
          borderRadius: '4px',
          overflow: 'hidden',
          background: 'rgba(5,10,14,0.7)',
          backdropFilter: 'blur(8px)',
        }}>
          <canvas
            ref={canvasRef}
            width={160}
            height={120}
            style={{ display: 'block', transform: 'scaleX(-1)' }}
          />
          <div style={{
            padding: '4px 8px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '9px',
            color: handVisible ? '#00d4ff' : '#3d6b7a',
            borderTop: '1px solid rgba(0,212,255,0.15)',
            textAlign: 'center',
            letterSpacing: '0.05em',
          }}>
            {handVisible ? gestureLabel : 'NO HAND DETECTED'}
          </div>
        </div>
      )}

      {/* Instruction overlay */}
      {enabled && showInstructions && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 200,
          padding: '24px', // Reduced padding for mobile
          width: '90vw',
          maxWidth: '460px',
          maxHeight: '80vh',
          overflowY: 'auto',
          border: '1px solid rgba(0,212,255,0.3)',
          borderRadius: '8px',
          background: 'rgba(5,10,14,0.92)',
          backdropFilter: 'blur(16px)',
          fontFamily: 'JetBrains Mono, monospace',
          animation: 'panelIn 0.3s ease forwards',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '10px', color: '#3d6b7a', letterSpacing: '0.15em', marginBottom: '8px' }}>
            GESTURE CONTROL ACTIVE
          </div>
          <div style={{ fontSize: '11px', color: '#7ab3cc', marginBottom: '24px', maxWidth: '280px', lineHeight: 1.5 }}>
            Move your hand to control particles. The particles follow your hand position.
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px', textAlign: 'left' }}>
            {[
              [<GuideFist key="1" />, 'Closed Fist', 'Attract to hand'],
              [<GuideOpen key="2" />, 'Open Hand', 'Repel from hand'],
              [<GuideMove key="3" />, 'Move Hand', 'Particles follow'],
              [<GuideSwipeL key="4" />, 'Flick Left', 'Prev Node'],
              [<GuideSwipeR key="5" />, 'Flick Right', 'Next Node'],
              [<GuideSwipeU key="6" />, 'Flick Up', 'Home Screen'],
            ].map(([Icon, name, desc]) => (
              <div key={name} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px',
                background: 'rgba(0,212,255,0.03)',
                border: '1px solid rgba(0,212,255,0.1)',
                borderRadius: '6px',
              }}>
                {Icon}
                <div>
                  <div style={{ fontSize: '12px', color: '#00d4ff', marginBottom: '2px', fontWeight: 600 }}>{name}</div>
                  <div style={{ fontSize: '10px', color: '#7ab3cc' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: '9px', color: '#3d6b7a', marginTop: '20px' }}>
            Use the nav buttons below for page navigation.
          </div>
        </div>
      )}
    </>
  )
}
