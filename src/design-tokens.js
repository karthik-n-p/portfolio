/**
 * Design Tokens — Single source of truth
 * Colors, typography, spacing, motion for UI + Three.js
 */

// ─── COLOR PALETTE ───────────────────────────────────────
export const colors = {
  // Functional accent colors
  accent:    '#6366F1',  // indigo — primary
  emerald:   '#34D399',  // live/success/connect
  violet:    '#8B5CF6',  // secondary emphasis
  amber:     '#FBBF24',  // highlights/awards
  rose:      '#FB7185',  // certs/alerts

  // Neutral scale (dark to light)
  neutral: {
    950: '#0A0A0F',  // deepest background
    900: '#111118',  // surface background
    850: '#18181F',  // elevated surface
    800: '#1E1E26',  // card background
    700: '#2A2A35',  // border strong
    600: '#3A3A48',  // border subtle
    500: '#52525B',  // text dim
    400: '#71717A',  // text muted
    300: '#A1A1AA',  // text secondary
    200: '#D4D4D8',  // text primary
    100: '#EDEDED',  // text bright
    50:  '#F4F4F5',  // text max
  },

  // Section nav colors (maps to activeNode keys)
  section: {
    hub:       '#6366F1',
    pipeline:  '#34D399',
    projects:  '#8B5CF6',
    skills:    '#FBBF24',
    certs:     '#FB7185',
    education: '#6366F1',
    connect:   '#34D399',
  },
}

// ─── TYPOGRAPHY ──────────────────────────────────────────
export const typography = {
  fontSans:  "'Inter', sans-serif",
  fontMono:  "'JetBrains Mono', monospace",

  // Modular scale (ratio ~1.25)
  display:  { size: '64px', weight: 800, tracking: '-0.04em', leading: 1.0 },
  hero:     { size: '40px', weight: 700, tracking: '-0.03em', leading: 1.1 },
  h1:       { size: '32px', weight: 700, tracking: '-0.02em', leading: 1.15 },
  h2:       { size: '24px', weight: 700, tracking: '-0.02em', leading: 1.2 },
  h3:       { size: '18px', weight: 600, tracking: '-0.01em', leading: 1.3 },
  body:     { size: '14px', weight: 400, tracking: '0',       leading: 1.7 },
  caption:  { size: '11px', weight: 600, tracking: '0.08em',  leading: 1.4 },
  micro:    { size: '10px', weight: 500, tracking: '0.1em',   leading: 1.3 },
}

// ─── SPACING (8px grid) ─────────────────────────────────
export const spacing = {
  xs:   '4px',
  sm:   '8px',
  md:   '12px',
  base: '16px',
  lg:   '24px',
  xl:   '32px',
  '2xl':'48px',
  '3xl':'64px',
}

// ─── MOTION ─────────────────────────────────────────────
export const motion = {
  fast:    '0.15s cubic-bezier(0.16, 1, 0.3, 1)',
  base:    '0.25s cubic-bezier(0.16, 1, 0.3, 1)',
  smooth:  '0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  morph:   '1.2s cubic-bezier(0.22, 1, 0.36, 1)',  // DataFlowField formation transitions
}

// ─── COMPONENT PRESETS ──────────────────────────────────
export const components = {
  panel: {
    background: 'rgba(14, 14, 20, 0.88)',
    border: `1px solid ${colors.neutral[700]}`,
    borderRadius: '16px',
    backdropFilter: 'blur(24px)',
    shadow: '0 24px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
    padding: '32px',
    maxWidth: '560px',
  },
  card: {
    background: 'rgba(255,255,255,0.02)',
    border: `1px solid ${colors.neutral[700]}30`,
    borderRadius: '12px',
    padding: '20px',
  },
  chip: {
    background: 'rgba(255,255,255,0.03)',
    border: `1px solid ${colors.neutral[700]}40`,
    borderRadius: '6px',
    padding: '6px 10px',
    fontSize: typography.caption.size,
    fontWeight: typography.caption.weight,
  },
  navButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: typography.caption.size,
    fontWeight: 600,
    letterSpacing: '0.05em',
  },
}

// ─── THREE.JS COLORS (hex integers for materials) ──────
export const threeColors = {
  background:    0x0A0A0F,
  accent:        0x6366F1,
  emerald:       0x34D399,
  violet:        0x8B5CF6,
  amber:         0xFBBF24,
  rose:          0xFB7185,
  gridLine:      0x1A1A2E,
  gridDot:       0x2A2A4A,
  gridAccent:    0x3A3A48,

  section: {
    hub:       0x6366F1,
    pipeline:  0x34D399,
    projects:  0x8B5CF6,
    skills:    0xFBBF24,
    certs:     0xFB7185,
    education: 0x6366F1,
    connect:   0x34D399,
  },
}
