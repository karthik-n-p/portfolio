import { skills } from '../data/karthik.js'
import { panelStyle, headerStyle, labelStyle, closeStyle } from './HubPanel.jsx'
import { colors, typography } from '../design-tokens.js'
import ScrambleText from './ScrambleText.jsx'

/**
 * SkillsPanel — Skills as distributed stream clusters
 */
export default function SkillsPanel({ onClose }) {
  return (
    <div className="panel-animate" style={panelStyle}>
      <div style={headerStyle}>
        <span style={labelStyle}>
           <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors.neutral[100], boxShadow: `0 0 8px ${colors.neutral[100]}90` }} />
           <ScrambleText text="TECH INTEGRATIONS" speed={30} delay={100} />
        </span>
        <button
          onClick={onClose}
          style={closeStyle}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = colors.neutral[100]; }}
          onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = colors.neutral[300]; }}
        >✕</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {skills.map((group) => (
          <div key={group.id}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
            }}>
              <div style={{
                width: '12px', height: '12px',
                borderRadius: '50%',
                background: group.color,
                boxShadow: `0 0 8px ${group.color}80`,
                flexShrink: 0,
              }} />
              <span style={{
                fontFamily: typography.fontSans,
                fontSize: '14px',
                fontWeight: 600,
                color: group.color,
                letterSpacing: '0.05em',
              }}>
                {group.category}
              </span>
              <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${group.color}40, transparent)` }} />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '12px',
            }}>
              {group.items.map(item => (
                <div key={item} className="card" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px 12px',
                  fontFamily: typography.fontSans,
                  fontSize: '13px',
                  fontWeight: 500,
                  color: colors.neutral[100],
                  cursor: 'default',
                }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
