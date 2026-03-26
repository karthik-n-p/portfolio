import { experience } from '../data/karthik.js'
import { panelStyle, headerStyle, labelStyle, closeStyle, sectionLabel } from './HubPanel.jsx'
import { colors, typography } from '../design-tokens.js'

/**
 * PipelinePanel — Experience rendered as an ETL timeline
 */
export default function PipelinePanel({ onClose }) {
  const exp = experience[0]

  return (
    <div className="panel-animate" style={panelStyle}>
      <div style={headerStyle}>
        <span style={labelStyle}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors.emerald, boxShadow: `0 0 8px ${colors.emerald}90` }} />
          EXPERIENCE PIPELINE
        </span>
        <button
          onClick={onClose}
          style={closeStyle}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = colors.neutral[100]; }}
          onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = colors.neutral[300]; }}
        >✕</button>
      </div>

      <div style={{ marginBottom: '28px' }}>
        <h2 className="text-h2" style={{ color: colors.neutral[100], margin: '0 0 8px 0' }}>
          {exp.company}
        </h2>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span className="chip" style={{ background: `${colors.emerald}15`, color: colors.emerald, borderColor: `${colors.emerald}40` }}>{exp.role}</span>
          <span className="chip">{exp.period}</span>
          <span className="chip">{exp.location}</span>
          <span className="chip" style={{ background: `${colors.amber}15`, color: colors.amber, borderColor: `${colors.amber}40` }}>
            ★ {exp.award}
          </span>
        </div>
      </div>

      {/* Pipeline diagram */}
      <div style={sectionLabel}>ETL Flow</div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0',
        marginBottom: '32px',
        overflowX: 'auto',
        paddingBottom: '12px',
        flexWrap: 'nowrap',
      }}>
        {exp.stages.map((stage, i) => (
          <div key={stage.id} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <div style={{
              padding: '12px 16px',
              border: `1px solid ${stageColor(stage.type)}40`,
              borderRadius: '8px',
              background: `linear-gradient(180deg, ${stageColor(stage.type)}12 0%, rgba(255,255,255,0.02) 100%)`,
              fontFamily: typography.fontSans,
              textAlign: 'center',
              minWidth: '90px',
              boxShadow: `0 4px 12px ${stageColor(stage.type)}08`
            }}>
              <div style={{ fontSize: '18px', marginBottom: '8px' }}>{stage.icon}</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: colors.neutral[100] }}>{stage.label}</div>
              <div style={{ fontSize: '10px', color: stageColor(stage.type), marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stage.type}</div>
            </div>
            {i < exp.stages.length - 1 && (
              <div style={{
                width: '32px',
                height: '2px',
                background: `linear-gradient(90deg, ${stageColor(stage.type)}50, rgba(255,255,255,0.1))`,
                flexShrink: 0,
                position: 'relative'
              }}>
                <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }}/>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Highlights as pipeline events */}
      <div style={sectionLabel}>Key Contributions</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {exp.highlights.map((h, i) => {
          const highlightText = typeof h === 'string' ? h.split(/(TB|\d+%|\d+x|\$|hours)/g).map((part, idx) =>
            /TB|\d+%|\d+x|\$|hours/.test(part) || (!isNaN(part) && part.trim() !== '') ?
              <span key={idx} style={{ color: colors.emerald, fontWeight: 600 }}>{part}</span> : part
          ) : h;

          return (
            <div key={i} className="card" style={{
              display: 'flex',
              gap: '16px',
              fontFamily: typography.fontSans,
              fontSize: '13px',
              color: colors.neutral[300],
              lineHeight: 1.6,
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: `${colors.emerald}15`,
                color: colors.emerald,
                fontFamily: typography.fontMono,
                fontSize: '10px',
                fontWeight: 600,
                flexShrink: 0,
              }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div>{highlightText}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function stageColor(type) {
  const map = {
    source: colors.amber,
    transform: colors.accent,
    stream: colors.emerald,
    sink: colors.violet,
  }
  return map[type] || colors.neutral[300]
}
