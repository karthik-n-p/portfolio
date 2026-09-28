import React, { useState, useEffect } from 'react'
import Navbar from './ui/Navbar.jsx'
import HomePage from './ui/HomePage.jsx'
import FooterSection from './ui/FooterSection.jsx'

export default function App() {
  const [mode, setMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase()
      if (['personal', 'musings', 'habits', 'travel'].includes(hash)) {
        return 'personal'
      }
    }
    return 'professional'
  })

  const scrollToSection = (rawId) => {
    const id = (rawId || '').replace(/^#\/?/, '').toLowerCase()
    
    // Auto switch mode based on destination
    if (['personal', 'musings', 'habits', 'disciplines', 'reading', 'workout', 'travel'].includes(id)) {
      setMode('personal')
    } else if (['hero', 'home', 'experience', 'about', 'certifications', 'certs', 'resume', 'projects', 'works'].includes(id)) {
      setMode('professional')
    }

    const targetMap = {
      home: 'hero',
      hero: 'hero',
      about: 'experience',
      experience: 'experience',
      certs: 'certifications',
      resume: 'resume',
      cv: 'resume',
      certifications: 'certifications',
      works: 'projects',
      projects: 'projects',
      personal: 'personal',
      musings: 'musings',
      habits: 'habits',
      disciplines: 'habits',
      reading: 'habits',
      workout: 'habits',
      travel: 'travel',
      contact: 'contact',
    }
    const targetId = targetMap[id] || id
    
    setTimeout(() => {
      const el = document.getElementById(targetId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        window.history.replaceState(null, '', `#${targetId}`)
      }
    }, 60)
  }

  // Handle hash changes and initial load
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase()
      if (hash) {
        setTimeout(() => {
          scrollToSection(hash)
        }, 120)
      }
    }
    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  // Send pageview to GoatCounter
  useEffect(() => {
    if (typeof window !== 'undefined' && window.goatcounter && typeof window.goatcounter.count === 'function') {
      window.goatcounter.count({
        path: '/' + (window.location.hash ? window.location.hash : ''),
        title: 'Karthik NP | Azure Data Engineer',
        event: false
      })
    }
  }, [])

  return (
    <div className="w-full min-h-screen min-h-[100dvh] bg-[#FBF9F5] text-[#141312] flex flex-col selection:bg-[#E03E2D] selection:text-white relative">
      {/* ── FLOATING CAPSULE NAVBAR (Desktop only, minimal, with mode switcher) ── */}
      <Navbar mode={mode} setMode={setMode} scrollToSection={scrollToSection} />

      {/* ── UNIFIED MASTER CONTENT WITH ZERO REPETITION ── */}
      <main className="w-full flex-1 flex flex-col">
        <HomePage mode={mode} setMode={setMode} scrollToSection={scrollToSection} />
      </main>

      {/* ── SIGNATURE CURTAIN & RED CANVAS FOOTER ── */}
      <FooterSection setActivePage={scrollToSection} />
    </div>
  )
}
