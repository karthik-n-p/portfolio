import { projects } from '../data/karthik.js'
import { panelStyle, headerStyle, labelStyle, closeStyle, sectionLabel } from './HubPanel.jsx'
import { colors, typography } from '../design-tokens.js'

/**
 * ProjectsPanel — Projects as interactive DAG nodes
 */
export default function ProjectsPanel({ onClose }) {
  return (
    <div className="panel-animate" style={panelStyle}>
      <div style={headerStyle}>
        <span style={labelStyle}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors.neutral[100], boxShadow: `0 0 8px ${colors.neutral[100]}90` }} />
          PROJECTS PORTFOLIO
        </span>
        <button
          onClick={onClose}
          style={closeStyle}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = colors.neutral[100]; }}
          onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = colors.neutral[300]; }}
        >✕</button>
      </div>

      <div className="panel-scroll" style={{ paddingRight: '12px' }}>
        {projects.map((project, index) => (
          <div key={project.id} style={{
            marginBottom: index === projects.length - 1 ? 0 : '48px',
            paddingBottom: index === projects.length - 1 ? 0 : '32px',
            borderBottom: index === projects.length - 1 ? 'none' : `1px solid ${colors.neutral[700]}60`
          }}>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                <div>
                  <h2 style={{
                    fontFamily: typography.fontSans,
                    fontSize: '20px',
                    fontWeight: 700,
                    color: colors.neutral[100],
                    letterSpacing: '-0.02em',
                    margin: 0,
                  }}>
                    {project.name}
                  </h2>
                  <div style={{
                    fontFamily: typography.fontSans,
                    fontSize: '13px',
                    fontWeight: 500,
                    color: colors.neutral[300],
                    marginTop: '4px',
                    letterSpacing: '0.05em',
                  }}>
                    {project.subtitle}
                  </div>
                </div>
                {project.link && (
                  <a href={project.link} target="_blank" rel="noreferrer" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    fontFamily: typography.fontSans, fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em',
                    color: colors.accent, border: `1px solid ${colors.accent}40`,
                    padding: '6px 12px', borderRadius: '20px', textDecoration: 'none',
                    background: `${colors.accent}15`, whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={e => e.currentTarget.style.background = `${colors.accent}28`}
                  onMouseOut={e => e.currentTarget.style.background = `${colors.accent}15`}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: colors.accent }} />
                    LIVE VIEW
                  </a>
                )}
              </div>
            </div>

            {/* DAG visualization */}
            <div style={sectionLabel}>Architecture DAG</div>
            <DagVisualization project={project} />

            <div style={sectionLabel}>Description</div>
            <div className="text-body" style={{ margin: '0 0 24px 0' }}>
              {project.description}
            </div>

            <div style={sectionLabel}>Technology Stack</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {project.stack.map((tech) => (
                <span key={tech} className="chip" style={{ color: colors.neutral[100] }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DagVisualization({ project }) {
  const canvasW = 440
  const canvasH = 140

  const nodeMap = {}
  project.dag.forEach(n => {
    nodeMap[n.id] = {
      x: (n.pos.x / 3) * (canvasW - 80) + 40,
      y: n.pos.y * 60 + 35,
      label: n.label,
    }
  })

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${canvasW} ${canvasH}`}
      style={{
        marginBottom: '24px',
        border: `1px solid ${colors.neutral[700]}40`,
        borderRadius: '8px',
        background: 'rgba(255,255,255,0.01)',
        overflow: 'visible',
      }}
    >
      {/* Edges */}
      {project.edges.map(([from, to], i) => {
        const f = nodeMap[from]
        const t = nodeMap[to]
        if (!f || !t) return null
        return (
          <g key={i}>
            <line
              x1={f.x} y1={f.y}
              x2={t.x} y2={t.y}
              stroke={`${colors.neutral[600]}`}
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <circle cx={t.x} cy={t.y} r="3" fill={`${colors.neutral[400]}`} />
          </g>
        )
      })}

      {/* Nodes */}
      {project.dag.map(n => {
        const pos = nodeMap[n.id]
        if (!pos) return null
        const isSource = n.id.startsWith('source') || n.id === 'api'
        const isSink = n.id === 'delta' || n.id === 'dashboard' || n.id === 'ui'
        const color = isSource ? colors.neutral[300] : isSink ? colors.neutral[100] : colors.accent

        return (
          <g key={n.id} transform={`translate(${pos.x}, ${pos.y})`}>
            <circle r="10" fill={`${color}20`} stroke={color} strokeWidth="1.5" />
            <circle r="4" fill={color} />
            <text
              y="24"
              textAnchor="middle"
              fill={colors.neutral[300]}
              fontSize="10"
              fontFamily="Inter, sans-serif"
              fontWeight="500"
            >
              {pos.label.length > 14 ? pos.label.slice(0, 12) + '…' : pos.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
