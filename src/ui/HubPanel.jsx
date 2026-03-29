import { profile } from '../data/karthik.js'
import { colors, typography } from '../design-tokens.js'

/**
 * HubPanel — Central hub: name, title, summary, contact links
 * Also exports shared panel style objects used by all panels.
 */
export default function HubPanel() {
  return (
    <div className="panel-animate" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="stagger-item stagger-1" style={{
        fontFamily: typography.fontSans,
        fontSize: '14px',
        color: colors.neutral[300],
        lineHeight: 1.7,
        maxWidth: '460px',
        borderLeft: `2px solid ${colors.accent}50`,
        paddingLeft: '16px',
      }}>
        {profile.summary}
      </div>

      <div className="stagger-item stagger-2" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={sectionLabel}>Contact Links</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
          {[
            { key: 'Email', value: profile.contact.email, href: `mailto:${profile.contact.email}`, icon: '✉' },
            { key: 'LinkedIn', value: profile.contact.linkedin, href: `https://linkedin.com/in/${profile.contact.linkedin}`, icon: 'in' },
            { key: 'GitHub', value: profile.contact.github, href: `https://${profile.contact.github}`, icon: '⬡' },
          ].map(({ key, value, href, icon }) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="card"
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                fontFamily: typography.fontSans, fontSize: '13px',
                color: colors.neutral[100], textDecoration: 'none',
                padding: '10px 14px',
              }}
            >
              <span style={{ color: colors.accent, width: '20px', textAlign: 'center', fontSize: '14px' }}>{icon}</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: colors.neutral[400], fontSize: '10px', marginBottom: '2px', letterSpacing: '0.05em' }}>{key}</span>
                <span style={{ fontFamily: typography.fontMono, fontSize: '11px' }}>{value}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── SHARED PANEL STYLE EXPORTS ─────────────────────────
// Used by all section panels for consistent styling

export const panelStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
}

export const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '4px',
}

export const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontFamily: typography.fontMono,
  fontSize: '10px',
  fontWeight: 600,
  letterSpacing: '0.12em',
  color: colors.neutral[300],
  textTransform: 'uppercase',
}

export const closeStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  borderRadius: '6px',
  border: `1px solid rgba(255,255,255,0.06)`,
  background: 'rgba(255,255,255,0.03)',
  color: colors.neutral[300],
  fontSize: '11px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
}

export const sectionLabel = {
  fontFamily: typography.fontSans,
  fontSize: '10px',
  fontWeight: 600,
  color: colors.neutral[400],
  letterSpacing: '0.1em',
  marginBottom: '10px',
  textTransform: 'uppercase',
}
