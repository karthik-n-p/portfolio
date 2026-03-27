import { useState, useCallback, useRef, useEffect } from 'react'
import SceneCanvas from './three/SceneCanvas.jsx'
import GestureOverlay from './gesture/GestureOverlay.jsx'
import HubPanel from './ui/HubPanel.jsx'
import PipelinePanel from './ui/PipelinePanel.jsx'
import ProjectsPanel from './ui/ProjectsPanel.jsx'
import SkillsPanel from './ui/SkillsPanel.jsx'
import CertsPanel from './ui/CertsPanel.jsx'
import EducationPanel from './ui/EducationPanel.jsx'
import ConnectPanel from './ui/ConnectPanel.jsx'
import { colors, typography } from './design-tokens.js'

/**
 * App — Root component
 * Manages: activeNode, gestureMode, gestureState
 * Renders: Three.js canvas + floating panels + nav + gesture overlay
 */

const PANELS = {
  hub:       HubPanel,
  pipeline:  PipelinePanel,
  projects:  ProjectsPanel,
  skills:    SkillsPanel,
  certs:     CertsPanel,
  education: EducationPanel,
  connect:   ConnectPanel,
}

const NAV_NODES = [
  { key: 'hub',       label: 'HUB',     color: colors.section.hub },
  { key: 'pipeline',  label: 'EXP',     color: colors.section.pipeline },
  { key: 'projects',  label: 'PROJ',    color: colors.section.projects },
  { key: 'skills',    label: 'SKILLS',  color: colors.section.skills },
  { key: 'certs',     label: 'CERTS',   color: colors.section.certs },
  { key: 'education', label: 'EDU',     color: colors.section.education },
  { key: 'connect',   label: 'CONNECT', color: colors.section.connect },
]

const ROLES = [
  'DATA ENGINEER',
  'HOBBYIST WEB DEVELOPER',
  'PRODUCT BUILDER'
]

export default function App() {
  const [activeNode, setActiveNode] = useState(null)
  const [gestureMode, setGestureMode] = useState(false)
  const [gestureState, setGestureState] = useState('normal')
  const [handPosition, setHandPosition] = useState(null)

  // Typography animation state
  const [roleIndex, setRoleIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fullText = ROLES[roleIndex]
    let timer

    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText(fullText.substring(0, currentText.length - 1))
        if (currentText.length <= 1) {
          setIsDeleting(false)
          setRoleIndex(i => (i + 1) % ROLES.length)
        }
      }, 40)
    } else {
      if (currentText === fullText) {
        timer = setTimeout(() => setIsDeleting(true), 2500)
      } else {
        timer = setTimeout(() => {
          setCurrentText(fullText.substring(0, currentText.length + 1))
        }, 90)
      }
    }
    return () => clearTimeout(timer)
  }, [currentText, isDeleting, roleIndex])

  // Stable ref for activeNode to prevent handleNavigate from changing identity
  const activeNodeRef = useRef(activeNode)
  useEffect(() => { activeNodeRef.current = activeNode }, [activeNode])

  const handleNodeSelect = useCallback((key) => {
    setActiveNode(prev => prev === key ? null : key)
  }, [])

  const handleGesture = useCallback((state) => {
    setGestureState(state)
  }, [])

  const handleNavigate = useCallback((dir) => {
    const idx = NAV_NODES.findIndex(n => n.key === activeNodeRef.current)
    if (dir === 'next') {
      const next = NAV_NODES[(idx + 1) % NAV_NODES.length]
      setActiveNode(next.key)
    } else if (dir === 'home') {
      setActiveNode(null)
    }
  }, [])

  const handleHandPosition = useCallback((pos) => {
    setHandPosition(pos)
  }, [])

  const ActivePanel = activeNode ? PANELS[activeNode] : null

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: colors.neutral[950] }}>
      {/* Three.js scene */}
      <SceneCanvas
        gestureState={gestureState}
        activeNode={activeNode}
        handPosition={handPosition}
      />

      {/* Hire Me Badge */}
      <div style={{
        position: 'fixed', top: '24px', left: '24px', zIndex: 100,
        display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start'
      }}>
        <button
          onClick={() => handleNodeSelect('connect')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 16px', borderRadius: '20px',
            background: `rgba(52, 211, 153, 0.1)`, // emerald 10%
            border: `1px solid rgba(52, 211, 153, 0.25)`,
            color: '#6ee7b7', // emerald 300
            fontFamily: typography.fontSans, fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.05em',
            backdropFilter: 'blur(8px)',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = `rgba(52, 211, 153, 0.2)`
            e.currentTarget.style.borderColor = `rgba(52, 211, 153, 0.5)`
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = `0 8px 16px rgba(52, 211, 153, 0.15)`
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = `rgba(52, 211, 153, 0.1)`
            e.currentTarget.style.borderColor = `rgba(52, 211, 153, 0.25)`
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors.emerald, boxShadow: `0 0 8px ${colors.emerald}` }} className="cursor-blink" />
          HIRE ME
        </button>
      </div>

      {/* Node navigation — bottom center */}
      <nav style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '6px',
        padding: '10px 14px',
        width: 'max-content',
        maxWidth: '94vw',
        border: `1px solid ${colors.neutral[700]}60`,
        borderRadius: '12px',
        background: 'rgba(14,14,20,0.85)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        {NAV_NODES.map(({ key, label, color }) => (
          <button
            key={key}
            id={`nav-${key}`}
            onClick={() => handleNodeSelect(key)}
            className="nav-btn"
            style={{
              padding: '8px 14px',
              border: `1px solid ${activeNode === key ? color : 'transparent'}`,
              borderRadius: '6px',
              background: activeNode === key ? `${color}18` : 'rgba(255,255,255,0.03)',
              color: activeNode === key ? color : colors.neutral[300],
              fontFamily: "'Inter', sans-serif",
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.05em',
              transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
              position: 'relative',
            }}
            onMouseEnter={e => {
              if (activeNode !== key) {
                e.currentTarget.style.color = colors.neutral[100]
                e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
              }
            }}
            onMouseLeave={e => {
              if (activeNode !== key) {
                e.currentTarget.style.color = colors.neutral[300]
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
              }
            }}
          >
            {label}
            {activeNode === key && (
              <div style={{
                position: 'absolute', bottom: '2px', left: '50%', transform: 'translateX(-50%)',
                width: '16px', height: '2px', borderRadius: '1px',
                background: color, transition: 'all 0.3s ease',
              }} />
            )}
          </button>
        ))}
      </nav>

      {/* Hero Header */}
