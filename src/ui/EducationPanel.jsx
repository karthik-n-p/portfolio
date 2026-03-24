import { education } from '../data/karthik.js'
import { panelStyle, headerStyle, labelStyle, closeStyle } from './HubPanel.jsx'

/**
 * EducationPanel — Education as data lineage records
 */
export default function EducationPanel({ onClose }) {
  return (
    <div className="panel-animate" style={panelStyle}>
      <div style={headerStyle}>
        <span style={labelStyle}>[ LINEAGE: EDUCATION ]</span>
        <button onClick={onClose} style={closeStyle}>✕</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {education.map((edu, i) => (
          <div key={edu.id} style={{
            padding: '16px',
            border: '1px solid rgba(232,121,249,0.2)',
            borderRadius: '6px',
            background: 'rgba(232,121,249,0.04)',
            position: 'relative',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '8px',
              flexWrap: 'wrap',
              gap: '8px',
            }}>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px',
                color: '#e879f9',
                fontWeight: 600,
                textShadow: '0 0 10px rgba(232,121,249,0.4)',
              }}>
                {edu.degree}
              </span>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '9px',
                color: '#3d6b7a',
                whiteSpace: 'nowrap',
              }}>
                {edu.period}
              </span>
            </div>

            <div style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              color: '#7ab3cc',
              marginBottom: '8px',
            }}>
              {edu.institution}
            </div>

            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
            }}>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '9px',
                padding: '2px 8px',
                border: '1px solid rgba(232,121,249,0.25)',
                borderRadius: '2px',
                color: '#e879f9',
                background: 'rgba(232,121,249,0.08)',
              }}>
                {edu.score}
              </span>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '9px',
                padding: '2px 8px',
                border: '1px solid rgba(61,107,122,0.4)',
                borderRadius: '2px',
                color: '#3d6b7a',
              }}>
                📍 {edu.location}
              </span>
            </div>

            {/* Record indicator */}
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '8px',
              color: '#3d6b7a',
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
