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
            padding: '10px 20px', borderRadius: '12px',
            background: `rgba(0, 240, 255, 0.05)`, // cyan tint
            border: `1px solid rgba(0, 240, 255, 0.2)`,
            color: '#00F0FF', // cyan text
            fontFamily: typography.fontSans, fontSize: '12px', fontWeight: 800,
            letterSpacing: '0.1em',
            backdropFilter: 'blur(12px)',
            cursor: 'pointer',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = `rgba(0, 240, 255, 0.15)`
            e.currentTarget.style.borderColor = `rgba(0, 240, 255, 0.6)`
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = `0 12px 24px rgba(0, 240, 255, 0.2), 0 0 12px rgba(0, 240, 255, 0.1) inset`
            e.currentTarget.style.color = '#ffffff'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = `rgba(0, 240, 255, 0.05)`
            e.currentTarget.style.borderColor = `rgba(0, 240, 255, 0.2)`
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.color = '#00F0FF'
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors.accent, boxShadow: `0 0 10px ${colors.accent}` }} className="cursor-blink" />
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
  {/* Greeting */}
  <div style={{
    fontSize: 'clamp(14px, 4vw, 22px)',
    fontFamily: typography.fontMono,
    fontWeight: 800,
    letterSpacing: '0.25em',
    color: '#00F0FF',
    textShadow: '0 0 15px rgba(0, 240, 255, 0.8), 0 0 30px rgba(0, 240, 255, 0.4)',
    marginBottom: '16px',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(10, 10, 15, 0.7)',
    border: '1px solid rgba(0, 240, 255, 0.5)',
    padding: '8px 20px',
    borderRadius: '30px',
    backdropFilter: 'blur(16px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.8), inset 0 0 16px rgba(0, 240, 255, 0.2)',
  }}>
    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffffff', boxShadow: '0 0 16px #ffffff' }} className="cursor-blink" />
    HI, I AM
  </div>

  {/* Name */}
  <div style={{
    fontSize: 'clamp(48px, 10vw, 96px)',
    fontFamily: typography.fontSans,
    fontWeight: 900,
    letterSpacing: '-0.03em',
    lineHeight: 1,
    marginBottom: '12px',
  }} className="text-gradient">
    KARTHIK NP
  </div>

  {/* Divider */}
  <div style={{
    width: '60px',
    height: '3px',
    background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)`,
    marginBottom: '24px',
    borderRadius: '2px',
    boxShadow: `0 0 15px ${colors.accent}`,
  }} />

  {/* Role pill */}
  <div style={{
    display: 'inline-flex',
    alignItems: 'center',
    fontFamily: typography.fontMono,
    fontSize: 'clamp(14px, 3.5vw, 20px)',
    fontWeight: 700,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: '#ffffff',
    textShadow: `0 0 10px ${colors.accent}`,
    background: 'rgba(10, 10, 15, 0.5)',
    backdropFilter: 'blur(16px)',
    border: `1px solid rgba(0, 240, 255, 0.3)`,
    borderRadius: '12px',
    padding: '12px 24px',
    boxShadow: `0 16px 40px rgba(0,0,0,0.6), inset 0 0 20px rgba(0, 240, 255, 0.05)`,
  }}>
    <span style={{
      color: 'rgba(255,255,255,0.3)',
      marginRight: '12px',
      fontWeight: 500,
      textShadow: 'none',
    }}>~$</span>
    {currentText}
    <span style={{
      display: 'inline-block',
      width: '6px',
      height: '18px',
      backgroundColor: '#ffffff',
      boxShadow: `0 0 12px ${colors.accent}`,
      marginLeft: '10px',
      verticalAlign: 'middle',
    }} className="cursor-blink" />
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
        <div className="panel-layout-wrapper" style={{ zIndex: 80 }}>
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
