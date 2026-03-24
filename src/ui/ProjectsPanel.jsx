import { projects } from '../data/karthik.js'
import { panelStyle, headerStyle, labelStyle, closeStyle, sectionLabel } from './HubPanel.jsx'

/**
 * ProjectsPanel — Projects as interactive DAG nodes
 */
export default function ProjectsPanel({ onClose }) {
  return (
    <div className="panel-animate" style={panelStyle}>
      <div style={headerStyle}>
        <span style={labelStyle}>[ GRAPH: PROJECTS ]</span>
        <button onClick={onClose} style={closeStyle}>✕</button>
      </div>

      <div className="panel-scroll" style={{ paddingRight: '12px' }}>
        {projects.map((project, index) => (
          <div key={project.id} style={{ 
            marginBottom: index === projects.length - 1 ? 0 : '40px', 
            paddingBottom: index === projects.length - 1 ? 0 : '24px', 
            borderBottom: index === projects.length - 1 ? 'none' : '1px dashed rgba(139,92,246,0.2)' 
          }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                <div>
                  <div style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#8b5cf6',
                    textShadow: '0 0 12px rgba(139,92,246,0.4)',
                  }}>
                    {project.name}
                  </div>
                  <div style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '11px',
                    color: '#3d6b7a',
                    marginTop: '2px',
                  }}>
                    {project.subtitle}
                  </div>
                </div>
                {project.link && (
                  <a href={project.link} target="_blank" rel="noreferrer" style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
                    color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)',
                    padding: '4px 8px', borderRadius: '3px', textDecoration: 'none',
                    background: 'rgba(0,212,255,0.05)', whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                  }}>
                    [ LIVE ENV ]
                  </a>
                )}
              </div>
            </div>

            {/* DAG visualization */}
            <div style={sectionLabel}>dag_graph[]</div>
            <DagVisualization project={project} />

            <div style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              color: '#7ab3cc',
              lineHeight: 1.7,
              margin: '20px 0',
              padding: '12px',
              border: '1px solid rgba(139,92,246,0.15)',
              borderRadius: '4px',
              background: 'rgba(139,92,246,0.04)',
              borderLeft: '3px solid rgba(139,92,246,0.5)',
            }}>
              {project.description}
            </div>

            <div style={sectionLabel}>tech_stack[]</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {project.stack.map((tech, i) => (
                <span key={tech} style={{
                  display: 'inline-block',
                  padding: '4px 10px',
                  borderRadius: '3px',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '10px',
                  border: `1px solid ${project.stackColors[i] || '#8b5cf6'}55`,
                  color: project.stackColors[i] || '#c4b5fd',
                  background: `${project.stackColors[i] || '#8b5cf6'}12`,
                }}>
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

  // Layout positions scaled to canvas
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
        marginBottom: '8px',
        border: '1px solid rgba(139,92,246,0.15)',
        borderRadius: '4px',
        background: 'rgba(139,92,246,0.03)',
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
              stroke="rgba(139,92,246,0.35)"
              strokeWidth="1"
              strokeDasharray="4 3"
            />
            {/* Arrow */}
            <circle cx={t.x} cy={t.y} r="2" fill="rgba(139,92,246,0.6)" />
          </g>
        )
      })}

      {/* Nodes */}
      {project.dag.map(n => {
        const pos = nodeMap[n.id]
        if (!pos) return null
        const isSource = n.id.startsWith('source')
        const isSink = n.id === 'delta' || n.id === 'dashboard'
        const color = isSource ? '#f59e0b' : isSink ? '#0af5a0' : '#8b5cf6'
        return (
          <g key={n.id} transform={`translate(${pos.x}, ${pos.y})`}>
            <circle r="8" fill={`${color}22`} stroke={color} strokeWidth="1" />
            <circle r="3" fill={color} />
            <text
              y="20"
              textAnchor="middle"
              fill="#7ab3cc"
              fontSize="8"
              fontFamily="JetBrains Mono, monospace"
            >
              {pos.label.length > 14 ? pos.label.slice(0, 12) + '…' : pos.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
