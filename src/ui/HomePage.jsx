import React, { useState } from 'react'
import {
  profile,
  careerJourney,
  credentialsShelf,
  projectsCatalog,
  techStackLogos,
} from '../data/karthik.js'
import PersonalSection from './PersonalSection.jsx'
import ContactSection from './ContactSection.jsx'

export default function HomePage({ scrollToSection, mode = 'professional', setMode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleScroll = (id) => {
    setIsMenuOpen(false)
    if (scrollToSection) {
      scrollToSection(id)
    } else {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleModeToggle = (newMode) => {
    setIsMenuOpen(false)
    if (setMode) {
      setMode(newMode)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      window.history.replaceState(null, '', newMode === 'personal' ? '#personal' : '#hero')
    }
  }

  const ustJob = careerJourney[0]

  return (
    <div className="w-full flex flex-col items-center bg-[#FBF9F5] text-[#141312]">
      
      {/* ── TOP IDENTITY BAR ── */}
      <header className="sticky top-0 z-40 w-full border-b border-[#E5DFD5]/80 bg-[#FBF9F5]/90 backdrop-blur-md">
        <div className="flex items-center justify-between px-5 sm:px-10 lg:px-14 py-3.5 sm:py-4 w-full max-w-[1560px] mx-auto">
          {/* Monogram Brand */}
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => handleScroll(mode === 'professional' ? 'hero' : 'personal')}>
            <span className="font-notch text-[26px] sm:text-[30px] font-extrabold tracking-tight text-[#141312] leading-none select-none group-hover:text-[#E03E2D] transition-colors">
              KN<span className="text-[#E03E2D]">.</span>
            </span>
          </div>

          {/* Right: Mode Switcher (desktop only) + Menu Button */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Mode switcher — desktop only */}
            <div className="hidden md:flex items-center bg-[#EFEAE1] p-0.5 rounded-full border border-[#E5DFD5]/60 shadow-2xs">
              <button
                type="button"
                onClick={() => handleModeToggle('professional')}
                className={`px-3.5 py-1 rounded-full text-[11px] font-headline uppercase tracking-wider font-bold transition-all cursor-pointer ${
                  mode === 'professional'
                    ? 'bg-[#141312] text-white shadow-xs'
                    : 'text-[#5C574F] hover:text-[#141312]'
                }`}
              >
                Professional
              </button>
              <button
                type="button"
                onClick={() => handleModeToggle('personal')}
                className={`px-3.5 py-1 rounded-full text-[11px] font-headline uppercase tracking-wider font-bold transition-all cursor-pointer ${
                  mode === 'personal'
                    ? 'bg-[#E03E2D] text-white shadow-xs'
                    : 'text-[#5C574F] hover:text-[#141312]'
                }`}
              >
                Personal
              </button>
            </div>

            {/* Hamburger — mobile only */}
            <button
              type="button"
              aria-label="Toggle navigation drawer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-9 h-9 rounded-full border border-[#E5DFD5] bg-white/80 hover:bg-white flex flex-col items-center justify-center gap-1.5 transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer md:hidden"
            >
              <span className="w-4 h-[1.5px] bg-[#141312] rounded-full"></span>
              <span className="w-4 h-[1.5px] bg-[#141312] rounded-full"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fadeIn" onClick={() => setIsMenuOpen(false)}>
          <div className="w-[min(100vw,360px)] bg-[#FBF9F5] h-full shadow-2xl flex flex-col border-l border-[#E5DFD5]" onClick={e => e.stopPropagation()}>
            {/* Drawer header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-[#E5DFD5]">
              <span className="font-notch text-2xl font-extrabold text-[#141312]">KN<span className="text-[#E03E2D]">.</span></span>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="w-8 h-8 rounded-full border border-[#E5DFD5] bg-white flex items-center justify-center text-sm font-bold text-[#141312] hover:bg-[#F3EFE9] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Mode switcher — mobile only */}
            <div className="px-7 py-5 border-b border-[#E5DFD5]">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#8C857B] font-bold block mb-3">Mode</span>
              <div className="flex items-center bg-[#EFEAE1] p-0.5 rounded-full border border-[#E5DFD5]/60 w-full">
                <button
                  type="button"
                  onClick={() => handleModeToggle('professional')}
                  className={`flex-1 py-2 rounded-full text-[11px] font-headline uppercase tracking-wider font-bold transition-all cursor-pointer ${
                    mode === 'professional' ? 'bg-[#141312] text-white shadow-xs' : 'text-[#5C574F]'
                  }`}
                >
                  Professional
                </button>
                <button
                  type="button"
                  onClick={() => handleModeToggle('personal')}
                  className={`flex-1 py-2 rounded-full text-[11px] font-headline uppercase tracking-wider font-bold transition-all cursor-pointer ${
                    mode === 'personal' ? 'bg-[#E03E2D] text-white shadow-xs' : 'text-[#5C574F]'
                  }`}
                >
                  Personal
                </button>
              </div>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col gap-1 px-5 py-6 flex-1">
              {(mode === 'professional'
                ? [
                    { id: 'hero', num: '01', label: 'Overview' },
                    { id: 'experience', num: '02', label: 'Experience' },
                    { id: 'certifications', num: '03', label: 'Certifications' },
                    { id: 'projects', num: '04', label: 'Projects' },
                    { id: 'resume', num: '05', label: 'Resume & CV' },
                    { id: 'contact', num: '06', label: 'Get in Touch' },
                  ]
                : [
                    { id: 'personal', num: '01', label: 'Off the Clock' },
                    { id: 'bucket-list', num: '02', label: 'Travel Map' },
                    { id: 'photos', num: '03', label: 'Camera Roll' },
                    { id: 'contact', num: '04', label: 'Get in Touch' },
                  ]
              ).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleScroll(item.id)}
                  className="text-left py-3 px-3 rounded-xl font-headline font-semibold text-[15px] text-[#5C574F] hover:text-[#141312] hover:bg-[#F3EFE9] transition-all flex items-center gap-4 group cursor-pointer"
                >
                  <span className="font-mono text-[10px] text-[#8C857B] group-hover:text-[#E03E2D] w-6">{item.num}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          PROFESSIONAL MODE VIEW
      ══════════════════════════════════════════════════════════════════════ */}
      <div key={mode} className="w-full flex flex-col items-center animate-fadeIn">
      {mode === 'professional' ? (
        <>
          {/* 1. HERO / LANDER SECTION — Grounded, High-Impact First Impression */}
          <section 
            id="hero"
            className="w-full min-h-[calc(100dvh-65px)] lg:h-[calc(100dvh-65px)] bg-[#FBF9F5] relative overflow-hidden border-b border-[#E5DFD5] flex flex-col justify-center"
          >
            {/* Subtle Architectural Dot Grid Canvas */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-35"
              style={{
                backgroundImage: 'radial-gradient(#D9D2C7 1.2px, transparent 1.2px)',
                backgroundSize: '32px 32px',
              }}
            />

            {/* Architectural Crosshair Grid Markers */}
            <div className="absolute top-10 left-10 font-mono text-[11px] text-[#8C857B]/50 pointer-events-none select-none hidden sm:block">+</div>
            <div className="absolute bottom-16 left-10 font-mono text-[11px] text-[#8C857B]/50 pointer-events-none select-none hidden sm:block">+</div>

            {/* Warm ambient diffused glow behind centerpiece */}
            <div 
              className="absolute top-1/2 right-[18%] -translate-y-1/2 w-[700px] h-[700px] pointer-events-none opacity-30 mix-blend-multiply filter blur-[80px]"
              style={{
                background: 'radial-gradient(circle, rgba(210,198,182,0.95) 0%, rgba(224,62,45,0.12) 40%, transparent 70%)'
              }}
            />


            {/* ── MAIN HERO BODY ── */}
            <div className="relative z-20 flex-1 flex items-center px-5 sm:px-10 lg:px-14 xl:px-16 max-w-[1560px] mx-auto w-full py-10 sm:py-14 lg:py-0">
              
              {/* Left Narrative Block */}
              <div className="w-full lg:max-w-[560px] xl:max-w-[620px] flex flex-col justify-center z-20">

                {/* Mobile Hero Header Row: Title on Left, Prominent Photo on Right (below lg) */}
                <div className="flex lg:hidden items-center justify-between gap-3 sm:gap-6 w-full mb-3 select-none">
                  {/* Left: Kicker + Title */}
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="w-2 h-2 rounded-full bg-[#E03E2D] animate-pulse"></span>
                      <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.16em] text-[#8C857B] font-bold">
                        Karthik NP · UST Global
                      </span>
                    </div>
                    <h1 className="font-notch font-extrabold text-[27px] sm:text-[40px] leading-[0.95] text-[#141312] tracking-tight">
                      Architecting<br />
                      Data<br />
                      Lakehouses<span className="text-[#E03E2D]">.</span>
                    </h1>
                    <span className="font-mono text-[9px] sm:text-[10px] text-[#5C574F] uppercase tracking-wider font-semibold mt-2">
                      Azure Data Engineer
                    </span>
                  </div>

                  {/* Right: Prominent Arch Photo */}
                  <div className="shrink-0 flex items-center justify-end">
                    <div
                      className="relative w-[138px] sm:w-[175px] h-[180px] sm:h-[220px] rounded-t-[75px] sm:rounded-t-[95px] overflow-hidden shadow-[0_16px_36px_rgba(20,19,18,0.22)] border border-[#D5CDBD]"
                      style={{ background: 'linear-gradient(180deg, #DED7CD 0%, #C9C1B4 60%, #B3A99B 100%)' }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/15 via-transparent to-white/20 pointer-events-none" />
                      <img
                        src="/karthik-hero-new.png"
                        alt="Karthik NP"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[126%] w-auto object-contain object-bottom drop-shadow-[0_10px_20px_rgba(20,19,18,0.25)]"
                        loading="eager"
                      />
                    </div>
                  </div>
                </div>

                {/* Desktop Display Headline (visible only on lg+) */}
                <h1 className="hidden lg:flex flex-col tracking-tight select-none">
                  <span className="font-notch font-extrabold lg:text-[64px] xl:text-[76px] leading-[0.92] text-[#141312] tracking-tight">
                    Architecting Data
                  </span>
                  <span className="font-notch font-extrabold lg:text-[64px] xl:text-[76px] leading-[0.92] text-[#141312] tracking-tight">
                    Lakehouses<span className="text-[#E03E2D]">.</span>
                  </span>
                </h1>

                {/* Subtitle / Quote — both mobile & desktop */}
                <div className="font-editorial italic font-normal text-[20px] sm:text-[32px] lg:text-[48px] xl:text-[56px] leading-[1.08] text-[#2B2825] mt-1 lg:mt-1.5">
                  Engineered for Real-World Scale.
                </div>

                {/* Bio */}
                <p className="font-headline text-[13.5px] sm:text-[15px] leading-[23px] sm:leading-[27px] text-[#5C574F] max-w-[510px] mt-4 sm:mt-5 font-normal">
                  Azure Data Engineer at <strong className="font-bold text-[#141312]">UST Global</strong> building Medallion lakehouses with <strong className="font-semibold text-[#141312]">Databricks</strong>, <strong className="font-semibold text-[#141312]">PySpark</strong>, and <strong className="font-semibold text-[#141312]">Kafka</strong>. Focused on data reliability, streaming architectures, and operational automation.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 mt-6 sm:mt-7">
                  <button
                    type="button"
                    onClick={() => handleScroll('experience')}
                    className="btn-primary text-[13px] sm:text-[14px] px-5 py-3 sm:px-6 sm:py-3.5 shadow-md hover:shadow-lg transition-all group cursor-pointer"
                  >
                    <span>View Experience</span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-y-0.5 transition-transform">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <polyline points="19 12 12 19 5 12"></polyline>
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleScroll('projects')}
                    className="btn-secondary text-[13px] sm:text-[14px] px-4 py-3 sm:px-5 sm:py-3.5 cursor-pointer"
                  >
                    <span>Projects</span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                  </button>
                </div>


          </div>
        </div>

        {/* ── DESKTOP SCULPTURAL CENTERPIECE ── */}
        <div className="hidden lg:flex absolute bottom-0 right-0 xl:right-[2%] 2xl:right-[6%] h-[88%] xl:h-[92%] 2xl:h-[94%] pointer-events-none z-10 items-end justify-end select-none">
          
          {/* Architectural Stone Arch Monolith */}
          <div 
            className="absolute bottom-0 right-[8%] xl:right-[12%] w-[400px] xl:w-[460px] 2xl:w-[500px] h-[86%] rounded-t-[260px] shadow-[-20px_25px_60px_rgba(20,19,18,0.08)] border border-[#D5CDBD] overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #DED7CD 0%, #C9C1B4 50%, #B3A99B 100%)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-black/15 via-transparent to-white/20" />
          </div>

          {/* Master Photographic Cutout */}
          <img
            src="/karthik-hero-new.png"
            alt="Karthik NP — Azure Data Engineer"
            className="relative bottom-0 right-0 h-full w-auto max-w-none object-contain object-bottom drop-shadow-[0_25px_50px_rgba(20,19,18,0.22)] z-10"
            loading="eager"
            decoding="async"
          />

        </div>

      </section>

      {/* ── PRODUCTION LOGO MARQUEE ── */}
      <section className="w-full border-b border-[#E5DFD5] py-4 bg-[#FBF9F5] overflow-hidden">
        <div className="mask-marquee w-full flex overflow-hidden">
          <div className="flex shrink-0 items-center gap-8 md:gap-12 animate-marquee-left whitespace-nowrap py-1">
            {techStackLogos.concat(techStackLogos).map((tech, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-white border border-[#E5DFD5] shadow-2xs group cursor-default">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E03E2D]"></span>
                <span className="font-headline text-[13px] md:text-[14px] font-semibold text-[#141312] group-hover:text-[#E03E2D] transition-colors">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          2. EXPERIENCE SECTION — Clean, Factual Production Record
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="experience" className="w-full border-b border-[#E5DFD5] py-16 sm:py-20 px-5 sm:px-10 flex flex-col items-center">
        <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-7 sm:gap-8">
          <div className="flex flex-col">
            <span className="section-kicker">[ 01 // EXPERIENCE ]</span>
            <h2 className="section-title mt-1.5">
              Production Track Record <span className="text-[#E03E2D]">at UST Global</span>.
            </h2>
          </div>

          {/* Master Experience Card */}
          <div className="p-8 sm:p-12 rounded-[28px] bg-white border border-[#E5DFD5] shadow-sm flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5DFD5] pb-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#E03E2D] font-bold">
                  {ustJob.company} • {ustJob.location}
                </span>
                <h3 className="font-notch text-[26px] sm:text-[32px] font-bold text-[#141312] mt-1">
                  {ustJob.role}
                </h3>
              </div>
              <span className="font-mono text-xs px-4 py-1.5 rounded-full bg-[#F3EFE9] text-[#141312] border border-[#E5DFD5] font-semibold self-start sm:self-auto">
                {ustJob.period} • {ustJob.type}
              </span>
            </div>

            <p className="font-headline text-[15px] leading-[26px] text-[#5C574F]">
              {ustJob.description}
            </p>

            {/* Key Achievements */}
            <div className="flex flex-col gap-3 font-headline text-[14px] text-[#5C574F]">
              {ustJob.achievements.map((ach, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rotate-45 bg-[#E03E2D] mt-2 shrink-0"></span>
                  <span className="leading-relaxed">{ach}</span>
                </div>
              ))}
            </div>

            {/* Production Tech Stack */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-[#E5DFD5]">
              <span className="text-xs font-mono text-[#8C857B] self-center mr-2 uppercase font-semibold">Stack:</span>
              {ustJob.tech.map((t, idx) => (
                <span key={idx} className="badge-tech font-semibold">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          3. CERTIFICATION SECTION — 5 Verified Cloud Credentials & Honors
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="certifications" className="w-full border-b border-[#E5DFD5] py-20 px-6 sm:px-10 flex flex-col items-center">
        <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-8">
          <div className="flex flex-col">
            <span className="section-kicker">
              [ 02 // CERTIFICATIONS ]
            </span>
            <h2 className="section-title mt-1.5">
              Verified Cloud Credentials <span className="text-[#5C574F]">& Honors</span>.
            </h2>
            <p className="font-headline text-[15px] text-[#5C574F] max-w-[620px] mt-1.5 leading-relaxed">
              Professional certifications from Microsoft and Databricks validating deep domain expertise across data lakehouses, Delta Lake, and enterprise pipelines.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {credentialsShelf.map((cred) => (
              <div
                key={cred.id}
                className="bg-white border border-[#E5DFD5] rounded-[20px] p-4 sm:p-6 flex flex-col items-center text-center gap-2 sm:gap-3 hover:border-[#D1C8BA] hover:shadow-md transition-all shadow-2xs"
              >
                <div className="w-11 h-11 rounded-full bg-[#F3EFE9] border border-[#E5DFD5] flex items-center justify-center text-[#E03E2D] shadow-2xs">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="7" />
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                  </svg>
                </div>
                <span className="font-notch text-[15px] font-bold text-[#141312] leading-snug">{cred.title}</span>
                <span className="font-headline text-[11.5px] text-[#E03E2D] font-semibold">{cred.subtitle}</span>
                <p className="font-headline text-[12px] text-[#5C574F] pt-2 border-t border-[#E5DFD5] w-full mt-auto leading-relaxed">
                  {cred.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          4. PROJECT SECTION — 4 Production Engineering Systems (Zero Duplication)
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="projects" className="w-full py-20 px-6 sm:px-10 flex flex-col items-center">
        <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-10">
          <div className="flex flex-col">
            <span className="section-kicker">
              [ 03 // PROJECTS ]
            </span>
            <h2 className="section-title mt-1.5">
              Production Works <span className="text-[#5C574F]">& Engineering Systems</span>.
            </h2>
            <p className="font-headline text-[15px] text-[#5C574F] max-w-[620px] mt-1.5 leading-relaxed">
              Real enterprise data systems, lakehouse architectures, and automation tools built to solve high-volume data bottlenecks.
            </p>
          </div>

        {/* Projects Grid — all 4 treated equally */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {projectsCatalog.map((proj) => (
            <div
              key={proj.id}
              className="p-7 sm:p-9 rounded-[26px] border border-[#E5DFD5] bg-white flex flex-col justify-between gap-6 hover:shadow-md transition-all shadow-2xs"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#E03E2D] font-bold">
                    {proj.tag || proj.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-[#F3EFE9] border border-[#E5DFD5] text-[#141312] font-semibold">
                    {proj.badge}
                  </span>
                </div>

                <h3 className="font-notch text-[22px] sm:text-[26px] font-bold text-[#141312] leading-snug">
                  {proj.name}<span className="text-[#E03E2D]">.</span>
                </h3>

                <p className="font-headline text-[13.5px] leading-[23px] text-[#5C574F]">
                  {proj.description || (proj.points && proj.points[0])}
                </p>
              </div>

              {/* Metrics Row */}
              {proj.metrics && (
                <div className="grid grid-cols-3 gap-2 border-y border-[#E5DFD5] py-3">
                  {proj.metrics.map((m, idx) => (
                    <div key={idx} className="flex flex-col">
                      <span className="text-[10px] font-mono uppercase text-[#8C857B] font-semibold">{m.label}</span>
                      <span className="font-notch text-[18px] font-bold text-[#141312]">{m.value}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-1.5">
                {(proj.stack || []).map((t, i) => (
                  <span key={i} className="badge-tech">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          4. RESUME / CV SECTION — Official Record & Instant One-Click Download
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="resume" className="w-full border-b border-[#E5DFD5] py-20 px-6 sm:px-10 flex flex-col items-center bg-[#F8F5EE]/40">
        <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-8">
          
          {/* Section Kicker & Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="flex flex-col">
              <span className="section-kicker">
                [ 04 // CURRICULUM VITAE ]
              </span>
              <h2 className="section-title mt-1.5">
                Official Resume <span className="text-[#E03E2D]">& Credentials</span>.
              </h2>
              <p className="font-headline text-[15px] text-[#5C574F] max-w-[620px] mt-1.5 leading-relaxed">
                Directly download or inspect the full verified record: enterprise lakehouse production track record at UST Global, cloud accreditations, and technical proficiencies.
              </p>
            </div>

            {/* Quick Download & Print Buttons */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href="/karthik_np_resume.pdf"
                download="Karthik_NP_Data_Engineer_Resume.pdf"
                className="btn-primary shadow-md hover:shadow-lg transition-all"
                title="Download verified PDF resume"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Download Resume (PDF)</span>
              </a>

              <a
                href="/resume_print.html"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                title="Open clean printable view"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                <span>View Full CV</span>
              </a>
            </div>
          </div>

          {/* Master Resume Preview Document Card */}
          <div className="bg-white border border-[#E5DFD5] rounded-[28px] p-7 sm:p-12 shadow-[0_16px_40px_rgba(20,19,18,0.04)] flex flex-col gap-8">
            
            {/* Top Identity Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5DFD5] pb-6">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="font-notch text-[26px] sm:text-[32px] font-bold text-[#141312]">
                    Karthik NP
                  </h3>
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-[#FEF2F2] border border-[#FEE2E2] text-[#DC2626]">
                    Active · UST Global
                  </span>
                </div>
                <span className="font-headline text-[15px] font-semibold text-[#E03E2D] mt-0.5">
                  Azure Data Engineer &middot; 2+ Years Enterprise Experience
                </span>
                <span className="font-headline text-[13px] text-[#8C857B] mt-0.5">
                  Trivandrum, Kerala, India &middot; Open to High-Impact Data Engineering Roles
                </span>
              </div>

              {/* Direct Quick Actions inside Card */}
              <div className="flex items-center gap-3">
                <a
                  href="/karthik_np_resume.pdf"
                  download="Karthik_NP_Data_Engineer_Resume.pdf"
                  className="px-4 py-2 rounded-full bg-[#141312] text-white hover:bg-[#2B2825] text-[12px] font-headline font-semibold flex items-center gap-2 shadow-xs transition-all"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Quick PDF</span>
                </a>
                <a
                  href="https://linkedin.com/in/karthik-np"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full border border-[#E5DFD5] bg-[#FBF9F5] hover:bg-[#F3EFE9] text-[#141312] text-[12px] font-headline font-semibold flex items-center gap-2 transition-all"
                >
                  <span>LinkedIn Profile</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </div>
            </div>

            {/* 4 Core Highlight Columns / Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Box 1: Experience */}
              <div className="p-5 rounded-2xl bg-[#FBF9F5] border border-[#E5DFD5] flex flex-col justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] text-[#8C857B] uppercase tracking-wider font-bold">Current Role</span>
                  <h4 className="font-notch text-[16px] font-bold text-[#141312]">Data Engineer</h4>
                  <span className="font-mono text-[11px] text-[#E03E2D] font-semibold">UST Global</span>
                  <p className="font-headline text-[12px] text-[#5C574F] mt-1 leading-relaxed">
                    Aug 2024 – Present &middot; Retail data modernization, Azure Databricks Medallion lakehouses, 2M+ records/day.
                  </p>
                </div>
                <div className="pt-2 border-t border-[#E5DFD5]/60 font-mono text-[10px] text-[#8C857B]">
                  Full-time &middot; Trivandrum
                </div>
              </div>

              {/* Box 2: Certifications */}
              <div className="p-5 rounded-2xl bg-[#FBF9F5] border border-[#E5DFD5] flex flex-col justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] text-[#8C857B] uppercase tracking-wider font-bold">Cloud Credentials</span>
                  <h4 className="font-notch text-[16px] font-bold text-[#141312]">4x Certified</h4>
                  <span className="font-mono text-[11px] text-[#E03E2D] font-semibold">Databricks & Microsoft</span>
                  <p className="font-headline text-[12px] text-[#5C574F] mt-1 leading-relaxed">
                    Databricks Data Engineer Assoc, Azure DP-203, Microsoft Fabric DP-700 & DP-600.
                  </p>
                </div>
                <div className="pt-2 border-t border-[#E5DFD5]/60 font-mono text-[10px] text-[#8C857B]">
                  Verified Cloud Badges
                </div>
              </div>

              {/* Box 3: Technical Skills */}
              <div className="p-5 rounded-2xl bg-[#FBF9F5] border border-[#E5DFD5] flex flex-col justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] text-[#8C857B] uppercase tracking-wider font-bold">Core Competencies</span>
                  <h4 className="font-notch text-[16px] font-bold text-[#141312]">Lakehouses & Streams</h4>
                  <span className="font-mono text-[11px] text-[#E03E2D] font-semibold">Spark &middot; Kafka &middot; Delta</span>
                  <p className="font-headline text-[12px] text-[#5C574F] mt-1 leading-relaxed">
                    PySpark, SQL, Delta Lake, Kafka 100K+ events/hr, ADF, Snowflake, CI/CD, Claude Code.
                  </p>
                </div>
                <div className="pt-2 border-t border-[#E5DFD5]/60 font-mono text-[10px] text-[#8C857B]">
                  High-Throughput ETL
                </div>
              </div>

              {/* Box 4: Education */}
              <div className="p-5 rounded-2xl bg-[#FBF9F5] border border-[#E5DFD5] flex flex-col justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] text-[#8C857B] uppercase tracking-wider font-bold">Education</span>
                  <h4 className="font-notch text-[16px] font-bold text-[#141312]">B.Tech in CS</h4>
                  <span className="font-mono text-[11px] text-[#E03E2D] font-semibold">KTU University (2020–2024)</span>
                  <p className="font-headline text-[12px] text-[#5C574F] mt-1 leading-relaxed">
                    CGPA: 8.31 &middot; Distributed Systems, Database Systems, Algorithms & Cloud Computing.
                  </p>
                </div>
                <div className="pt-2 border-t border-[#E5DFD5]/60 font-mono text-[10px] text-[#8C857B]">
                  Academic Distinction
                </div>
              </div>
            </div>

            {/* Bottom Download Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#141312] text-white">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-[#E03E2D]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-notch font-bold text-[14.5px] leading-tight">Need an ATS-ready copy for your recruiting pipeline?</span>
                  <span className="font-headline text-[12px] text-white/70">Single-page clean format &bull; Updated for 2025/2026 &bull; PDF (82 KB)</span>
                </div>
              </div>

              <a
                href="/karthik_np_resume.pdf"
                download="Karthik_NP_Data_Engineer_Resume.pdf"
                className="px-6 py-2.5 rounded-full bg-[#E03E2D] hover:bg-[#c93526] text-white font-headline font-bold text-[13px] tracking-wide transition-all shadow-md shrink-0 flex items-center gap-2 cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Download Resume</span>
              </a>
            </div>

          </div>
        </div>
      </section>
        </>
      ) : (
        <PersonalSection onSwitchToProfessional={() => handleModeToggle('professional')} />
      )}
      </div>

      {/* ── CONTACT SECTION (Available in both modes) ── */}
      <ContactSection />

    </div>
  )
}
