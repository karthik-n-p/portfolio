import { experience } from '../data/karthik.js'
import { panelStyle, headerStyle, labelStyle, closeStyle, sectionLabel } from './HubPanel.jsx'
import { colors, sectionColors, typography } from '../design-tokens.js'
import ScrambleText from './ScrambleText.jsx'

/**
 * PipelinePanel — Experience rendered as an ETL timeline
 */
export default function PipelinePanel({ onClose }) {
  const exp = experience[0]
  const theme = sectionColors.pipeline

  return (
    <div className="panel-animate" style={panelStyle}>
      <div style={headerStyle}>
        <span style={labelStyle}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: theme.primary, boxShadow: `0 0 8px ${theme.primary}90` }} />
          <ScrambleText text="EXPERIENCE PIPELINE" speed={30} delay={100} />
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

      <div style={{ marginBottom: '28px' }}>
        <h2 className="text-h2" style={{ color: theme.secondary, margin: '0 0 8px 0' }}>
          {exp.company}
        </h2>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span className="chip" style={{ background: `${theme.primary}15`, color: theme.primary, borderColor: `${theme.primary}40` }}>{exp.role}</span>
          <span className="chip" style={{ borderColor: `${theme.secondary}35`, color: colors.neutral[200], background: `${theme.secondary}10` }}>{exp.period}</span>
          <span className="chip" style={{ borderColor: `${theme.secondary}35`, color: colors.neutral[200], background: `${theme.secondary}10` }}>{exp.location}</span>
          <span className="chip" style={{ background: `${theme.glow}30`, color: colors.neutral[100], borderColor: `${theme.glow}60` }}>
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
              <span key={idx} style={{ color: colors.neutral[100], fontWeight: 700 }}>{part}</span> : part
          ) : h;

          return (
            <div key={i} className="card" style={{
              display: 'flex',
              gap: '16px',
              fontFamily: typography.fontSans,
              fontSize: '13px',
              color: colors.neutral[300],
              lineHeight: 1.6,
              borderColor: `${theme.primary}28`,
              background: `linear-gradient(135deg, ${theme.primary}0d 0%, rgba(255,255,255,0.02) 100%)`,
              boxShadow: `inset 0 1px 0 ${theme.primary}14`,
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: `${theme.primary}15`,
                color: theme.primary,
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
  const pipelinePrimary = sectionColors.pipeline.primary
  const pipelineSecondary = sectionColors.pipeline.secondary
  const map = {
    source: pipelinePrimary,
    transform: pipelinePrimary,
    stream: pipelineSecondary,
    sink: pipelinePrimary,
  }
  return map[type] || colors.neutral[300]
}
