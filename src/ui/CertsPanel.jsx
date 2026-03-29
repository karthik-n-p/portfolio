import { certifications } from '../data/karthik.js'
import { panelStyle, headerStyle, labelStyle, closeStyle } from './HubPanel.jsx'
import { colors, sectionColors, typography } from '../design-tokens.js'
import ScrambleText from './ScrambleText.jsx'

/**
 * CertsPanel — Certifications as checkpointed nodes
 */
export default function CertsPanel({ onClose }) {
  const theme = sectionColors.certs

  return (
    <div className="panel-animate" style={panelStyle}>
      <div style={headerStyle}>
        <span style={labelStyle}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: theme.primary, boxShadow: `0 0 8px ${theme.primary}90` }} />
          <ScrambleText text="CERTIFICATION CHECKPOINTS" speed={30} delay={100} />
        </span>
        <button
          onClick={onClose}
          style={closeStyle}
          onMouseOver={e => { e.currentTarget.style.background = `${theme.primary}22`; e.currentTarget.style.color = theme.secondary; e.currentTarget.style.borderColor = `${theme.primary}55`; }}
          onMouseOut={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
            e.currentTarget.style.color = colors.neutral[300]
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
          }}
        >✕</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {certifications.map((cert) => (
          <div key={cert.id} className="card" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            position: 'relative',
            overflow: 'hidden',
            borderColor: `${theme.primary}28`,
            background: `linear-gradient(135deg, ${theme.primary}0d 0%, rgba(255,255,255,0.02) 100%)`,
            boxShadow: `inset 0 1px 0 ${theme.primary}14`,
          }}>
            {/* Badge */}
            <div style={{
              width: '56px', height: '56px',
              borderRadius: '12px',
              border: `1px solid ${cert.color}40`,
              background: `linear-gradient(135deg, ${cert.color}15 0%, rgba(255,255,255,0.05) 100%)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: `0 8px 16px ${cert.color}08`
            }}>
              <div style={{
                fontFamily: typography.fontSans,
                fontSize: '10px',
                color: cert.color,
                fontWeight: 700,
                letterSpacing: '0.05em',
                textAlign: 'center',
                lineHeight: 1.2,
              }}>
                MS<br />CERT
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: typography.fontSans,
                fontSize: '14px',
                color: colors.neutral[100],
                fontWeight: 600,
                marginBottom: '6px',
              }}>
                {cert.name}
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: typography.fontMono,
                  fontSize: '10px',
                  padding: '4px 8px',
                  border: `1px solid ${cert.color}30`,
                  borderRadius: '6px',
                  color: cert.color,
                  background: `${cert.color}10`,
                }}>
                  {cert.code}
                </span>
                <span style={{
                  fontFamily: typography.fontSans,
                  fontSize: '11px',
                  color: colors.neutral[300],
                  fontWeight: 500,
                }}>
                  {cert.issuer} Certified
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}
