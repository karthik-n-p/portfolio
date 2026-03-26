import { education } from '../data/karthik.js'
import { panelStyle, headerStyle, labelStyle, closeStyle } from './HubPanel.jsx'
import { colors, typography } from '../design-tokens.js'

/**
 * EducationPanel — Education as data lineage records
 */
export default function EducationPanel({ onClose }) {
  return (
    <div className="panel-animate" style={panelStyle}>
      <div style={headerStyle}>
        <span style={labelStyle}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors.accent, boxShadow: `0 0 8px ${colors.accent}90` }} />
          ACADEMIC LINEAGE
        </span>
        <button
          onClick={onClose}
          style={closeStyle}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = colors.neutral[100]; }}
          onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = colors.neutral[300]; }}
        >✕</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {education.map((edu, i) => (
          <div key={edu.id} className="card" style={{
            position: 'relative',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '10px',
              flexWrap: 'wrap',
              gap: '8px',
            }}>
              <span style={{
                fontFamily: typography.fontSans,
                fontSize: '15px',
                color: colors.neutral[100],
                fontWeight: 600,
                letterSpacing: '-0.01em',
              }}>
                {edu.degree}
              </span>
              <span style={{
                fontFamily: typography.fontMono,
                fontSize: '11px',
                color: colors.neutral[300],
                whiteSpace: 'nowrap',
                fontWeight: 500,
              }}>
                {edu.period}
              </span>
            </div>

            <div style={{
              fontFamily: typography.fontSans,
              fontSize: '13px',
              color: colors.accent,
              fontWeight: 500,
              marginBottom: '16px',
            }}>
              {edu.institution}
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: typography.fontMono,
                fontSize: '11px',
                padding: '4px 10px',
                border: `1px solid ${colors.accent}40`,
                borderRadius: '6px',
                color: colors.accent,
                background: `${colors.accent}15`,
                fontWeight: 500,
              }}>
                {edu.score}
              </span>
              <span className="chip">
                📍 {edu.location}
              </span>
            </div>

            {/* Record indicator */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              fontFamily: typography.fontMono,
              fontSize: '9px',
              color: 'rgba(255,255,255,0.2)',
              letterSpacing: '0.1em',
            }}>
              record_{String(i + 1).padStart(2, '0')}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
