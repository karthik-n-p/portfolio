import React, { useState, useEffect } from 'react'

export default function Navbar({ mode = 'professional', setMode, scrollToSection }) {
  const [activeSection, setActiveSection] = useState('')

  const professionalNavItems = [
    { id: 'experience', label: 'EXPERIENCE' },
    { id: 'certifications', label: 'CERTIFICATIONS' },
    { id: 'projects', label: 'PROJECTS' },
    { id: 'resume', label: 'RESUME' },
    { id: 'contact', label: 'CONTACT' },
  ]

  const personalNavItems = [
    { id: 'personal', label: 'SCRAPBOOK' },
    { id: 'bucket-list', label: 'BUCKET LIST' },
    { id: 'photos', label: 'PHOTOS' },
    { id: 'habits', label: 'DISCIPLINES' },
    { id: 'contact', label: 'CONTACT' },
  ]

  const currentNavItems = mode === 'professional' ? professionalNavItems : personalNavItems

  useEffect(() => {
    const sectionIds = mode === 'professional'
      ? ['hero', 'experience', 'certifications', 'projects', 'resume', 'contact']
      : ['personal', 'bucket-list', 'photos', 'habits', 'contact']
    
    const handleScroll = () => {
      const scrollPos = window.scrollY + 280
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i]
        const el = document.getElementById(id)
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(id)
          return
        }
      }
      if (window.scrollY < 300) {
        setActiveSection('')
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [mode])

  const handleNav = (id) => {
    setActiveSection(id)
    if (scrollToSection) {
      scrollToSection(id)
    } else {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        window.history.replaceState(null, '', `#${id}`)
      }
    }
  }


  return (
    /* ── DESKTOP FLOATING CAPSULE NAVBAR (top center, hidden on mobile) ── */
    <nav 
      aria-label="Main navigation" 
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center transition-all duration-300 opacity-100 translate-y-0"
    >
      <div className="flex items-center bg-[#FBF9F5]/90 backdrop-blur-md border border-[#E5DFD5] rounded-full p-1.5 shadow-[0_8px_30px_rgba(20,19,18,0.06)]">
        {/* Section Navigation Items */}
        <ul role="list" className="flex items-center gap-1 list-none m-0 p-0">
          {currentNavItems.map((item) => {
            const isActive = activeSection === item.id
            return (
              <li key={item.id} className="contents">
                <button
                  id={`nav-${item.id}`}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center justify-center px-3.5 py-1.5 rounded-full font-headline text-[11.5px] tracking-wider uppercase font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#141312] text-white shadow-sm'
                      : 'text-[#5C574F] hover:text-[#141312] hover:bg-[#F3EFE9]'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>

      </div>
    </nav>
  )
}
