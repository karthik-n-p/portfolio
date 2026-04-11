/**
 * Design Tokens — Single source of truth
 * Colors, typography, spacing, motion for UI + Three.js
 *
 * Fonts: Inter (sans) + JetBrains Mono (mono) — nothing else.
 * Palette: Deep Obsidian neutrals + Electric Azure accent + premium section colors.
 */

// ─── COLOR PALETTE ───────────────────────────────────────
export const colors = {
  accent:    '#9BA8AB',  // Premium slate accent

  // Semantic status colors
  emerald:   '#34D399',  
  amber:     '#FBBF24',  
  rose:      '#FB7185',  

  // Premium Slate/Blue scale based on provided image
  neutral: {
    950: '#06141B', // Darkest background
    900: '#0B1A23',
    850: '#11212D', // Deep surface
    800: '#182C39',
    700: '#253745', // Elevated surface/borders
    600: '#374958',
    500: '#4A5C6A', // Muted text/icons
    400: '#72828B',
    300: '#9BA8AB', // Secondary text
    200: '#B4BFBF',
    100: '#CCD0CF', // Lightest text
    50:  '#E6EBED',
  },
}

// ─── PREMIUM SECTION COLOR PALETTE ──────────────────────
// Applying the premium primary/secondary palette consistently across all sections
export const sectionColors = {
  hero:      { primary: '#CCD0CF', secondary: '#9BA8AB', glow: '#4A5C6A' },
  hub:       { primary: '#CCD0CF', secondary: '#9BA8AB', glow: '#4A5C6A' },
  pipeline:  { primary: '#CCD0CF', secondary: '#9BA8AB', glow: '#4A5C6A' },
  skills:    { primary: '#CCD0CF', secondary: '#9BA8AB', glow: '#4A5C6A' },
  projects:  { primary: '#CCD0CF', secondary: '#9BA8AB', glow: '#4A5C6A' },
  certs:     { primary: '#CCD0CF', secondary: '#9BA8AB', glow: '#4A5C6A' },
  education: { primary: '#CCD0CF', secondary: '#9BA8AB', glow: '#4A5C6A' },
  connect:   { primary: '#CCD0CF', secondary: '#9BA8AB', glow: '#4A5C6A' },
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
  background:    0x06141B,
  accent:        0x9BA8AB,
  gridLine:      0x11212D,
  gridDot:       0x182C39,
  gridAccent:    0x4A5C6A,
}

// ─── THREE.JS SECTION COLORS (hex integers for Three.js) ─
export const threeSectionColors = {
  hero:      { primary: 0xCCD0CF, secondary: 0x9BA8AB, dim: 0x4A5C6A },
  hub:       { primary: 0xCCD0CF, secondary: 0x9BA8AB, dim: 0x4A5C6A },
  pipeline:  { primary: 0xCCD0CF, secondary: 0x9BA8AB, dim: 0x4A5C6A },
  skills:    { primary: 0xCCD0CF, secondary: 0x9BA8AB, dim: 0x4A5C6A },
  projects:  { primary: 0xCCD0CF, secondary: 0x9BA8AB, dim: 0x4A5C6A },
  certs:     { primary: 0xCCD0CF, secondary: 0x9BA8AB, dim: 0x4A5C6A },
  education: { primary: 0xCCD0CF, secondary: 0x9BA8AB, dim: 0x4A5C6A },
  connect:   { primary: 0xCCD0CF, secondary: 0x9BA8AB, dim: 0x4A5C6A },
}
