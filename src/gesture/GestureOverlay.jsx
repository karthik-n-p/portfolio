import { useState, useEffect, useRef } from 'react'
import { useGestureEngine } from './GestureEngine.js'
import { colors, typography, motion } from '../design-tokens.js'

/**
 * GestureOverlay — Camera view + gesture instructions + toggle button
 * Updated with finger-count gesture guide and persistent hint
 */
export default function GestureOverlay({ enabled, onToggle, onGesture, onNavigate, onHandPosition, onHeadPosition }) {
  const [showInstructions, setShowInstructions] = useState(false)
  const [navFlash, setNavFlash] = useState(null)
  const { videoRef, canvasRef, gestureLabel, handVisible, headVisible, faceError } = useGestureEngine({
    enabled,
    onGesture,
    onNavigate: (dir) => {
      onNavigate(dir)
      setNavFlash(dir === 'home' ? 'HOME' : 'NEXT')
      setTimeout(() => setNavFlash(null), 800)
    },
    onHandPosition,
    onHeadPosition,
  })

  // Fast dragging state via translate + pointer capture
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef({ startX: 0, startY: 0, isDragging: false })

  const onPointerDown = (e) => {
    dragRef.current.isDragging = true
    dragRef.current.startX = e.clientX - translate.x
    dragRef.current.startY = e.clientY - translate.y
    setIsDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (!dragRef.current.isDragging) return
    const x = e.clientX - dragRef.current.startX
    const y = e.clientY - dragRef.current.startY
    setTranslate({ x, y })
  }

  const onPointerUp = (e) => {
    dragRef.current.isDragging = false
    setIsDragging(false)
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  return (
    <>
      {/* Persistent hint when gesture mode active */}
      {enabled && !showInstructions && (
        <div style={{
          position: 'fixed',
          top: '72px',
          right: '20px',
          zIndex: 99,
          fontFamily: typography.fontMono,
          fontSize: '9px',
          color: colors.neutral[500],
          letterSpacing: '0.08em',
          padding: '4px 8px',
          background: 'rgba(10,10,15,0.8)',
          borderRadius: '4px',
          border: `1px solid ${colors.neutral[700]}40`,
          cursor: 'pointer',
        }}
        onClick={() => setShowInstructions(true)}
        >
          ✌ NEXT &nbsp;·&nbsp; 🤟 HOME &nbsp;·&nbsp; ? HELP
        </div>
      )}

      {/* Mode toggle */}
      <button
        onClick={onToggle}
        id="gesture-toggle"
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          border: `1px solid ${enabled ? colors.accent + '80' : colors.neutral[700] + '60'}`,
          borderRadius: '8px',
          background: enabled ? `${colors.accent}15` : 'rgba(10,10,15,0.85)',
          color: enabled ? colors.accent : colors.neutral[400],
          fontFamily: typography.fontSans,
          fontSize: '11px',
          fontWeight: 600,
          cursor: 'pointer',
          letterSpacing: '0.05em',
          transition: `all ${motion.base}`,
          backdropFilter: 'blur(8px)',
          boxShadow: enabled ? `0 0 20px ${colors.accent}15` : 'none',
        }}
      >
        <span style={{
          width: 8, height: 8,
          borderRadius: '50%',
          background: enabled ? colors.accent : colors.neutral[600],
          boxShadow: enabled ? `0 0 6px ${colors.accent}` : 'none',
          transition: `all ${motion.base}`,
        }} />
        {enabled ? 'GESTURE MODE' : 'NORMAL MODE'}
      </button>

      {/* Hidden video */}
      <video
        ref={videoRef}
        style={{ position: 'fixed', top: -9999, left: -9999, width: 1, height: 1 }}
        autoPlay
        playsInline
        muted
      />

      {/* Camera feed — draggable */}
      {enabled && (
        <div 
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          transform: `translate(${translate.x}px, ${translate.y}px)`,
          zIndex: 100,
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none', // Prevent native touch scrolling
          border: `1px solid ${colors.neutral[700]}60`,
          borderRadius: '8px',
          overflow: 'hidden',
          background: 'rgba(10,10,15,0.85)',
          backdropFilter: 'blur(8px)',
          boxShadow: isDragging ? '0 16px 40px rgba(0,0,0,0.8)' : '0 8px 16px rgba(0,0,0,0.3)',
          transition: isDragging ? 'none' : 'box-shadow 0.2s cubic-bezier(0.16,1,0.3,1)',
        }}>
          {/* Drag handle hint */}
          <div style={{
            width: '100%', height: '14px', background: 'rgba(255,255,255,0.02)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            borderBottom: `1px solid ${colors.neutral[700]}40`,
          }}>
            <div style={{ width: '24px', height: '3px', background: colors.neutral[600], borderRadius: '2px' }} />
          </div>
          <canvas
            ref={canvasRef}
            width={160}
            height={120}
            style={{ display: 'block', transform: 'scaleX(-1)' }}
          />
          <div style={{
            padding: '4px 8px',
            fontFamily: typography.fontMono,
            fontSize: '9px',
            color: handVisible ? colors.accent : colors.neutral[500],
            borderTop: `1px solid ${colors.neutral[700]}40`,
            textAlign: 'center',
            letterSpacing: '0.05em',
          }}>
            <div style={{ color: handVisible ? colors.accent : colors.neutral[500] }}>
              {handVisible ? gestureLabel : 'NO HAND DETECTED'}
            </div>
            <div style={{ color: faceError ? colors.rose : (headVisible ? colors.emerald : colors.neutral[500]), marginTop: '4px' }}>
              {faceError ? `FACE ERR: ${faceError}` : (headVisible ? 'FACE DETECTED' : 'NO FACE DETECTED')}
            </div>
          </div>
        </div>
      )}

      {/* Navigation flash */}
      {navFlash && (
        <div className="section-flash" style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 300,
          fontFamily: typography.fontSans,
          fontSize: '24px',
          fontWeight: 800,
          color: colors.accent,
          letterSpacing: '0.1em',
          pointerEvents: 'none',
        }}>
          {navFlash}
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
          padding: '24px',
          width: '90vw',
          maxWidth: '460px',
          maxHeight: '80vh',
          overflowY: 'auto',
          border: `1px solid ${colors.neutral[700]}60`,
          borderRadius: '12px',
          background: 'rgba(10,10,15,0.95)',
          backdropFilter: 'blur(16px)',
          fontFamily: typography.fontSans,
          animation: 'panelIn 0.3s ease forwards',
          textAlign: 'center',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '10px', color: colors.neutral[500], letterSpacing: '0.15em', fontWeight: 600 }}>
              GESTURE CONTROL ACTIVE
            </div>
            <button
              onClick={() => setShowInstructions(false)}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${colors.neutral[700]}60`,
                color: colors.neutral[400],
                cursor: 'pointer',
                width: '28px', height: '28px',
                borderRadius: '6px',
                fontSize: '11px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >✕</button>
          </div>

          <div style={{ fontSize: '12px', color: colors.neutral[400], marginBottom: '20px', lineHeight: 1.6 }}>
            Move your hand in front of the camera. Particles respond to your gestures.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', textAlign: 'left' }}>
            {[
              ['✊', '0 Fingers', 'Converge', 'Pull particles'],
              ['🖐', '5 Fingers', 'Scatter', 'Push particles'],
              ['☝', '1 Finger', 'Focus', 'Particles follow'],
              ['✌', '2 Fingers', 'Next', 'Hold 0.4s → next section'],
              ['🤟', '3 Fingers', 'Home', 'Hold 0.4s → home'],
            ].map(([icon, fingers, label, desc]) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px',
                background: `${colors.neutral[700]}15`,
                border: `1px solid ${colors.neutral[700]}40`,
                borderRadius: '8px',
              }}>
                <span style={{ fontSize: '20px', width: '28px', textAlign: 'center' }}>{icon}</span>
                <div>
                  <div style={{ fontSize: '11px', color: colors.accent, fontWeight: 600 }}>{label}</div>
                  <div style={{ fontSize: '9px', color: colors.neutral[500], marginTop: '2px' }}>{fingers}</div>
                  <div style={{ fontSize: '9px', color: colors.neutral[400], marginTop: '1px' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: '9px', color: colors.neutral[600], marginTop: '16px' }}>
            Use the nav bar below for direct section navigation.
          </div>
        </div>
      )}
    </>
  )
}
