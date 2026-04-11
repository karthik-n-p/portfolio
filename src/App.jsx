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
import Preloader from './ui/Preloader.jsx'
import ScrambleText from './ui/ScrambleText.jsx'
import { colors, typography, sectionColors, SECTIONS } from './design-tokens.js'

// ─── Section panel mapping ───────────────────────────────────────────────────
const PANELS = {
  hub: HubPanel, pipeline: PipelinePanel, projects: ProjectsPanel,
  skills: SkillsPanel, certs: CertsPanel, education: EducationPanel,
  connect: ConnectPanel,
}

const ROLES = ['DATA ENGINEER', 'WEB DEVELOPER', 'PRODUCT BUILDER']

// ─── Hooks ───────────────────────────────────────────────────────────────────
function useMediaQuery(q) {
  const [m, setM] = useState(() => window.matchMedia(q).matches)
  useEffect(() => {
    const mq = window.matchMedia(q)
    const fn = () => setM(mq.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [q])
  return m
}

// ─── Gesture toggle ──────────────────────────────────────────────────────────
function GestureBtn({ on, toggle, accent }) {
  return (
    <button onClick={toggle} style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '7px 12px', borderRadius: 8,
      background: on ? `${accent}15` : 'rgba(255,255,255,0.03)',
      border: `1px solid ${on ? `${accent}50` : 'rgba(255,255,255,0.08)'}`,
      color: on ? accent : colors.neutral[500],
      fontFamily: typography.fontMono, fontSize: '10px', fontWeight: 600,
      letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.25s',
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
        background: on ? accent : colors.neutral[700],
        boxShadow: on ? `0 0 6px ${accent}` : 'none',
        transition: 'all 0.25s',
      }} />
      {on ? 'GESTURE ON' : 'GESTURE'}
    </button>
  )
}

