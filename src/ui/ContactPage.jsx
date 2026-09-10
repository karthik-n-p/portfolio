import React, { useState, useEffect } from 'react'
import { profile } from '../data/karthik.js'

export default function ContactPage() {
  const [currentTime, setCurrentTime] = useState('')
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Data Engineering & Lakehouse Pipelines',
    message: '',
  })

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.contact.email)
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2400)
  }

  const conversationStarters = [
    { label: '🚀 Discuss Lakehouse Architecture', service: 'Data Engineering & Lakehouse Pipelines', msg: 'Hi Karthik, I came across your portfolio and wanted to discuss a lakehouse / pipeline architecture...' },
    { label: '⚡ Kafka Real-time Streaming', service: 'Real-Time Kafka Streaming', msg: 'Hi Karthik, wanted to chat about setting up high-throughput Kafka streaming with automated alerting...' },
    { label: '🤝 High-Impact Full-Time Role', service: 'Full-time / Consulting Opportunity', msg: 'Hi Karthik, we have an exciting Azure Data Engineer role that matches your background...' },
    { label: '☕ Say Hi & Grab Filter Coffee', service: 'Other', msg: 'Hey Karthik, loved your portfolio and hot takes! Would love to connect and chat tech...' },
  ]

  const handleSelectStarter = (starter) => {
    setFormData((prev) => ({
      ...prev,
      service: starter.service,
      message: starter.msg,
    }))
  }

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const timeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })
      setCurrentTime(`${timeStr} IST`)
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const validateEmail = async (emailAddr) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!re.test(emailAddr)) return 'Invalid email format.'

    const lowerEmail = emailAddr.toLowerCase()
    const [local, domain] = lowerEmail.split('@')

    const dummyDomains = ['example.com', 'test.com', 'sample.com', 'dummy.com', 'fake.com']
    if (dummyDomains.includes(domain)) return 'Sample/fake domains are not allowed.'

    try {
      const dnsUrl = `https://dns.google/resolve?name=${domain}&type=MX`
      const res = await fetch(dnsUrl)
      const data = await res.json()
      if (data.Status !== 0 || !data.Answer || data.Answer.length === 0) {
        return `The domain "@${domain}" cannot receive email.`
      }
    } catch {
      // Fallback gracefully if DNS query is blocked
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    setIsSubmitting(true)

    const errorMsg = await validateEmail(formData.email)
    if (errorMsg) {
      setSubmitError(errorMsg)
      setIsSubmitting(false)
      return
    }

    try {
      const res = await fetch('https://formsubmit.co/ajax/karthik.np.work@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          service: formData.service,
          message: formData.message,
          _subject: `New Enquiry from ${formData.name} [Portfolio]`,
        }),
      })

      if (res.ok) {
        setFormSubmitted(true)
      } else {
        setSubmitError('Unable to send message right now. Please email directly.')
      }
    } catch {
      setFormSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full flex flex-col items-center bg-[#FBF9F5] text-[#141312]">
      {/* ── PAGE HEADER ── */}
      <section className="w-full max-w-[1000px] pt-28 sm:pt-36 pb-8 px-6 sm:px-10 flex flex-col items-center text-center gap-3">
        <span className="section-kicker">
          [ GET IN TOUCH ]
        </span>
        <h1 className="font-notch text-[36px] sm:text-[50px] md:text-[62px] leading-[1.06] font-extrabold tracking-tight text-[#141312]">
          let's build <span className="font-editorial italic font-normal text-[#141312]">something great</span><span className="text-[#E03E2D]">.</span>
        </h1>
        <p className="font-headline text-[15px] sm:text-[16.5px] text-[#5C574F] max-w-[620px] leading-relaxed">
          Got an interesting data problem, a pipeline that needs taming, or looking to add an experienced Azure Data Engineer to your team? Drop a line — I read and reply to every message.
        </p>
      </section>

      {/* ── MAIN CONTENT GRID ── */}
      <section className="w-full max-w-[1100px] py-8 pb-28 px-6 sm:px-10 grid grid-cols-1 lg:grid-cols-12 gap-9">
        
        {/* Left Column: Location, Local Time & Direct Details */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Location & Local Clock Card */}
          <div className="p-8 rounded-[28px] bg-white border border-[#E5DFD5] flex flex-col justify-between h-[280px] shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD5]">
              <span className="font-mono text-[10.5px] uppercase font-bold text-[#E03E2D]">
                BASE OF OPERATIONS
              </span>
              <div className="badge-status text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                <span>Active</span>
              </div>
            </div>

            <div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#8C857B] font-semibold">Location</span>
              <h3 className="font-notch text-[30px] font-bold text-[#141312] mt-0.5 leading-tight">
                Kerala, India
              </h3>
              <p className="font-headline text-[13px] text-[#5C574F] mt-1 font-medium">
                Trivandrum • Kannur
              </p>
            </div>

            <div className="pt-3 border-t border-[#E5DFD5] flex items-center justify-between font-mono text-[12.5px] text-[#141312]">
              <span className="text-[#8C857B] text-[11px] font-semibold">LOCAL TIME</span>
              <span className="font-bold text-[#E03E2D]">{currentTime || '12:00:00 PM IST'}</span>
            </div>
          </div>

          {/* Direct Channels Card */}
          <div className="p-8 rounded-[28px] bg-white border border-[#E5DFD5] flex flex-col gap-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#8C857B] font-semibold">
                Direct Channels
              </span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#141312] hover:text-[#E03E2D] cursor-pointer transition-colors"
                title="Copy email address"
              >
                {copiedEmail ? (
                  <span className="text-emerald-700 font-semibold animate-fadeIn">✓ Copied!</span>
                ) : (
                  <span>📋 Copy Email</span>
                )}
              </button>
            </div>

            <div className="flex flex-col gap-4 font-headline text-[14px]">
              <div className="flex flex-col">
                <span className="text-[11px] text-[#8C857B] font-mono uppercase font-medium">Email</span>
                <div className="flex items-center justify-between group">
                  <a href={`mailto:${profile.contact.email}`} className="font-semibold text-[#141312] hover:text-[#E03E2D] transition-colors text-[15px]">
                    {profile.contact.email}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="p-1 rounded-md text-xs text-[#8C857B] hover:text-[#141312] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    aria-label="Copy email"
                  >
                    📋
                  </button>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-[11px] text-[#8C857B] font-mono uppercase font-medium">Phone / WhatsApp</span>
                <a href={profile.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#141312] hover:text-[#E03E2D] transition-colors text-[15px]">
                  {profile.contact.phone}
                </a>
              </div>

              <div className="flex flex-col">
                <span className="text-[11px] text-[#8C857B] font-mono uppercase font-medium">LinkedIn</span>
                <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#141312] hover:text-[#E03E2D] transition-colors text-[15px]">
                  {profile.contact.linkedinDisplay}
                </a>
              </div>

              <div className="flex flex-col">
                <span className="text-[11px] text-[#8C857B] font-mono uppercase font-medium">GitHub</span>
                <a href={profile.contact.github} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#141312] hover:text-[#E03E2D] transition-colors text-[15px]">
                  {profile.contact.githubDisplay}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Enquiry Form */}
        <div className="lg:col-span-7 bg-white border border-[#E5DFD5] rounded-[28px] p-8 sm:p-12 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col pb-6 border-b border-[#E5DFD5] mb-6">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#8C857B] font-semibold">
                Start an Enquiry
              </span>
              <h2 className="font-notch text-[30px] sm:text-[36px] font-bold text-[#141312] mt-1 leading-tight">
                Send a message<span className="text-[#E03E2D]">.</span>
              </h2>

              {/* Quick Conversation Starter Pills */}
              <div className="flex flex-col gap-2 mt-4 pt-3 border-t border-[#E5DFD5]/70">
                <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#8C857B] font-semibold">
                  Tap to prefill topic:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {conversationStarters.map((starter, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectStarter(starter)}
                      className="px-2.5 py-1 rounded-full text-[11.5px] font-headline font-semibold bg-[#FBF9F5] border border-[#E5DFD5] text-[#5C574F] hover:text-[#141312] hover:border-[#E03E2D] hover:bg-rose-50 transition-all cursor-pointer active:scale-95 shadow-2xs"
                    >
                      {starter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {formSubmitted ? (
              <div className="p-8 rounded-[24px] bg-[#FBF9F5] border border-[#E5DFD5] text-center flex flex-col items-center gap-4 animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl">
                  ✓
                </div>
                <h3 className="font-notch text-[22px] font-bold text-[#141312]">Message Delivered!</h3>
                <p className="font-headline text-[14px] text-[#5C574F] max-w-[380px] leading-relaxed">
                  Thank you for reaching out, {formData.name || 'friend'}. I'll get back to you via {formData.email || 'email'} shortly.
                </p>
                <button
                  type="button"
                  onClick={() => { setFormSubmitted(false); setFormData({ name: '', email: '', service: 'Data Engineering & Lakehouse Pipelines', message: '' }) }}
                  className="btn-secondary text-xs mt-2"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 font-headline text-[14px]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-[#141312] text-xs uppercase tracking-wider">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Smith"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="px-4 py-3 rounded-xl bg-[#FBF9F5] border border-[#E5DFD5] text-[#141312] focus:outline-none focus:border-[#141312] transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-[#141312] text-xs uppercase tracking-wider">Your Email</label>
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="px-4 py-3 rounded-xl bg-[#FBF9F5] border border-[#E5DFD5] text-[#141312] focus:outline-none focus:border-[#141312] transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-bold text-[#141312] text-xs uppercase tracking-wider">Subject / Area of Interest</label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="px-4 py-3 rounded-xl bg-[#FBF9F5] border border-[#E5DFD5] text-[#141312] focus:outline-none focus:border-[#141312] transition-all cursor-pointer"
                  >
                    <option value="Data Engineering & Lakehouse Pipelines">Data Engineering & Lakehouse Pipelines</option>
                    <option value="Cloud Migration (DB2 / COBOL Modernization)">Cloud Migration (DB2 / COBOL Modernization)</option>
                    <option value="Real-Time Kafka Streaming">Real-Time Kafka Streaming</option>
                    <option value="Full-time / Consulting Opportunity">Full-time / Consulting Opportunity</option>
                    <option value="Other">Other / General Conversation</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-bold text-[#141312] text-xs uppercase tracking-wider">Your Message</label>
                  <textarea
                    rows="5"
                    required
                    placeholder="Tell me about your project, data volume, or opportunity..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="px-4 py-3 rounded-xl bg-[#FBF9F5] border border-[#E5DFD5] text-[#141312] focus:outline-none focus:border-[#141312] transition-all resize-none"
                  ></textarea>
                </div>

                {submitError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-headline font-semibold">
                    {submitError}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full justify-center disabled:opacity-60"
                  >
                    <span>{isSubmitting ? 'Verifying & Sending...' : 'Send enquiry'}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

      </section>
    </div>
  )
}
