import { skills } from '../data/karthik.js'
import { panelStyle, headerStyle, labelStyle, closeStyle } from './HubPanel.jsx'
import { colors, sectionColors, typography } from '../design-tokens.js'
import ScrambleText from './ScrambleText.jsx'

/**
 * SkillsPanel — Skills as distributed stream clusters
 */
export default function SkillsPanel({ onClose }) {
  const theme = sectionColors.skills

  return (
    <div className="panel-animate" style={panelStyle}>
      <div style={headerStyle}>
        <span style={labelStyle}>
           <div style={{ width: 6, height: 6, borderRadius: '50%', background: theme.primary, boxShadow: `0 0 8px ${theme.primary}90` }} />
           <ScrambleText text="TECH INTEGRATIONS" speed={30} delay={100} />
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {skills.map((group, index) => {
          const activeColor = [colors.neutral[100], colors.neutral[200], theme.primary][index % 3];
          return (
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
                background: activeColor,
                boxShadow: `0 0 8px ${activeColor}80`,
                flexShrink: 0,
              }} />
              <span style={{
                fontFamily: typography.fontSans,
                fontSize: '14px',
                fontWeight: 700,
                color: colors.neutral[100],
                letterSpacing: '0.05em',
              }}>
                {group.category}
              </span>
              <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${activeColor}40, transparent)` }} />
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
                  borderColor: `${activeColor}40`,
                  background: `linear-gradient(180deg, ${activeColor}14, rgba(255,255,255,0.02))`,
                  cursor: 'default',
                }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
          )
        })}
      </div>
    </div>
  )
}
