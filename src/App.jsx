import { useState, useCallback, useRef, useEffect } from 'react'
import SceneCanvas from './three/SceneCanvas.jsx'
import GestureOverlay from './gesture/GestureOverlay.jsx'
import { AudioAnalyzer } from './three/AudioAnalyzer.js'
import HubPanel from './ui/HubPanel.jsx'
import PipelinePanel from './ui/PipelinePanel.jsx'
import ProjectsPanel from './ui/ProjectsPanel.jsx'
import SkillsPanel from './ui/SkillsPanel.jsx'
import CertsPanel from './ui/CertsPanel.jsx'
import EducationPanel from './ui/EducationPanel.jsx'
import ConnectPanel from './ui/ConnectPanel.jsx'
import Preloader from './ui/Preloader.jsx'
import ScrambleText from './ui/ScrambleText.jsx'
import { colors, typography, sectionColors, SECTIONS } from './design-tokens.js'

/**
 * App — Root component with scroll-based Data Journey navigation
 *
 * Alternating layout: on each scroll transition, the content panel
 * and 3D model swap sides (left→right, right→left) creating a
 * cinematic zigzag journey through data engineering stages.
 *
 *   0: Hero → Centered (full screen)
 *   1: Hub → Content LEFT, 3D RIGHT
 *   2: Pipeline → Content RIGHT, 3D LEFT
 *   3: Skills → Content LEFT, 3D RIGHT
 *   4: Projects → Content RIGHT, 3D LEFT
 *   ...and so on
 */

const SECTION_PANELS = {
  hub:       HubPanel,
  pipeline:  PipelinePanel,
  projects:  ProjectsPanel,
  skills:    SkillsPanel,
  certs:     CertsPanel,
  education: EducationPanel,
  connect:   ConnectPanel,
}

const ROLES = ['DATA ENGINEER', 'WEB DEVELOPER', 'PRODUCT BUILDER']

