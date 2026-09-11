import React, { useState, useEffect } from 'react'
import { profile } from '../data/karthik.js'
import {
  getInitialVisitorCount,
  fetchVisitorCount,
} from '../utils/visitorTracker.js'

const ROTATING_WORDS = ['build', 'scale', 'stream', 'optimize', 'automate']

export default function FooterSection({ setActivePage }) {
  const [wordIdx, setWordIdx] = useState(0)
  const [displayCount, setDisplayCount] = useState(() => getInitialVisitorCount())
  const [targetCount, setTargetCount] = useState(() => getInitialVisitorCount())

  useEffect(() => {
    const wordTimer = setInterval(() => {
      setWordIdx((prev) => (prev + 1) % ROTATING_WORDS.length)
    }, 2400)

    let countTimer = null

    fetchVisitorCount().then((liveCount) => {
      if (liveCount !== null && liveCount !== undefined) {
        setTargetCount(liveCount)

        const start = 0
        const duration = 700
        const stepTime = 35
        const steps = Math.max(1, duration / stepTime)
        const increment = (liveCount - start) / steps
        let current = start

        countTimer = setInterval(() => {
          current += increment
          if (current >= liveCount) {
            setDisplayCount(liveCount)
            clearInterval(countTimer)
          } else {
            setDisplayCount(Math.floor(current))
          }
        }, stepTime)
      }
    })

    return () => {
      clearInterval(wordTimer)
      if (countTimer) clearInterval(countTimer)
    }
  }, [])

  const handleNav = (id) => {
    if (setActivePage) {
      setActivePage(id)
    }
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      window.history.replaceState(null, '', `#${id}`)
    }
  }

  return (
    <footer className="w-full bg-[#E03E2D] relative flex flex-col items-center">
      {/* ── WHITE / WARM CONTENT CARD (Rests on top of terracotta canvas with rounded bottom) ── */}
      <div className="w-full md:w-[calc(100%-48px)] lg:w-[calc(100%-72px)] bg-white rounded-b-[24px] sm:rounded-b-[28px] md:rounded-b-[36px] pt-12 sm:pt-20 md:pt-28 pb-12 sm:pb-16 px-5 sm:px-6 md:px-12 lg:px-16 shadow-[0_20px_50px_rgba(20,19,18,0.08)]">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-8 sm:gap-12 md:gap-16">
          
          {/* Main CTA Big Display Heading */}
          <div className="font-notch text-[28px] sm:text-[48px] md:text-[64px] lg:text-[74px] leading-[1.06] font-extrabold tracking-tight text-[#141312]">
            <p className="m-0">
              Let's{' '}
              <span className="inline-block text-[#141312] border-b-2 border-[#E03E2D] transition-all duration-300">
                {ROTATING_WORDS[wordIdx]}
              </span>
            </p>
            <p className="m-0">
              <span className="text-[#5C574F]">incredible data systems</span>{' '}
              <span className="text-[#E03E2D]">together</span>
              <span className="text-[#141312]">.</span>
            </p>
          </div>

          {/* Info Section Row with hairline border */}
          <div className="border-t border-[#E5DFD5] pt-8 sm:pt-12 md:pt-16 grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 items-start">
            
            {/* Bio Column */}
            <div className="md:col-span-5 flex flex-col gap-4 sm:gap-6 items-start">
              <p className="font-headline text-[13.5px] sm:text-[15px] leading-[22px] sm:leading-[25px] text-[#5C574F] max-w-[400px]">
                Azure Data Engineer at UST Global with 2+ years of enterprise experience building scalable Databricks Medallion lakehouses, Kafka streaming pipelines, and automated migration tooling.
              </p>
              <button
                type="button"
                onClick={() => handleNav('contact')}
                className="btn-primary"
              >
                <span>Let's talk</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </button>
            </div>

            {/* Links Columns Group */}
            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
              
              {/* Sections Column */}
              <div className="flex flex-col gap-4">
                <span className="font-mono text-[10.5px] uppercase font-semibold text-[#8C857B] tracking-wider">
                  Sections
                </span>
                <div className="flex flex-col gap-2.5 font-headline text-[14px] text-[#141312]">
                  <button onClick={() => handleNav('hero')} className="text-left hover:text-[#E03E2D] transition-colors cursor-pointer">Overview</button>
                  <button onClick={() => handleNav('experience')} className="text-left hover:text-[#E03E2D] transition-colors cursor-pointer">Experience</button>
                  <button onClick={() => handleNav('certifications')} className="text-left hover:text-[#E03E2D] transition-colors cursor-pointer">Certifications</button>
                  <button onClick={() => handleNav('projects')} className="text-left hover:text-[#E03E2D] transition-colors cursor-pointer">Projects</button>
                  <button onClick={() => handleNav('personal')} className="text-left hover:text-[#E03E2D] transition-colors cursor-pointer">Off the Clock</button>
                  <button onClick={() => handleNav('contact')} className="text-left hover:text-[#E03E2D] transition-colors cursor-pointer">Contact</button>
                </div>
              </div>

              {/* Connect Column */}
              <div className="flex flex-col gap-4">
                <span className="font-mono text-[10.5px] uppercase font-semibold text-[#8C857B] tracking-wider">
                  Connect
                </span>
                <div className="flex flex-col gap-2.5 font-headline text-[14.5px] text-[#141312]">
                  <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#E03E2D] transition-colors">LinkedIn</a>
                  <a href={`mailto:${profile.contact.email}`} className="hover:text-[#E03E2D] transition-colors">Email</a>
                  <a href={profile.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-[#E03E2D] transition-colors">WhatsApp</a>
                </div>
              </div>

              {/* Reach Out & Live Visitor Counter */}
              <div className="col-span-2 sm:col-span-1 flex flex-col gap-4">
                <span className="font-mono text-[10.5px] uppercase font-semibold text-[#8C857B] tracking-wider">
                  Reach out
                </span>
                <div className="flex flex-col gap-3 font-headline text-[14.5px] text-[#141312]">
                  <a href={`mailto:${profile.contact.email}`} className="break-all hover:text-[#E03E2D] transition-colors font-semibold">
                    {profile.contact.email}
                  </a>
                  <div className="pt-2 flex flex-col">
                    <div className="flex items-center gap-1.5 text-[10.5px] font-mono uppercase tracking-wider text-[#8C857B]">
                      <span>Visitor number:</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Live Verified Visits"></span>
                    </div>
                    <span className="font-notch text-[28px] font-bold text-[#E03E2D] tracking-wider font-mono">
                      {String(displayCount !== null && displayCount !== undefined ? displayCount : (targetCount || 0)).padStart(5, '0')}
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* ── SIGNATURE BOTTOM STRIP ON RED CANVAS ── */}
      <div className="w-full max-w-[1200px] py-6 px-6 flex flex-col sm:flex-row items-center justify-between text-white/80 font-mono text-[11px] gap-3">
        <span>© {new Date().getFullYear()} KARTHIK NP • ALL RIGHTS RESERVED</span>
        <div className="flex items-center gap-2">
          <span>BUILT FOR SCALE</span>
          <span>•</span>
          <span>HIGH-THROUGHPUT PIPELINES</span>
        </div>
      </div>
    </footer>
  )
}
