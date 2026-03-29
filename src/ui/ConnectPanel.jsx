import { useState } from 'react'
import { panelStyle, headerStyle, labelStyle, closeStyle } from './HubPanel.jsx'
import { colors, sectionColors, typography, motion } from '../design-tokens.js'
import ScrambleText from './ScrambleText.jsx'

/**
 * ConnectPanel — Contact form using formsubmit.co for direct email delivery
 */
export default function ConnectPanel({ onClose }) {
  const theme = sectionColors.connect
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')

  const validateEmail = async (emailAddr) => {
    // Basic format restriction
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!re.test(emailAddr)) return "Invalid email format."

    const lowerEmail = emailAddr.toLowerCase()
    const [local, domain] = lowerEmail.split('@')

    // 1. Check against sample/dummy keywords
    const dummyDomains = ['example.com', 'test.com', 'sample.com', 'dummy.com', 'fake.com', 'email.com']
    const dummyLocals = ['test', 'sample', 'dummy', 'fake', 'asdf', 'user', 'name']
    
    if (dummyDomains.includes(domain)) return "Sample/fake domains are not allowed."
    if (dummyLocals.some(dummy => local.includes(dummy))) return "Sample/fake addresses are not allowed."
    if (/^(.)\1+$/.test(local) && local.length > 1) return "Please enter a valid real email." // e.g. aaaa@gmail.com

    // 2. Verify domain actually exists and has Mail Exchange (MX) records
    try {
      const dnsUrl = `https://dns.google/resolve?name=${domain}&type=MX`
      const res = await fetch(dnsUrl)
      const data = await res.json()
      if (data.Status !== 0 || !data.Answer || data.Answer.length === 0) {
        return `The domain "@${domain}" does not exist or cannot receive email.`
      }
    } catch (err) {
      // Fail gracefully if dns.google is blocked
      console.warn("DNS MX check failed, bypassing.")
    }

    return null // Email passes all checks!
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    setStatus('Validating email...')
    const errorMsg = await validateEmail(email)
    if (errorMsg) {
      setStatus(errorMsg)
      return
    }

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
    e.currentTarget.style.borderColor = `${theme.primary}60`
    e.currentTarget.style.background = `${theme.primary}10`
  }
  const blurInput = (e) => {
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
    e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
  }

  return (
    <div className="panel-animate" style={panelStyle}>
      <div style={headerStyle}>
        <span style={labelStyle}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: theme.primary, boxShadow: `0 0 8px ${theme.primary}80` }} />
          <ScrambleText text="GET IN TOUCH" speed={30} delay={100} />
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
            disabled={status === 'Sending...' || status === 'Validating email...'}
            style={{
              padding: '12px 24px',
              background: `${theme.primary}20`,
              border: `1px solid ${theme.primary}50`,
              borderRadius: '8px',
              color: theme.primary,
              fontFamily: typography.fontSans,
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.05em',
              cursor: (status === 'Sending...' || status === 'Validating email...') ? 'wait' : 'pointer',
              transition: `all ${motion.base}`,
              opacity: (status === 'Sending...' || status === 'Validating email...') ? 0.7 : 1,
            }}
            onMouseEnter={e => {
              if (status !== 'Sending...' && status !== 'Validating email...') {
                e.currentTarget.style.background = `${theme.primary}35`
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = `0 8px 24px ${theme.primary}20`
              }
            }}
            onMouseLeave={e => {
              if (status !== 'Sending...' && status !== 'Validating email...') {
                e.currentTarget.style.background = `${theme.primary}20`
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }
            }}
          >
            {status === 'Sending...' ? 'SENDING...' : (status === 'Validating email...' ? 'VALIDATING...' : 'SEND MESSAGE →')}
          </button>
          
          {status && status !== 'Sending...' && status !== 'Validating email...' && (
            <span style={{ 
              fontFamily: typography.fontSans, 
              fontSize: '13px', 
              color: status.includes('success') ? theme.secondary : colors.rose,
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
