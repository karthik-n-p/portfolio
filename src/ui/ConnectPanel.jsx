import { useState } from 'react'
import { panelStyle, headerStyle, labelStyle, closeStyle } from './HubPanel.jsx'
import { colors, typography, motion } from '../design-tokens.js'

/**
 * ConnectPanel — Contact form using formsubmit.co for direct email delivery
 */
export default function ConnectPanel({ onClose }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('Sending...')

    try {
      const response = await fetch("https://formsubmit.co/ajax/karthik.np.work@gmail.com", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            name,
            email,
            message,
            _subject: `New Portfolio Message from ${name}`
        })
      })

      if (response.ok) {
        setStatus('Message sent successfully!')
        setName('')
        setEmail('')
        setMessage('')
        setTimeout(() => setStatus(''), 4000)
      } else {
        setStatus('Delivery failed. Please try again.')
      }
    } catch (error) {
      setStatus('Delivery failed. Please try again.')
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    color: colors.neutral[100],
    fontFamily: typography.fontSans,
    fontSize: '13px',
    outline: 'none',
    transition: `all ${motion.base}`,
    resize: 'none',
  }

  const focusInput = (e) => {
    e.currentTarget.style.borderColor = `${colors.emerald}60`
    e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
  }
  const blurInput = (e) => {
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
    e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
  }

  return (
    <div className="panel-animate" style={panelStyle}>
      <div style={headerStyle}>
        <span style={labelStyle}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors.emerald, boxShadow: `0 0 8px ${colors.emerald}80` }} />
          GET IN TOUCH
        </span>
        <button
          onClick={onClose}
          style={closeStyle}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = colors.neutral[100]; }}
          onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = colors.neutral[300]; }}
        >✕</button>
      </div>

      <div style={{
        fontSize: '14px',
        color: colors.neutral[300],
        lineHeight: 1.7,
        marginBottom: '28px',
        fontFamily: typography.fontSans,
      }}>
        Whether you have a question, a project idea, or just want to say hello, feel free to drop a message. I'll get back to you as soon as possible.
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', fontWeight: 600, color: colors.neutral[300], letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: typography.fontSans }}>
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            placeholder="Your name"
            style={{...inputStyle, '::placeholder': { color: colors.neutral[500] }}}
            onFocus={focusInput}
            onBlur={blurInput}
            disabled={status === 'Sending...'}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', fontWeight: 600, color: colors.neutral[300], letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: typography.fontSans }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            style={inputStyle}
            onFocus={focusInput}
            onBlur={blurInput}
            disabled={status === 'Sending...'}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '11px', fontWeight: 600, color: colors.neutral[300], letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: typography.fontSans }}>
            Message
          </label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
            rows={4}
            placeholder="How can I help you?"
            style={inputStyle}
            onFocus={focusInput}
            onBlur={blurInput}
            disabled={status === 'Sending...'}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
          <button
            type="submit"
            disabled={status === 'Sending...'}
            style={{
              padding: '12px 24px',
              background: `${colors.emerald}20`,
              border: `1px solid ${colors.emerald}50`,
              borderRadius: '8px',
              color: colors.emerald,
              fontFamily: typography.fontSans,
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.05em',
              cursor: status === 'Sending...' ? 'wait' : 'pointer',
              transition: `all ${motion.base}`,
              opacity: status === 'Sending...' ? 0.7 : 1,
            }}
            onMouseEnter={e => {
              if (status !== 'Sending...') {
                e.currentTarget.style.background = `${colors.emerald}35`
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = `0 8px 24px ${colors.emerald}20`
              }
            }}
            onMouseLeave={e => {
              if (status !== 'Sending...') {
                e.currentTarget.style.background = `${colors.emerald}20`
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }
            }}
          >
            {status === 'Sending...' ? 'SENDING...' : 'SEND MESSAGE →'}
          </button>
          
          {status && status !== 'Sending...' && (
            <span style={{ 
              fontFamily: typography.fontSans, 
              fontSize: '13px', 
              color: status.includes('success') ? colors.emerald : colors.rose,
              fontWeight: 500
            }}>
              {status}
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
