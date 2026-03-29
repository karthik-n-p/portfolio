/**
 * Design Tokens — Single source of truth
 * Colors, typography, spacing, motion for UI + Three.js
 *
 * Fonts: Inter (sans) + JetBrains Mono (mono) — nothing else.
 * Palette: Deep Obsidian neutrals + Electric Azure accent + premium section colors.
 */

// ─── COLOR PALETTE ───────────────────────────────────────
export const colors = {
  accent:    '#0055FF',  // Electric Azure — primary interaction color

  // Semantic status colors
  emerald:   '#34D399',  // Success / active
  amber:     '#FBBF24',  // Warning / caution
  rose:      '#FB7185',  // Error / destructive

  // Neutral scale (dark → light): Obsidian → Titanium
  neutral: {
    950: '#050508',
    900: '#0A0A10',
    850: '#101018',
    800: '#16161E',
    700: '#22222E',
    600: '#333340',
    500: '#52525B',
    400: '#71717A',
    300: '#A1A1AA',
    200: '#D4D4D8',
    100: '#E2E8F0',
    50:  '#F8F9FA',
  },
}

// ─── PREMIUM SECTION COLOR PALETTE ──────────────────────
// Each section of the data journey gets a unique premium color
export const sectionColors = {
  hero:      { primary: '#6366F1', secondary: '#818CF8', glow: '#4F46E5' },   // Indigo Nebula
  hub:       { primary: '#0EA5E9', secondary: '#38BDF8', glow: '#0284C7' },   // Cyan Stream
  pipeline:  { primary: '#F59E0B', secondary: '#FCD34D', glow: '#D97706' },   // Amber ETL
  skills:    { primary: '#8B5CF6', secondary: '#A78BFA', glow: '#7C3AED' },   // Violet Warehouse
  projects:  { primary: '#10B981', secondary: '#34D399', glow: '#059669' },   // Emerald DAG
  certs:     { primary: '#F43F5E', secondary: '#FB7185', glow: '#E11D48' },   // Rose Validation
  education: { primary: '#06B6D4', secondary: '#22D3EE', glow: '#0891B2' },   // Teal Foundation
  connect:   { primary: '#EC4899', secondary: '#F472B6', glow: '#DB2777' },   // Pink Output
}

// ─── TYPOGRAPHY ──────────────────────────────────────────
export const typography = {
  fontSans:  "'Inter', sans-serif",
  fontMono:  "'JetBrains Mono', monospace",

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
  morph:   '1.2s cubic-bezier(0.22, 1, 0.36, 1)',
}

// ─── SECTION DATA (scroll-based journey) ────────────────
// Each section gets a narrative label and a brief line
export const SECTIONS = [
  { key: 'hero',      label: 'RAW DATA',          tagline: 'Unstructured. Unrefined. Unlimited potential.', diagram: 'BRONZE: INGEST' },
  { key: 'hub',       label: 'PROFILE',           tagline: 'Core identity and specialized focus areas.', diagram: 'BRONZE → SILVER' },
  { key: 'pipeline',  label: 'EXPERIENCE',        tagline: 'Professional history and corporate impact.', diagram: 'SILVER: CONFORMED' },
  { key: 'skills',    label: 'SKILLS',            tagline: 'Technical toolkit and domain expertise.', diagram: 'DAG ORCHESTRATION' },
  { key: 'projects',  label: 'PROJECTS',          tagline: 'Architecting dynamic data products at scale.', diagram: 'GOLD: AGGREGATED' },
  { key: 'certs',     label: 'CERTIFICATION',     tagline: 'Industry-verified engineering credentials.', diagram: 'DATA GOVERNANCE' },
  { key: 'education', label: 'EDUCATION',         tagline: 'The academic bedrock of this practice.', diagram: 'DATA CATALOG' },
  { key: 'connect',   label: 'CONNECT',           tagline: 'Ready to deliver. Let\'s build together.', diagram: 'SERVING: BI APPS' },
]

// ─── THREE.JS COLORS (hex integers) ────────────────────
export const threeColors = {
  background:    0x050508,
  accent:        0x0055FF,
  gridLine:      0x111118,
  gridDot:       0x1A1A22,
  gridAccent:    0x0044CC,
}

// ─── THREE.JS SECTION COLORS (hex integers for Three.js) ─
export const threeSectionColors = {
  hero:      { primary: 0x6366F1, secondary: 0x818CF8, dim: 0x312E81 },
  hub:       { primary: 0x0EA5E9, secondary: 0x38BDF8, dim: 0x0C4A6E },
  pipeline:  { primary: 0xF59E0B, secondary: 0xFCD34D, dim: 0x78350F },
  skills:    { primary: 0x8B5CF6, secondary: 0xA78BFA, dim: 0x4C1D95 },
  projects:  { primary: 0x10B981, secondary: 0x34D399, dim: 0x064E3B },
  certs:     { primary: 0xF43F5E, secondary: 0xFB7185, dim: 0x881337 },
  education: { primary: 0x06B6D4, secondary: 0x22D3EE, dim: 0x164E63 },
  connect:   { primary: 0xEC4899, secondary: 0xF472B6, dim: 0x831843 },
}
