import { skills } from '../data/karthik.js'
import { panelStyle, headerStyle, labelStyle, closeStyle, sectionLabel } from './HubPanel.jsx'

/**
 * SkillsPanel — Skills as distributed stream clusters
 */
export default function SkillsPanel({ onClose }) {
  return (
    <div className="panel-animate" style={panelStyle}>
      <div style={headerStyle}>
        <span style={labelStyle}>[ CLUSTER: SKILLS ]</span>
        <button onClick={onClose} style={closeStyle}>✕</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {skills.map((group) => (
          <div key={group.id}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
            }}>
              <div style={{
                width: '8px', height: '8px',
                borderRadius: '50%',
                background: group.color,
                boxShadow: `0 0 6px ${group.color}`,
                flexShrink: 0,
              }} />
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '9px',
                color: '#3d6b7a',
                letterSpacing: '0.15em',
              }}>
                cluster/{group.streamId}
              </span>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px',
                color: group.color,
                marginLeft: 'auto',
                textShadow: `0 0 8px ${group.color}80`,
              }}>
                {group.category}
              </span>
            </div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              paddingLeft: '16px',
              borderLeft: `2px solid ${group.color}30`,
            }}>
              {group.items.map(item => (
                <span key={item} style={{
                  display: 'inline-block',
                  padding: '4px 10px',
                  borderRadius: '3px',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '10px',
                  border: `1px solid ${group.color}40`,
                  color: group.color,
                  background: `${group.color}0f`,
                  transition: 'all 0.2s ease',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = `${group.color}25`
                  e.currentTarget.style.boxShadow = `0 0 10px ${group.color}40`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = `${group.color}0f`
                  e.currentTarget.style.boxShadow = 'none'
                }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
