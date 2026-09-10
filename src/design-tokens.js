/**
 * design-tokens.js — Unified Design System Source of Truth
 *
 * Synthesizing best elements from:
 * - Enric Design (architectural framing, terracotta accent, brand mark)
 * - Sanjay Menon (warm luxury linen foundation, hairline borders, refined spacing)
 * - Anmol Maggon (grotesque + italic serif editorial typographic contrast)
 * - Vaibhav Verma (technical DAG flow nodes, live telemetry badges, precision mono)
 * - Askumi (modular bento card rhythm, live clock, status pill)
 * - UX Dularia (subtle grid, clean dividers, breadcrumb indexing)
 * - Jayy (glassmorphic capsule navigation, micro-interactions)
 */

export const colors = {
  // Foundational Canvas & Surfaces
  canvas:       '#FBF9F5', // Organic warm linen background
  surface:      '#FFFFFF', // Elevated crisp white card
  surfaceMuted: '#F3EFE9', // Warm stone inner well
  surfaceDark:  '#141312', // Obsidian black contrast card
  
  // Architectural Borders
  border:       '#E5DFD5', // Hairline divider
  borderSubtle: '#EFEAE1', // Soft inner separator
  borderDark:   '#262422', // Dark card border

  // Text Hierarchy
  text:         '#141312', // Primary near-black
  textSecondary:'#5C574F', // Warm graphite body
  textMuted:    '#8C857B', // Warm sand labels / kickers
  textInverse:  '#FFFFFF', // White text on dark

  // Signature Accent
  accent:       '#E03E2D', // Terracotta vermilion
  accentHover:  '#C93425',
  accentSubtle: 'rgba(224, 62, 45, 0.10)',
  accentGlow:   'rgba(224, 62, 45, 0.22)',

  // Functional Semantic Accents
  emerald:      '#1E3A2F',
  emeraldLight: '#EBF5F0',
  emeraldText:  '#166534',
  amber:        '#B45309',
  amberLight:   '#FEF3C7',
}

export const typography = {
  fontDisplay:  '"Bricolage Grotesque", system-ui, sans-serif',
  fontHeadline: '"Plus Jakarta Sans", system-ui, sans-serif',
  fontBody:     '"Inter", system-ui, sans-serif',
  fontEditorial:'"Playfair Display", Georgia, serif',
  fontMono:     '"JetBrains Mono", monospace',
}

export const radius = {
  card:    '24px',
  inner:   '16px',
  sm:      '12px',
  pill:    '9999px',
}

export const shadows = {
  soft:   '0 4px 20px rgba(20, 19, 18, 0.04)',
  elevated: '0 12px 36px rgba(20, 19, 18, 0.07)',
  capsule: '0 8px 30px rgba(20, 19, 18, 0.08)',
  accent: '0 8px 24px rgba(224, 62, 45, 0.25)',
}
