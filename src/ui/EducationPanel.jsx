import { education } from '../data/karthik.js'
import { panelStyle, headerStyle, labelStyle, closeStyle } from './HubPanel.jsx'
import { colors, sectionColors, typography } from '../design-tokens.js'
import ScrambleText from './ScrambleText.jsx'

/**
 * EducationPanel — Education as data lineage records
 */
export default function EducationPanel({ onClose }) {
  const theme = sectionColors.education

  return (
    <div className="panel-animate" style={panelStyle}>
      <div style={headerStyle}>
        <span style={labelStyle}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: theme.primary, boxShadow: `0 0 8px ${theme.primary}90` }} />
          <ScrambleText text="ACADEMIC LINEAGE" speed={30} delay={100} />
        </span>
        <button
          onClick={onClose}
          style={closeStyle}
          onMouseOver={e => { e.currentTarget.style.background = `${theme.primary}22`; e.currentTarget.style.color = theme.secondary; e.currentTarget.style.borderColor = `${theme.primary}55`; }}
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
              color: theme.primary,
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
                border: `1px solid ${theme.primary}40`,
                borderRadius: '6px',
                color: theme.primary,
                background: `${theme.primary}15`,
                fontWeight: 500,
              }}>
                {edu.score}
              </span>
              <span className="chip" style={{ borderColor: `${theme.secondary}35`, background: `${theme.secondary}12`, color: colors.neutral[200] }}>
                📍 {edu.location}
              </span>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}