export default function App() {
  const [appLoaded, setAppLoaded] = useState(false)
  const [sectionIndex, setSectionIndex] = useState(0)
  const [displaySectionIndex, setDisplaySectionIndex] = useState(0)
  const [gestureMode, setGestureMode] = useState(false)
  const [gestureState, setGestureState] = useState('normal')
  const [handPosition, setHandPosition] = useState(null)
  const [headPosition, setHeadPosition] = useState(null)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [audioData, setAudioData] = useState({ bass: 0, mid: 0, treble: 0, overall: 0 })
  const [roleIndex, setRoleIndex] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  const audioRef = useRef(null)
  const audioRafRef = useRef(null)
  const scrollCooldown = useRef(false)

  // Role cycling
  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIndex(i => (i + 1) % ROLES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  // Audio loop
  useEffect(() => {
    if (!audioEnabled) return
    const loop = () => {
      if (audioRef.current?.active) {
        setAudioData(audioRef.current.getData())
      }
      audioRafRef.current = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(audioRafRef.current)
  }, [audioEnabled])

  // Toggle audio
  const toggleAudio = useCallback(async () => {
    if (audioEnabled) {
      audioRef.current?.stop()
      audioRef.current = null
      setAudioEnabled(false)
      setAudioData({ bass: 0, mid: 0, treble: 0, overall: 0 })
    } else {
      const analyzer = new AudioAnalyzer()
      const ok = await analyzer.start()
      if (ok) {
        audioRef.current = analyzer
        setAudioEnabled(true)
      }
    }
  }, [audioEnabled])

  // Scroll navigation
  const goToSection = useCallback((index) => {
    const clamped = Math.max(0, Math.min(SECTIONS.length - 1, index))
    if (clamped === sectionIndex || scrollCooldown.current) return
    scrollCooldown.current = true
    setTransitioning(true)
    setSectionIndex(clamped) // Trigger 3D transition immediately
    setTimeout(() => {
      setDisplaySectionIndex(clamped) // Swap UI content after fade out
      setTransitioning(false)
      setTimeout(() => { scrollCooldown.current = false }, 400)
    }, 250) // Reduced delay for more responsive feel
  }, [sectionIndex])

  // Helper to check if an event target is inside an internal content panel
  const isPanelInteraction = useCallback((target) => {
    let el = target
    while (el && el !== document.body) {
      if (el.classList?.contains('content-panel') || el.classList?.contains('panel-scroll')) {
        return true
      }
      el = el.parentElement
    }
    return false
  }, [])

  // Mouse wheel handler
  useEffect(() => {
    const onWheel = (e) => {
      // If we are scrolling inside a panel, ignore it for navigation
      if (isPanelInteraction(e.target)) return

      if (Math.abs(e.deltaY) < 30) return
      if (e.deltaY > 0) goToSection(sectionIndex + 1)
      else goToSection(sectionIndex - 1)
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [sectionIndex, goToSection, isPanelInteraction])

  // Touch swipe handler
  useEffect(() => {
    let touchStartY = 0
    let touchTarget = null
    let touchStartScrollTop = 0

    // Find the nearest ancestor that is BOTH a panel container AND actually overflows vertically.
    // This handles cases where inner wrapper divs (e.g. .panel-scroll) exist but have no
    // overflow style — we need the real scrollable element.
    const getScrollablePanel = (el) => {
      let node = el
      while (node && node !== document.body) {
        const isPanel =
          node.classList?.contains('content-panel') ||
          node.classList?.contains('panel-scroll')
        if (isPanel && node.scrollHeight > node.clientHeight + 8) {
          return node
        }
        node = node.parentElement
      }
      return null
    }

    const onTouchStart = (e) => {
      touchStartY = e.touches[0].clientY
      touchTarget = e.target
      const panel = getScrollablePanel(touchTarget)
      touchStartScrollTop = panel ? panel.scrollTop : 0
    }

    const onTouchEnd = (e) => {
      const delta = touchStartY - e.changedTouches[0].clientY
      if (Math.abs(delta) < 60) return

      const panel = getScrollablePanel(touchTarget)
      if (panel) {
        // Only navigate if the panel is already scrolled to the edge in the swipe direction
        const atBottom = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 4
        const atTop = panel.scrollTop <= 4
        const swipingDown = delta > 0  // user wants to go to next section
        const swipingUp = delta < 0    // user wants to go to prev section

        if (swipingDown && !atBottom) return  // panel still has content below — don't navigate
        if (swipingUp && !atTop) return        // panel still has content above — don't navigate

        // Also check that the scroll position was already at the edge when the touch started
        if (swipingDown && touchStartScrollTop + panel.clientHeight < panel.scrollHeight - 4) return
        if (swipingUp && touchStartScrollTop > 4) return
      }

      if (delta > 0) goToSection(sectionIndex + 1)
      else goToSection(sectionIndex - 1)
    }
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [sectionIndex, goToSection])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      // Don't hijack keyboard input when user is typing in a form field
      const tag = document.activeElement?.tagName?.toLowerCase()
      const isTyping = tag === 'input' || tag === 'textarea' || tag === 'select' ||
        document.activeElement?.isContentEditable
      if (isTyping) return

      if (e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); goToSection(sectionIndex + 1) }
      if (e.key === 'ArrowUp') { e.preventDefault(); goToSection(sectionIndex - 1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sectionIndex, goToSection])

  const handleGesture = useCallback((state) => setGestureState(state), [])

  // Gesture navigation: 2 fingers → next, 3 fingers → prev
  const handleNavigate = useCallback((dir) => {
    if (dir === 'next') goToSection(sectionIndex + 1)
    else if (dir === 'home') goToSection(sectionIndex - 1)
  }, [sectionIndex, goToSection])

  const handleHandPosition = useCallback((pos) => setHandPosition(pos), [])
  const handleHeadPosition = useCallback((pos) => setHeadPosition(pos), [])

  // UI variables use displaySectionIndex to avoid updating content before fade out
  const currentSection = SECTIONS[displaySectionIndex]
  const sectionKey = currentSection.key
  const ActivePanel = SECTION_PANELS[sectionKey] || null
  const isHero = displaySectionIndex === 0

  // Determine if content should be on the left or right
  const isContentLeft = displaySectionIndex % 2 === 1
  const currentSectionColor = sectionColors[sectionKey] || sectionColors.hero

  // Canvas uses sectionIndex for immediate response
  const canvasSectionKey = SECTIONS[sectionIndex].key

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: colors.neutral[950] }}>
      {/* Three.js Scene */}
      <SceneCanvas
        gestureState={gestureState}
        activeSection={canvasSectionKey}
        sectionIndex={sectionIndex}
        handPosition={handPosition}
        headPosition={headPosition}
        audioData={audioData}
      />

      {/* Preloader */}
      {!appLoaded && <Preloader onComplete={() => setAppLoaded(true)} />}

      {/* Main UI — fades in after preloader */}
      <div style={{
        opacity: appLoaded ? 1 : 0,
        pointerEvents: appLoaded ? 'auto' : 'none',
        transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        width: '100%', height: '100%',
        position: 'absolute', inset: 0, zIndex: 10,
      }}>

        {/* ─── TOP BAR ─── */}
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 24px',
        }}>
          {/* Hire Me — top left */}
          <button
            onClick={() => goToSection(SECTIONS.length - 1)}
            id="hire-me-btn"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 18px', borderRadius: '8px',
              background: `${currentSectionColor.primary}10`,
              border: `1px solid ${currentSectionColor.primary}25`,
              color: currentSectionColor.primary,
              fontFamily: typography.fontSans, fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.1em', backdropFilter: 'blur(12px)',
              cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = `${currentSectionColor.primary}25`
              e.currentTarget.style.borderColor = `${currentSectionColor.primary}60`
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = `0 8px 24px ${currentSectionColor.primary}20`
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = `${currentSectionColor.primary}10`
              e.currentTarget.style.borderColor = `${currentSectionColor.primary}25`
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div style={{
              width: 5, height: 5, borderRadius: '50%',
              background: currentSectionColor.primary,
              boxShadow: `0 0 8px ${currentSectionColor.glow}`,
              transition: 'all 0.6s ease',
            }} className="cursor-blink" />
            HIRE ME
          </button>

          {/* Right controls */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
            {/* Gesture Mode toggle */}
            <button
              onClick={() => setGestureMode(prev => !prev)}
              id="gesture-toggle"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', borderRadius: '8px',
                background: gestureMode ? `${currentSectionColor.primary}18` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${gestureMode ? `${currentSectionColor.primary}50` : 'rgba(255,255,255,0.06)'}`,
                color: gestureMode ? currentSectionColor.primary : colors.neutral[400],
                fontFamily: typography.fontMono, fontSize: '10px', fontWeight: 500,
                letterSpacing: '0.08em', cursor: 'pointer',
                transition: 'all 0.3s ease', backdropFilter: 'blur(8px)',
              }}
            >
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: gestureMode ? currentSectionColor.primary : colors.neutral[600],
                boxShadow: gestureMode ? `0 0 8px ${currentSectionColor.glow}` : 'none',
                transition: 'all 0.3s ease',
              }} />
              {gestureMode ? 'GESTURE ON' : 'GESTURE OFF'}
            </button>

            {/* Audio Sync toggle */}
            <button
              onClick={toggleAudio}
              id="audio-toggle"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', borderRadius: '8px',
                background: audioEnabled ? `${currentSectionColor.primary}18` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${audioEnabled ? `${currentSectionColor.primary}50` : 'rgba(255,255,255,0.06)'}`,
                color: audioEnabled ? currentSectionColor.primary : colors.neutral[400],
                fontFamily: typography.fontMono, fontSize: '10px', fontWeight: 500,
                letterSpacing: '0.08em', cursor: 'pointer',
                transition: 'all 0.3s ease', backdropFilter: 'blur(8px)',
              }}
            >
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: audioEnabled ? currentSectionColor.primary : colors.neutral[600],
                boxShadow: audioEnabled ? `0 0 8px ${currentSectionColor.glow}` : 'none',
                transition: 'all 0.3s ease',
              }} />
              {audioEnabled ? 'AUDIO SYNC' : 'AUDIO OFF'}
            </button>
          </div>
        </div>

        {/* ─── SCROLL PROGRESS (right side dots) ─── */}
        <div className="scroll-progress">
          {SECTIONS.map((s, i) => {
            const dotColor = sectionColors[s.key]
            const isActive = i === sectionIndex
            return (
              <div
                key={s.key}
                className={`scroll-dot ${isActive ? 'active' : ''}`}
                data-label={s.label}
                onClick={() => goToSection(i)}
                style={isActive ? {
                  background: dotColor.primary,
                  boxShadow: `0 0 12px ${dotColor.glow}80`,
                } : {}}
              />
            )
          })}
        </div>

        {/* ─── SECTION COLOR ACCENT LINE ─── */}
        {!isHero && (
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${currentSectionColor.primary}, ${currentSectionColor.secondary}, transparent)`,
            opacity: transitioning ? 0 : 0.6,
            transition: 'opacity 0.6s ease',
            zIndex: 50,
          }} />
        )}

        {/* ─── BOTTOM HUD (Persistent Data Labels) ─── */}
        <div className={`bottom-hud ${isHero ? 'is-hero' : ''}`} style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 60,
          padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          pointerEvents: 'none',
        }}>
          {/* Active Diagram Name */}
          <div className="hud-diagram" style={{
            fontFamily: typography.fontMono, fontSize: '10px', fontWeight: 600,
            letterSpacing: '0.15em', color: currentSectionColor.primary,
            display: 'flex', alignItems: 'center', gap: '10px',
            textShadow: `0 0 16px ${currentSectionColor.glow}`,
            transition: 'color 0.6s ease',
            backdropFilter: 'blur(4px)',
          }}>
            <span style={{ color: colors.neutral[500], fontSize: '9px' }}>[SYS.DIAGRAM]</span>
            {currentSection.diagram}
          </div>

        </div>

        {/* ─── HERO SECTION ─── */}
        <div style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: `translate(-50%, ${isHero && !transitioning ? '-50%' : '-60%'})`,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          pointerEvents: 'none', userSelect: 'none', zIndex: 20,
          opacity: isHero && !transitioning ? 1 : 0,
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          {/* Contrast Shield to guarantee text legibility */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '120vw', height: '100vh',
            background: `radial-gradient(circle, ${colors.neutral[950]}E6 0%, ${colors.neutral[950]}60 30%, transparent 60%)`,
            zIndex: -1, pointerEvents: 'none'
          }} />

          {/* Greeting */}
          <div style={{
            fontSize: 'clamp(14px, 3.5vw, 20px)',
            fontFamily: typography.fontMono, fontWeight: 600,
            letterSpacing: '0.3em', color: colors.neutral[100],
            marginBottom: '20px', textTransform: 'uppercase',
            textShadow: `0 0 20px ${currentSectionColor.glow}80`,
          }}>
            <div className="cursor-blink" style={{
              display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
              background: colors.neutral[100],
              boxShadow: `0 0 16px ${currentSectionColor.glow}`,
              marginRight: '16px', verticalAlign: 'middle',
            }} />
            HI, I AM
          </div>

          {/* Name */}
          <div style={{
            fontSize: 'clamp(64px, 12vw, 140px)',
            fontFamily: typography.fontSans, fontWeight: 900,
            letterSpacing: '-0.05em', lineHeight: 0.95,
            marginBottom: '16px',
            filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.8))'
          }} className="text-gradient">
            KARTHIK
          </div>

          {/* Divider */}
          <div style={{
            width: '80px', height: '3px',
            background: `linear-gradient(90deg, transparent, ${currentSectionColor.primary}, transparent)`,
            marginBottom: '24px', borderRadius: '1.5px',
          }} />

          {/* Role */}
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            fontFamily: typography.fontMono,
            fontSize: 'clamp(13px, 3vw, 18px)',
            fontWeight: 500, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: colors.neutral[100],
            textShadow: '0 4px 12px rgba(0,0,0,0.8)',
          }}>
            <span style={{ color: colors.neutral[500], marginRight: '12px', fontWeight: 400 }}>~$</span>
            <ScrambleText text={ROLES[roleIndex]} speed={35} />
            <span className="cursor-blink" style={{
              display: 'inline-block', width: '6px', height: '18px',
              backgroundColor: currentSectionColor.primary, marginLeft: '10px',
              verticalAlign: 'middle',
              boxShadow: `0 0 10px ${currentSectionColor.glow}80`,
            }} />
          </div>


        </div>

        {/* ─── SECTION CONTENT (non-hero) — Alternating left/right ─── */}
        {!isHero && (
          <div className="section-content" key={sectionKey}>
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center',
              justifyContent: isContentLeft ? 'flex-start' : 'flex-end',
              padding: '80px 24px 24px',
              transition: 'justify-content 0.6s ease',
            }}>
              {/* Content panel */}
              <div style={{
                flex: '0 0 auto',
                maxWidth: '520px',
                width: '90vw',
              }} className={transitioning
                ? (isContentLeft ? 'section-exit-left' : 'section-exit-right')
                : (isContentLeft ? 'section-enter-left' : 'section-enter-right')
              }>
                {/* Section label */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    marginBottom: '0',
                  }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: currentSectionColor.primary,
                      boxShadow: `0 0 8px ${currentSectionColor.glow}`,
                      transition: 'all 0.6s ease',
                    }} />
                    <span style={{
                      fontFamily: typography.fontMono, fontSize: '10px', fontWeight: 500,
                      letterSpacing: '0.15em', color: currentSectionColor.primary,
                      textTransform: 'uppercase',
                      transition: 'color 0.6s ease',
                    }}>
                      {String(displaySectionIndex).padStart(2, '0')} — {currentSection.label}
                    </span>
                  </div>
                </div>

                {/* Panel content */}
                <div className="content-panel glass-panel" style={{
                  borderTop: `2px solid ${currentSectionColor.primary}40`,
                  transition: 'border-color 0.6s ease',
                }}>
                  {ActivePanel && <ActivePanel onClose={() => goToSection(0)} />}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gesture overlay */}
        <GestureOverlay
          enabled={gestureMode}
          onToggle={() => setGestureMode(prev => !prev)}
          onGesture={handleGesture}
          onNavigate={handleNavigate}
          onHandPosition={handleHandPosition}
          onHeadPosition={handleHeadPosition}
        />

      </div>
    </div>
  )
}
