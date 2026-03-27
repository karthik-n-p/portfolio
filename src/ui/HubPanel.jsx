import { profile } from '../data/karthik.js'
import { colors, typography, motion } from '../design-tokens.js'

/**
 * HubPanel — Central node panel: name, title, contact, summary
 */
export default function HubPanel({ onClose }) {
  return (
    <div className="panel-animate" style={panelStyle}>
      <div style={headerStyle}>
        <span style={labelStyle}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors.accent, boxShadow: `0 0 8px ${colors.accent}90` }} />
          CENTRAL HUB
        </span>
        <button
          onClick={onClose}
          style={closeStyle}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = colors.neutral[100]; }}
          onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = colors.neutral[300]; }}
        >
          ✕
        </button>
      </div>

      <div style={{
        fontFamily: typography.fontSans,
        fontSize: '14px',
        color: colors.neutral[300],
        lineHeight: 1.7,
        marginBottom: '32px',
        maxWidth: '460px',
        borderLeft: `2px solid ${colors.accent}60`,
        paddingLeft: '16px',
        background: `linear-gradient(90deg, ${colors.accent}08 0%, transparent 100%)`,
        padding: '12px 12px 12px 16px',
        borderRadius: '0 6px 6px 0'
      }}>
        {profile.summary}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={sectionLabel}>Contact Links</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          {[
            { key: 'Email', value: profile.contact.email, href: `mailto:${profile.contact.email}`, icon: '✉' },
            { key: 'LinkedIn', value: profile.contact.linkedin, href: `https://linkedin.com/in/${profile.contact.linkedin}`, icon: 'in' },
            { key: 'GitHub', value: profile.contact.github, href: `https://${profile.contact.github}`, icon: '⬡' },
          ].map(({ key, value, href, icon }) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontFamily: typography.fontSans,
                fontSize: '13px',
                color: colors.neutral[100],
                textDecoration: 'none',
                padding: '10px 14px',
              }}
            >
              <span style={{ color: colors.accent, width: '20px', textAlign: 'center', fontSize: '14px' }}>{icon}</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: colors.neutral[300], fontSize: '11px', marginBottom: '2px' }}>{key}</span>
                <span style={{ fontFamily: typography.fontMono, fontSize: '11px' }}>{value}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

/* Shared panel styles — imported by all panels */
export const panelStyle = {
  position: 'relative',
  padding: '32px',
  border: `1px solid ${colors.neutral[700]}60`,
  borderRadius: '16px',
  background: 'rgba(14,14,20,0.88)',
  backdropFilter: 'blur(24px)',
  boxShadow: '0 24px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
  maxWidth: '560px',
  width: '90vw',
  maxHeight: '85vh',
  overflowY: 'auto',
  scrollbarWidth: 'thin',
  scrollbarColor: 'rgba(255,255,255,0.1) transparent',
}

export const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '28px',
}

export const labelStyle = {
  fontFamily: typography.fontSans,
  fontSize: '11px',
  fontWeight: 600,
  color: colors.neutral[300],
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  display: 'flex',
  alignItems: 'center',
  gap: '10px'
}

export const sectionLabel = {
  fontFamily: typography.fontSans,
  fontSize: '11px',
  fontWeight: 600,
  color: colors.neutral[300],
  letterSpacing: '0.08em',
  marginBottom: '14px',
  textTransform: 'uppercase',
}

export const closeStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: colors.neutral[300],
  cursor: 'pointer',
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  fontSize: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: `all ${motion.base}`,
}
