import { profile } from '../data/karthik.js'

/**
 * HubPanel — Central node panel: name, title, contact, summary
 */
export default function HubPanel({ onClose }) {
  return (
    <div className="panel-animate" style={panelStyle}>
      <div style={headerStyle}>
        <span style={labelStyle}>[ CENTRAL HUB ]</span>
        <button onClick={onClose} style={closeStyle}>✕</button>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 'clamp(22px, 3.5vw, 36px)',
          fontWeight: 700,
          color: '#00d4ff',
          letterSpacing: '0.08em',
          lineHeight: 1.1,
          textShadow: '0 0 20px rgba(0,212,255,0.5)',
          margin: 0,
        }}>
          {profile.name}
        </h1>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '13px',
          color: '#7ab3cc',
          letterSpacing: '0.25em',
          marginTop: '6px',
        }}>
          {profile.title} <span className="cursor-blink">_</span>
        </div>
      </div>

      <div style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px',
        color: '#7ab3cc',
        lineHeight: 1.7,
        marginBottom: '24px',
        maxWidth: '420px',
        borderLeft: '2px solid rgba(0,212,255,0.2)',
        paddingLeft: '14px',
      }}>
        {profile.summary}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={sectionLabel}>node_connections[]</div>
        {[
          { key: 'email', value: profile.contact.email, href: `mailto:${profile.contact.email}`, icon: '#' },
          { key: 'phone', value: profile.contact.phone, href: `tel:${profile.contact.phone.replace(/\s/g, '')}`, icon: '☏' },
          { key: 'linkedin', value: profile.contact.linkedin, href: `https://linkedin.com/in/${profile.contact.linkedin}`, icon: 'in' },
          { key: 'github', value: profile.contact.github, href: `https://${profile.contact.github}`, icon: '⬡' },
        ].map(({ key, value, href, icon }) => (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              color: '#7ab3cc',
              textDecoration: 'none',
              padding: '6px 10px',
              borderRadius: '3px',
              border: '1px solid rgba(0,212,255,0.1)',
              transition: 'all 0.2s ease',
              background: 'rgba(0,212,255,0.03)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.border = '1px solid rgba(0,212,255,0.4)'
              e.currentTarget.style.color = '#00d4ff'
              e.currentTarget.style.background = 'rgba(0,212,255,0.08)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.border = '1px solid rgba(0,212,255,0.1)'
              e.currentTarget.style.color = '#7ab3cc'
              e.currentTarget.style.background = 'rgba(0,212,255,0.03)'
            }}
          >
            <span style={{ color: '#00d4ff', width: '16px', textAlign: 'center', fontSize: '10px' }}>{icon}</span>
            <span style={{ color: '#3d6b7a' }}>{key}: </span>
            <span>{value}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

/* Shared panel styles */
export const panelStyle = {
  position: 'relative',
  padding: '24px',
  border: '1px solid rgba(0,212,255,0.2)',
  borderRadius: '6px',
  background: 'rgba(5,10,14,0.88)',
  backdropFilter: 'blur(24px)',
  maxWidth: '500px',
  width: '90vw',
  maxHeight: '85vh',
  overflowY: 'auto',
  scrollbarWidth: 'thin',
  scrollbarColor: 'rgba(0,212,255,0.2) transparent',
}

export const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
}

export const labelStyle = {
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: '10px',
  color: '#3d6b7a',
  letterSpacing: '0.15em',
}

export const sectionLabel = {
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: '9px',
  color: '#3d6b7a',
  letterSpacing: '0.15em',
  marginBottom: '6px',
  textTransform: 'uppercase',
}

export const closeStyle = {
  background: 'transparent',
  border: '1px solid rgba(0,212,255,0.2)',
  color: '#3d6b7a',
  cursor: 'pointer',
  width: '24px',
  height: '24px',
  borderRadius: '3px',
  fontSize: '11px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease',
}
