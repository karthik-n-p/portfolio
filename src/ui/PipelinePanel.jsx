import { experience } from '../data/karthik.js'
import { panelStyle, headerStyle, labelStyle, closeStyle, sectionLabel } from './HubPanel.jsx'

/**
 * PipelinePanel — Experience rendered as ETL pipeline stages
 */
export default function PipelinePanel({ onClose }) {
  const exp = experience[0]

  return (
    <div className="panel-animate" style={panelStyle}>
      <div style={headerStyle}>
        <span style={labelStyle}>[ PIPELINE: EXPERIENCE ]</span>
        <button onClick={onClose} style={closeStyle}>✕</button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '16px',
          fontWeight: 600,
          color: '#0af5a0',
          textShadow: '0 0 12px rgba(10,245,160,0.4)',
        }}>
          {exp.company}
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '4px', flexWrap: 'wrap' }}>
          <span style={{ ...chipStyle, borderColor: 'rgba(10,245,160,0.3)', color: '#0af5a0' }}>{exp.role}</span>
          <span style={{ ...chipStyle }}>{exp.period}</span>
          <span style={{ ...chipStyle }}>{exp.location}</span>
          <span style={{ ...chipStyle, borderColor: 'rgba(244,63,94,0.3)', color: '#f43f5e' }}>
            ★ {exp.award}
          </span>
        </div>
      </div>

      {/* Pipeline diagram */}
      <div style={sectionLabel}>data_pipeline[]</div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        marginBottom: '24px',
        overflowX: 'auto',
        paddingBottom: '8px',
        flexWrap: 'nowrap',
      }}>
        {exp.stages.map((stage, i) => (
          <div key={stage.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
            <div style={{
              padding: '8px 12px',
              border: `1px solid ${stageColor(stage.type)}`,
              borderRadius: '4px',
              background: `${stageColor(stage.type)}14`,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '10px',
              color: stageColor(stage.type),
              textAlign: 'center',
              minWidth: '80px',
            }}>
              <div style={{ fontSize: '16px', marginBottom: '4px' }}>{stage.icon}</div>
              <div>{stage.label}</div>
              <div style={{ fontSize: '8px', color: '#3d6b7a', marginTop: '2px' }}>{stage.type}</div>
            </div>
            {i < exp.stages.length - 1 && (
              <div style={{ color: '#3d6b7a', fontSize: '14px', flexShrink: 0 }}>→</div>
            )}
          </div>
        ))}
      </div>

      {/* Highlights as pipeline events */}
      <div style={sectionLabel}>job_logs[]</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {exp.highlights.map((h, i) => (
          <div key={i} style={{
            display: 'flex',
            gap: '12px',
            padding: '10px',
            border: '1px solid rgba(10,245,160,0.1)',
            borderRadius: '4px',
            background: 'rgba(10,245,160,0.03)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            color: '#7ab3cc',
            lineHeight: 1.6,
          }}>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              color: '#0af5a0',
              fontSize: '10px',
              flexShrink: 0,
              paddingTop: '2px',
            }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            {h}
          </div>
        ))}
      </div>
    </div>
  )
}

function stageColor(type) {
  const map = {
    source: '#f59e0b',
    transform: '#00d4ff',
    stream: '#0af5a0',
    sink: '#8b5cf6',
  }
  return map[type] || '#7ab3cc'
}

const chipStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '2px 8px',
  border: '1px solid rgba(122,179,204,0.25)',
  borderRadius: '3px',
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: '9px',
  color: '#7ab3cc',
  background: 'rgba(122,179,204,0.05)',
}
