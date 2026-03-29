/**
 * Design Tokens — Single source of truth
 * Colors, typography, spacing, motion for UI + Three.js
 */

// ─── COLOR PALETTE ───────────────────────────────────────
export const colors = {
  // Functional accent colors
  accent:    '#0055FF',  // Electric Azure — primary interaction point

  // Neutral scale (dark to light) - Obsidian to Stark Titanium
  neutral: {
    950: '#050505',  // deepest obsidian background
    900: '#0A0A0A',  // surface background
    850: '#111111',  // elevated surface
    800: '#161616',  // card background
    700: '#242424',  // border strong
    600: '#333333',  // border subtle
    500: '#52525B',  // text dim
    400: '#71717A',  // text muted
    300: '#A1A1AA',  // text secondary
    200: '#D4D4D8',  // text primary
    100: '#E2E8F0',  // text bright (Titanium)
    50:  '#F8F9FA',  // text max
  },

  // Section nav colors (maps to activeNode keys)
  section: {
    hub:       '#E2E8F0',
    pipeline:  '#E2E8F0',
    projects:  '#E2E8F0',
    skills:    '#E2E8F0',
    certs:     '#E2E8F0',
    education: '#E2E8F0',
    connect:   '#E2E8F0', // Matched with others
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
    background: 'rgba(10, 10, 15, 0.6)',
    border: `1px solid rgba(255, 255, 255, 0.05)`,
    borderRadius: '20px',
    backdropFilter: 'blur(32px)',
    shadow: '0 32px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
    padding: '32px',
    maxWidth: '560px',
    width: '90vw',
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
  background:    0x050505,
  accent:        0x0055FF, // Azure
  gridLine:      0x111111,
  gridDot:       0x1A1A1A,
  gridAccent:    0x0044CC, // Less intense Azure

  section: {
    hub:       0x444444,
    pipeline:  0x444444,
    projects:  0x444444,
    skills:    0x444444,
    certs:     0x444444,
    education: 0x444444,
    connect:   0x444444,
  },
}