// ─── Section label (shared between mobile & desktop) ─────────────────────────
function SectionLabel({ label, color }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      marginBottom: 16,
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: '50%',
        background: color, boxShadow: `0 0 8px ${color}60`, flexShrink: 0,
      }} />
      <span style={{
        fontFamily: typography.fontMono, fontSize: '10px', fontWeight: 700,
        letterSpacing: '0.18em', color, textTransform: 'uppercase',
      }}>
        {label}
      </span>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [loaded, setLoaded]       = useState(false)
  const [secIdx, setSecIdx]       = useState(0)
  const [gesture, setGesture]     = useState(false)
  const [show3D, setShow3D]       = useState(true)
  const [gestureState, setGState] = useState('normal')
  const [handPos, setHandPos]     = useState(null)
  const [headPos, setHeadPos]     = useState(null)
  const [roleIdx, setRoleIdx]     = useState(0)

  const isLg      = useMediaQuery('(min-width: 1024px)')
  const scrollRef = useRef(null)

  const sec   = SECTIONS[secIdx] ?? SECTIONS[0]
  const accent = sectionColors[sec.key].primary

  // Role rotation
  useEffect(() => {
    const t = setInterval(() => setRoleIdx(i => (i + 1) % ROLES.length), 4000)
    return () => clearInterval(t)
  }, [])

  // Desktop: wheel anywhere → scroll the right column
  useEffect(() => {
    if (!isLg) return
    const fn = (e) => {
      const col = scrollRef.current
      if (!col || col.contains(e.target)) return
      e.preventDefault()
      col.scrollBy({ top: e.deltaY })
    }
    window.addEventListener('wheel', fn, { passive: false })
    return () => window.removeEventListener('wheel', fn)
  }, [isLg])

  // Scroll-spy
  useEffect(() => {
    if (!loaded) return
    const t = setTimeout(() => {
      const root = isLg ? scrollRef.current : null
      const obs = new IntersectionObserver(entries => {
        // Find the most recently intersected element (last in the array crossing the boundary)
        entries.forEach(e => {
          if (e.isIntersecting) {
            const i = Number(e.target.dataset.idx)
            if (!isNaN(i)) setSecIdx(i)
          }
        })
      }, { root, rootMargin: show3D ? '-46% 0px -50% 0px' : '-5% 0px -90% 0px', threshold: 0 })
      document.querySelectorAll('[data-idx]').forEach(el => obs.observe(el))
      return () => obs.disconnect()
    }, 300)
    return () => clearTimeout(t)
  }, [loaded, isLg, show3D])

  // Handlers
  const onGesture  = useCallback(s => setGState(s), [])
  const onHandPos  = useCallback(p => setHandPos(p), [])
  const onHeadPos  = useCallback(p => setHeadPos(p), [])
  const goTo = useCallback((key) => {
    const el = document.getElementById(`s-${key}`)
    if (!el) return
    const stickyHeight = show3D ? window.innerHeight * 0.45 : 6;
    if (isLg) {
      const col = scrollRef.current
      if (col) {
        const absoluteTop = col.scrollTop + el.getBoundingClientRect().top - col.getBoundingClientRect().top - stickyHeight - 20
        col.scrollTo({ top: absoluteTop, behavior: 'smooth' })
      }
    } else {
      const absoluteTop = window.scrollY + el.getBoundingClientRect().top - stickyHeight - 20
      window.scrollTo({ top: absoluteTop, behavior: 'smooth' })
    }
  }, [isLg, show3D])

  const onNavigate = useCallback(d => {
    const nextIdx = d === 'next' ? Math.min(SECTIONS.length - 1, secIdx + 1) : Math.max(0, secIdx - 1)
    if (nextIdx !== secIdx) {
      goTo(SECTIONS[nextIdx].key)
    }
  }, [secIdx, goTo])

  // ── Shared 3D props ──────────────────────────────────────────────────────
  const sceneProps = {
    gestureState, activeSection: sec.key, sectionIndex: secIdx,
    handPosition: handPos, headPosition: headPos, isMobile: !isLg,
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <>
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}

      {/* ──────────────────────────────────────────────────────────────────
          MOBILE-FIRST LAYOUT (< 1024px)
          
          Architecture:
          1. Hero section with name (solid bg, no 3D overlap)
          2. 3D canvas — dedicated visible block, no content overlap
          3. Section cards — solid backgrounds, zero transparency
          4. Fixed: gesture btn (top-right), progress dots (right)
      ────────────────────────────────────────────────────────────────── */}
      {!isLg && (
        <div style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.8s ease',
        }}>

          {/* FIXED: gesture button + progress dots */}
          <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 200 }}>
            <GestureBtn on={gesture} toggle={() => setGesture(g => !g)} accent={accent} />
          </div>
          <div style={{
            position: 'fixed', right: 8, top: '50%', transform: 'translateY(-50%)',
            display: 'flex', flexDirection: 'column', gap: 8,
            zIndex: 200, pointerEvents: 'none',
          }}>
            {SECTIONS.map((s, i) => (
              <div key={s.key} style={{
                width: i === secIdx ? 7 : 4,
                height: i === secIdx ? 7 : 4,
                borderRadius: '50%',
                background: i === secIdx ? accent : colors.neutral[700],
                boxShadow: i === secIdx ? `0 0 6px ${accent}` : 'none',
                transition: 'all 0.3s',
              }} />
            ))}
          </div>

          {/* FIXED: 3D canvas pinned at top, high z-index, solid background so content hides beneath */}
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0,
            height: show3D ? '45vh' : '6px',
            zIndex: 150, // Higher than content zIndex: 60
            background: 'var(--c-bg)',
            borderBottom: '1px solid rgba(155,168,171,0.06)',
            pointerEvents: 'none',
            overflow: 'hidden',
            transition: 'height 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}>
            {/* Figure label overlay */}
            <div style={{
              position: 'absolute', bottom: 12, left: 16,
              fontFamily: typography.fontMono, fontSize: '9px',
              color: accent, letterSpacing: '0.25em', textTransform: 'uppercase',
              opacity: 0.7,
              zIndex: 4
            }}>
              [ {sec.figure} ]
            </div>
            {/* 3D System */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
              <SceneCanvas {...sceneProps} />
            </div>
            {/* Bottom fade */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 32,
              background: 'linear-gradient(to top, var(--c-bg), transparent)',
              zIndex: 3
            }} />
          </div>

          {/* SCROLLABLE CONTENT — scrolls beneath the 3D particles */}
          <div style={{ 
            paddingTop: show3D ? '45vh' : '6px',
            transition: 'padding-top 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            {/* Hero intro */}
            <header style={{
              padding: '28px 24px 24px',
              background: 'var(--c-bg)',
              position: 'relative',
              zIndex: 60,
            }}>
              <div style={{
                fontFamily: typography.fontMono, fontSize: '10px', fontWeight: 600,
                letterSpacing: '0.25em', color: accent,
                marginBottom: 10, textTransform: 'uppercase', opacity: 0.6,
              }}>
                &gt; data_engineer
              </div>
              <h1 style={{
                fontFamily: typography.fontSans, fontWeight: 900, fontSize: '40px',
                lineHeight: 1, letterSpacing: '-0.04em', color: colors.neutral[50],
                marginBottom: 10,
              }}>
                Karthik NP
              </h1>
              <div style={{
                fontFamily: typography.fontMono, fontSize: '12px',
                display: 'flex', alignItems: 'center', gap: 6,
                color: colors.neutral[300], marginBottom: 14,
              }}>
                <span style={{ color: accent }}>~$</span>
                <ScrambleText text={ROLES[roleIdx]} speed={35} />
              </div>
              <p style={{
                fontFamily: typography.fontSans, fontSize: '14px', lineHeight: 1.7,
                color: colors.neutral[400], maxWidth: '360px',
              }}>
                Building high-performance data pipelines on Databricks using PySpark, Kafka & MongoDB.
              </p>
            </header>

            {/* Section cards */}
            <main style={{
              padding: '16px 16px 80px',
              background: 'var(--c-bg)',
              position: 'relative',
              zIndex: 60,
            }}>
              {SECTIONS.map((s, i) => {
                const P = PANELS[s.key]
                const c = sectionColors[s.key]
                if (!P) return null
                return (
                  <section key={s.key} id={`s-${s.key}`} data-idx={i}
                    style={{ marginBottom: i < SECTIONS.length - 1 ? 28 : 0 }}>
                    <SectionLabel label={s.label} color={c.primary} />
                    <div className="section-card">
                      <P onClose={() => {}} />
                    </div>
                  </section>
                )
              })}
            </main>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────
          DESKTOP LAYOUT (≥ 1024px)
          
          Architecture:
          ┌──────────────────┬──────────────────────────────────────────┐
          │  LEFT (sticky)   │  RIGHT (scrolls)                       │
          │  ─ Name          │  ─ 3D Canvas (dedicated section)       │
          │  ─ Role          │  ─ Section cards                       │
          │  ─ Nav links     │                                        │
          │  ─ Gesture       │                                        │
          └──────────────────┴──────────────────────────────────────────┘
          
          3D is the FIRST section in the right column — fully visible,
          no overlap, no transparency hacks.
      ────────────────────────────────────────────────────────────────── */}
      {isLg && (
        <div style={{
          position: 'fixed', inset: 0,
          display: 'flex',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.8s ease',
          zIndex: 1,
        }}>

          {/* LEFT — sticky info panel */}
          <aside style={{
            width: '40%',
            maxWidth: 480,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '72px 48px 56px 72px',
            background: 'var(--c-bg)',
            borderRight: '1px solid rgba(155,168,171,0.06)',
            position: 'relative',
            zIndex: 2,
          }}>
            {/* Top: intro */}
            <div>
              <div style={{
                fontFamily: typography.fontMono, fontSize: '10px', fontWeight: 600,
                letterSpacing: '0.3em', color: accent,
                marginBottom: 16, textTransform: 'uppercase', opacity: 0.6,
              }}>
                &gt; data_engineer
              </div>
              <h1 style={{
                fontFamily: typography.fontSans, fontWeight: 900, fontSize: '48px',
                lineHeight: 1, letterSpacing: '-0.04em', color: colors.neutral[50],
                marginBottom: 16,
              }}>
                Karthik<br />NP
              </h1>
              <div style={{
                fontFamily: typography.fontMono, fontSize: '13px',
                color: colors.neutral[300], marginBottom: 20,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ color: accent }}>~$</span>
                <ScrambleText text={ROLES[roleIdx]} speed={35} />
              </div>
              <p style={{
                fontFamily: typography.fontSans, fontSize: '14px', lineHeight: 1.75,
                color: colors.neutral[500], maxWidth: '280px',
              }}>
                Building high-performance data pipelines on Databricks using PySpark, Kafka & MongoDB.
              </p>
            </div>

            {/* Bottom: nav + gesture */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <nav>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {SECTIONS.map((s, i) => {
                    const active = i === secIdx
                    return (
                      <li key={s.key}>
                        <a
                          href={`#s-${s.key}`}
                          onClick={e => { e.preventDefault(); goTo(s.key) }}
                          style={{
                            textDecoration: 'none', display: 'flex',
                            alignItems: 'center', gap: 12, cursor: 'pointer',
                          }}
                        >
                          <span style={{
                            display: 'block',
                            width: active ? 44 : 20, height: 1,
                            background: active ? accent : colors.neutral[700],
                            transition: 'all 0.3s ease', flexShrink: 0,
                          }} />
                          <span style={{
                            fontFamily: typography.fontMono, fontSize: '11px',
                            letterSpacing: '0.12em', textTransform: 'uppercase',
                            fontWeight: active ? 700 : 400,
                            color: active ? accent : colors.neutral[600],
                            transition: 'all 0.3s ease',
                          }}>
                            {s.label}
                          </span>
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </nav>
              <GestureBtn on={gesture} toggle={() => setGesture(g => !g)} accent={accent} />
            </div>
          </aside>

          {/* RIGHT — scrollable, 3D is sticky at top */}
          <main
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              height: '100vh',
              scrollbarWidth: 'thin',
              scrollbarColor: `${colors.neutral[700]} transparent`,
              background: 'var(--c-bg)',
            }}
          >
            {/* 3D CANVAS — sticky, stays pinned at top while cards scroll beneath it */}
            <div style={{
              position: 'sticky',
              top: 0,
              width: '100%',
              height: show3D ? '45vh' : '6px',
              transition: 'height 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              overflow: 'hidden',
              zIndex: 10, // Higher than cards (zIndex: 2)
              background: 'var(--c-bg)', // Solid background to hide cards when scrolling under
              borderBottom: '1px solid rgba(155,168,171,0.06)',
            }}>
              {/* Figure label overlay */}
              <div style={{
                position: 'absolute', bottom: 16, left: 24,
                fontFamily: typography.fontMono, fontSize: '10px',
                color: accent, letterSpacing: '0.3em', textTransform: 'uppercase',
                opacity: 0.7,
                zIndex: 4
              }}>
                [ {sec.figure} ]
              </div>
              {/* 3D System */}
              <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
                <SceneCanvas {...sceneProps} />
              </div>
              {/* Bottom fade */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: 48,
                background: 'linear-gradient(to top, var(--c-bg), transparent)',
                pointerEvents: 'none',
                zIndex: 3
              }} />
            </div>

            {/* Section cards scroll over the sticky 3D */}
            <div style={{
              padding: '32px 48px 120px',
              position: 'relative',
              zIndex: 2,
              background: 'var(--c-bg)',
            }}>
              {SECTIONS.map((s, i) => {
                const P = PANELS[s.key]
                const c = sectionColors[s.key]
                if (!P) return null
                return (
                  <section key={s.key} id={`s-${s.key}`} data-idx={i}
                    style={{ marginBottom: i < SECTIONS.length - 1 ? 56 : 0 }}>
                    <SectionLabel label={s.label} color={c.primary} />
                    <div className="section-card">
                      <P onClose={() => {}} />
                    </div>
                  </section>
                )
              })}
              <div style={{ height: '15vh' }} />
            </div>
          </main>
        </div>
      )}



      {/* 3D TOGGLE BUTTON (Global floating in right corner on Desktop, FAB on Bottom Right on Mobile) */}
      <button 
        onClick={() => setShow3D(!show3D)}
        style={{
          position: 'fixed', 
          top: isLg ? 24 : 'auto', 
          bottom: isLg ? 'auto' : 24,
          right: 24, zIndex: 999,
          width: 44, height: 44, borderRadius: '50%',
          background: 'rgba(11, 30, 43, 0.8)', backdropFilter: 'blur(8px)',
          border: `1px solid ${colors.neutral[700]}60`, color: colors.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          transition: 'all 0.4s var(--ease)',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.borderColor = colors.accent }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = `${colors.neutral[700]}60` }}
        title={show3D ? "Minimize Pipeline" : "Expand Pipeline"}
      >
        {show3D ? (
          // TARGET: Minimize to Pipeline (Horizontal Tube with Data Packets)
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 7h20"></path>
            <path d="M2 17h20"></path>
            <rect x="6" y="10" width="4" height="4" rx="1" fill="currentColor"></rect>
            <rect x="14" y="10" width="4" height="4" rx="1" fill="currentColor"></rect>
          </svg>
        ) : (
          // TARGET: Expand to 3D System (Isometric Volumetric Cube)
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon>
            <polyline points="2 8.5 12 15.5 22 8.5"></polyline>
            <polyline points="12 22 12 15.5"></polyline>
          </svg>
        )}
      </button>

      {/* Gesture overlay */}
      <GestureOverlay
        enabled={gesture}
        onToggle={() => setGesture(p => !p)}
        onGesture={onGesture}
        onNavigate={onNavigate}
        onHandPosition={onHandPos}
        onHeadPosition={onHeadPos}
      />
    </>
  )
}
