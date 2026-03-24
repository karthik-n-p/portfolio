import { useState, useCallback, useRef, useEffect } from 'react'
import SceneCanvas from './three/SceneCanvas.jsx'
import GestureOverlay from './gesture/GestureOverlay.jsx'
import HubPanel from './ui/HubPanel.jsx'
import PipelinePanel from './ui/PipelinePanel.jsx'
import ProjectsPanel from './ui/ProjectsPanel.jsx'
import SkillsPanel from './ui/SkillsPanel.jsx'
import CertsPanel from './ui/CertsPanel.jsx'
import EducationPanel from './ui/EducationPanel.jsx'

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
}

const NAV_NODES = [
  { key: 'hub',       label: 'HUB',    color: '#00d4ff' },
  { key: 'pipeline',  label: 'EXP',    color: '#0af5a0' },
  { key: 'projects',  label: 'PROJ',   color: '#8b5cf6' },
  { key: 'skills',    label: 'SKILLS', color: '#f59e0b' },
  { key: 'certs',     label: 'CERTS',  color: '#f43f5e' },
  { key: 'education', label: 'EDU',    color: '#e879f9' },
]

export default function App() {
  const [activeNode, setActiveNode] = useState(null)
  const [gestureMode, setGestureMode] = useState(false)
  const [gestureState, setGestureState] = useState('normal')
  const [handPosition, setHandPosition] = useState(null)

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
    if (dir === 'swipeR') {
      const next = NAV_NODES[(idx + 1) % NAV_NODES.length]
      setActiveNode(next.key)
    } else if (dir === 'swipeL') {
      const prev = NAV_NODES[(idx - 1 + NAV_NODES.length) % NAV_NODES.length]
      setActiveNode(prev.key)
    } else if (dir === 'home') {
      setActiveNode(null)
    }
  }, []) // stable — reads activeNode from ref

  const handleHandPosition = useCallback((pos) => {
    setHandPosition(pos)
  }, [])

  const ActivePanel = activeNode ? PANELS[activeNode] : null

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#050a0e' }}>
      {/* Scanline overlay */}
      <div className="scanline" />

      {/* Three.js scene */}
      <SceneCanvas
        onNodeSelect={handleNodeSelect}
        gestureState={gestureState}
        activeNode={activeNode}
        handPosition={handPosition}
      />

      {/* Top-left branding removed as requested */}

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
        padding: '8px 12px',
        width: 'max-content',
        maxWidth: '90vw',
        border: '1px solid rgba(0,212,255,0.15)',
        borderRadius: '6px',
        background: 'rgba(5,10,14,0.8)',
        backdropFilter: 'blur(16px)',
      }}>
        {NAV_NODES.map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => handleNodeSelect(key)}
            style={{
              padding: '6px 12px',
              border: `1px solid ${activeNode === key ? color : 'rgba(0,212,255,0.12)'}`,
              borderRadius: '3px',
              background: activeNode === key ? `${color}18` : 'transparent',
              color: activeNode === key ? color : '#3d6b7a',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '9px',
              cursor: 'pointer',
              letterSpacing: '0.1em',
              transition: 'all 0.2s ease',
              boxShadow: activeNode === key ? `0 0 12px ${color}30` : 'none',
            }}
            onMouseEnter={e => {
              if (activeNode !== key) {
                e.currentTarget.style.color = color
                e.currentTarget.style.borderColor = `${color}40`
              }
            }}
            onMouseLeave={e => {
              if (activeNode !== key) {
                e.currentTarget.style.color = '#3d6b7a'
                e.currentTarget.style.borderColor = 'rgba(0,212,255,0.12)'
              }
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Hint text — when no panel active */}
      {!activeNode && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 10,
        }}>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 'clamp(28px, 5vw, 52px)',
            fontWeight: 700,
            color: '#00d4ff',
            textShadow: '0 0 30px rgba(0,212,255,0.5), 0 0 60px rgba(0,212,255,0.2)',
            letterSpacing: '0.12em',
            lineHeight: 1.1,
            marginBottom: '8px',
          }}>
            KARTHIK NP
          </div>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 'clamp(10px, 1.5vw, 14px)',
            color: '#7ab3cc',
            letterSpacing: '0.3em',
            marginBottom: '4px',
          }}>
            DATA ENGINEER
          </div>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '10px',
            color: '#1d4060',
            letterSpacing: '0.18em',
            marginTop: '16px',
          }}>
            CLICK A NODE OR USE THE NAV BELOW
          </div>
        </div>
      )}

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

      {/* Floating panel — sits above click-blocker */}
      {ActivePanel && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 82,
          maxHeight: '85vh',
          pointerEvents: 'all',
        }}>
          <ActivePanel onClose={() => setActiveNode(null)} />
        </div>
      )}

      {/* Gesture overlay (toggle + video + overlay) */}
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