<div style={{
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  pointerEvents: 'none',
  userSelect: 'none',
  zIndex: 90,
  opacity: activeNode ? 0 : 1,
  visibility: activeNode ? 'hidden' : 'visible',
  transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
}}>
  {/* Name */}
  <div style={{
    fontSize: 'clamp(44px, 9vw, 72px)',
    fontFamily: typography.fontSans,
    fontWeight: 900,
    letterSpacing: '-0.045em',
    lineHeight: 0.95,
    color: '#ffffff',
    marginBottom: '6px', // Tightened from 20px
  }}>
    KARTHIK NP
  </div>

  {/* Divider */}
  <div style={{
    width: '40px',
    height: '2px',
    background: `linear-gradient(90deg, transparent, ${colors.emerald}80, transparent)`,
    marginBottom: '16px', // Tightened from 20px
    borderRadius: '1px',
  }} />

  {/* Role pill */}
  <div style={{
    display: 'inline-flex',
    alignItems: 'center',
    fontFamily: typography.fontMono,
    fontSize: 'clamp(14px, 3.5vw, 19px)', // slightly larger
    fontWeight: 900, // max boldness
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#ffffff', // pure white for extreme visibility
    textShadow: `0 0 16px ${colors.emerald}, 0 0 4px ${colors.emerald}`, // strong neon glow against the purple 3D void
    background: `${colors.emerald}15`, // slightly more opacity to separate from 3D lines
    border: `1px solid ${colors.emerald}40`,
    borderRadius: '8px',
    padding: '10px 18px',
    boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 0 0 16px ${colors.emerald}15`,
  }}>
    <span style={{
      color: 'rgba(255,255,255,0.4)',
      marginRight: '12px',
      fontWeight: 600,
      textShadow: 'none',
    }}>~$</span>
    {currentText}
    <span style={{
      display: 'inline-block',
      width: '5px',
      height: '1.1em',
      backgroundColor: '#ffffff',
      boxShadow: `0 0 12px ${colors.emerald}`,
      marginLeft: '10px',
      verticalAlign: 'middle',
    }} className="cursor-blink" />
  </div>

  {/* Hint */}
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '32px',
    opacity: 0.8,
  }}>
    <div style={{
      fontFamily: typography.fontSans,
      textTransform: 'uppercase',
      letterSpacing: '0.15em',
      fontSize: '12px',
      fontWeight: 600,
      color: colors.neutral[200], // Huge visibility boost
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }}>
      <div style={{ width: 4, height: 4, borderRadius: '50%', background: colors.emerald, boxShadow: `0 0 8px ${colors.emerald}` }} className="cursor-blink" />
      SELECT A SECTION TO EXPLORE
      <div style={{ width: 4, height: 4, borderRadius: '50%', background: colors.emerald, boxShadow: `0 0 8px ${colors.emerald}` }} className="cursor-blink" />
    </div>
  </div>
</div>

      {/* Click-outside to close panel */}
      {activeNode && (
        <div
          onClick={() => setActiveNode(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 70,
            cursor: 'pointer',
          }}
        />
      )}

      {/* Floating panel wrapper */}
      {ActivePanel && (
        <div className="panel-layout-wrapper">
          <ActivePanel onClose={() => setActiveNode(null)} />
        </div>
      )}

      {/* Gesture overlay */}
      <GestureOverlay
        enabled={gestureMode}
        onToggle={() => setGestureMode(prev => !prev)}
        onGesture={handleGesture}
        onNavigate={handleNavigate}
        onHandPosition={handleHandPosition}
      />
    </div>
  )
}
