import { certifications } from '../data/karthik.js'
import { panelStyle, headerStyle, labelStyle, closeStyle } from './HubPanel.jsx'

/**
 * CertsPanel — Microsoft Azure certifications as checkpointed nodes
 */
export default function CertsPanel({ onClose }) {
  return (
    <div className="panel-animate" style={panelStyle}>
      <div style={headerStyle}>
        <span style={labelStyle}>[ CHECKPOINTS: CERTIFICATIONS ]</span>
        <button onClick={onClose} style={closeStyle}>✕</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {certifications.map((cert, i) => (
          <div key={cert.id} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            padding: '16px',
            border: `1px solid ${cert.color}30`,
            borderRadius: '6px',
            background: `${cert.color}08`,
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Badge */}
            <div style={{
              width: '48px', height: '48px',
              borderRadius: '6px',
              border: `2px solid ${cert.color}60`,
              background: `${cert.color}15`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '8px',
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
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px',
                color: cert.color,
                fontWeight: 600,
                marginBottom: '4px',
                textShadow: `0 0 10px ${cert.color}60`,
              }}>
                {cert.name}
              </div>
              <div style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '10px',
                  padding: '2px 8px',
                  border: `1px solid ${cert.color}40`,
                  borderRadius: '2px',
                  color: cert.color,
                  background: `${cert.color}15`,
                }}>
                  {cert.code}
                </span>
                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '10px',
                  color: '#3d6b7a',
                }}>
                  {cert.issuer} Certified
                </span>
              </div>
            </div>

            {/* Checkpoint indicator */}
            <div style={{
              position: 'absolute',
              top: '8px',
              right: '12px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '9px',
              color: cert.color,
            }}>
              ✓ VERIFIED
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
