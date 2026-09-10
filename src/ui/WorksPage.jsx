import React, { useState } from 'react'
import {
  projectsCatalog,
  flagshipProject,
  engineeringProcess,
} from '../data/karthik.js'

export default function WorksPage({ setActivePage }) {
  const [activeFilter, setActiveFilter] = useState('All')

  const categories = [
    { id: 'All', label: 'All Projects (4)' },
    { id: 'Data Pipelines', label: 'Data Pipelines (2)' },
    { id: 'Streaming & Automation', label: 'Streaming & Automation (2)' },
  ]

  // Clean deduplication: when All is active, the top spotlight features flagshipProject,
  // and the grid below displays the remaining projects. When filtered, displays all matches.
  const gridProjects = activeFilter === 'All'
    ? projectsCatalog.slice(1)
    : projectsCatalog.filter(p => p.category === activeFilter)

  return (
    <div className="w-full flex flex-col items-center bg-[#FBF9F5] text-[#141312]">
      {/* ── PAGE HEADER ── */}
      <section className="w-full max-w-[1200px] pt-28 sm:pt-36 pb-8 px-6 sm:px-10 flex flex-col items-center text-center gap-3">
        <span className="section-kicker">
          [ PORTFOLIO & PRODUCTION WORKS ]
        </span>
        <h1 className="font-notch text-[36px] sm:text-[50px] md:text-[62px] leading-[1.06] font-extrabold tracking-tight text-[#141312]">
          real pipelines. <span className="font-editorial italic font-normal text-[#141312]">real scale</span><span className="text-[#E03E2D]">.</span>
        </h1>
        <p className="font-headline text-[15px] sm:text-[16.5px] text-[#5C574F] max-w-[640px] leading-relaxed">
          Battle-tested Medallion lakehouses, real-time Kafka streaming engines, and metadata automation tools built to solve enterprise bottlenecks — with zero fluff.
        </p>
      </section>

      {/* ── CATEGORY FILTER ROW ── */}
      <section className="w-full max-w-[1200px] px-6 sm:px-10 py-3 flex justify-center">
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-full bg-white border border-[#E5DFD5] shadow-2xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveFilter(cat.id)}
              className={`px-4 sm:px-5 py-1.5 rounded-full font-headline text-[12px] md:text-[13px] tracking-wide uppercase font-semibold transition-all duration-200 cursor-pointer ${
                activeFilter === cat.id
                  ? 'bg-[#141312] text-white shadow-xs'
                  : 'text-[#5C574F] hover:text-[#141312] hover:bg-[#F3EFE9]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── FEATURED SPOTLIGHT CARD (Tableau to Sigma Migration Automation POC) ── */}
      {activeFilter === 'All' && (
        <section className="w-full max-w-[1200px] py-6 px-6 sm:px-10">
          <div className="p-8 sm:p-12 rounded-[28px] bg-white border border-[#E5DFD5] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 flex flex-col gap-5">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase text-[#E03E2D] font-bold tracking-wider">
                <span>Featured Automation POC</span>
                <span className="w-1.5 h-1.5 rotate-45 bg-[#E03E2D]"></span>
                <span className="text-[#8C857B]">{flagshipProject.tag}</span>
              </div>

              <div>
                <h2 className="font-notch text-[30px] sm:text-[38px] font-bold text-[#141312] leading-tight">
                  {flagshipProject.name}<span className="text-[#E03E2D]">.</span>
                </h2>
                <p className="font-headline text-[14px] text-[#5C574F] font-medium mt-1">
                  Automating enterprise BI migration with Claude Code, Python, and Metadata APIs
                </p>
              </div>

              <p className="font-headline text-[14px] leading-[25px] text-[#5C574F]">
                {flagshipProject.description}
              </p>

              {/* Metrics Row */}
              <div className="grid grid-cols-3 gap-3 border-y border-[#E5DFD5] py-3.5">
                {flagshipProject.metrics.map((m, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-[10px] font-mono uppercase text-[#8C857B] font-semibold">{m.label}</span>
                    <span className="font-notch text-[18px] sm:text-[20px] font-bold text-[#141312]">{m.value}</span>
                  </div>
                ))}
              </div>

              {/* Stack & Button */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <div className="flex flex-wrap gap-1.5">
                  {flagshipProject.stack.map((s, idx) => (
                    <span key={idx} className="badge-tech">
                      {s}
                    </span>
                  ))}
                </div>

                <a
                  href={flagshipProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-xs"
                >
                  <span>Explore Workflow</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </a>
              </div>
            </div>

            {/* Architecture Flow Diagram (Vaibhav / Technical Precision) */}
            <div className="lg:col-span-5 bg-[#F3EFE9] border border-[#E5DFD5] rounded-[22px] p-6 sm:p-7 flex flex-col justify-between h-[360px] shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD5]">
                <span className="font-mono text-[11px] font-bold text-[#141312]">AUTOMATION PIPELINE DAG</span>
                <span className="badge-status">● VALIDATED</span>
              </div>

              <div className="flex flex-col gap-3 my-auto">
                <div className="p-3.5 rounded-xl bg-white border border-[#E5DFD5] flex items-center justify-between text-[12px] font-headline shadow-2xs">
                  <div>
                    <span className="font-bold text-[#141312] block">Tableau Metadata API</span>
                    <span className="text-[10.5px] text-[#8C857B] font-mono">Worksheets & Calculations</span>
                  </div>
                  <span className="badge-tech text-[10px]">SOURCE</span>
                </div>

                <div className="flex justify-center text-[#E03E2D]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <polyline points="19 12 12 19 5 12"></polyline>
                  </svg>
                </div>

                <div className="p-3.5 rounded-xl bg-[#141312] text-white flex items-center justify-between text-[12px] font-headline shadow-xs">
                  <div>
                    <span className="font-bold block">Claude Code Engine</span>
                    <span className="text-[10.5px] text-white/70 font-mono">Python Formula Parsing</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-white">TRANSFORM</span>
                </div>

                <div className="flex justify-center text-[#E03E2D]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <polyline points="19 12 12 19 5 12"></polyline>
                  </svg>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E5DFD5] flex items-center justify-between text-[12px] font-headline shadow-2xs">
                  <div>
                    <span className="font-bold text-[#141312] block">Sigma & Snowflake</span>
                    <span className="text-[10.5px] text-emerald-700 font-mono font-bold">100% KPI Parity</span>
                  </div>
                  <span className="badge-tech text-[10px]">SINK</span>
                </div>
              </div>

              <span className="text-[11px] font-mono text-[#8C857B] text-center border-t border-[#E5DFD5] pt-2">
                Automated formula translation with zero schema drift
              </span>
            </div>

          </div>
        </section>
      )}

      {/* ── WORKS CATALOG GRID (Zero Duplicates) ── */}
      <section className="w-full max-w-[1200px] py-8 px-6 sm:px-10 flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {gridProjects.map((proj) => (
            <div
              key={proj.id}
              className="p-8 sm:p-9 rounded-[28px] border border-[#E5DFD5] bg-white flex flex-col justify-between gap-6 transition-all hover:shadow-md hover:border-[#D1C8BA] shadow-2xs"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase text-[#8C857B] font-semibold">
                    <span>{proj.category}</span>
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#E03E2D]"></span>
                    <span>{proj.tag}</span>
                  </div>
                  <span className="badge-tech font-bold">
                    {proj.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-notch text-[24px] sm:text-[28px] font-bold text-[#141312] leading-tight">
                    {proj.name}<span className="text-[#E03E2D]">.</span>
                  </h3>
                  <p className="font-headline text-[14px] leading-[24px] text-[#5C574F] mt-2">
                    {proj.description}
                  </p>
                </div>

                {/* Key Metrics Bar */}
                {proj.metrics && (
                  <div className="grid grid-cols-3 gap-2 border-y border-[#E5DFD5] py-3 my-1">
                    {proj.metrics.map((m, idx) => (
                      <div key={idx} className="flex flex-col">
                        <span className="text-[10px] font-mono uppercase text-[#8C857B] font-semibold">{m.label}</span>
                        <span className="font-notch text-[16px] sm:text-[18px] font-bold text-[#141312]">{m.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Achievement points */}
                <div className="flex flex-col gap-2 font-headline text-[13px] text-[#5C574F] pt-1">
                  {proj.points.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rotate-45 bg-[#E03E2D] mt-1.5 shrink-0"></span>
                      <span className="leading-relaxed">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom footer: Stack + Link */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-[#E5DFD5]">
                <div className="flex flex-wrap gap-1.5">
                  {proj.stack.map((s, idx) => (
                    <span key={idx} className="badge-tech">
                      {s}
                    </span>
                  ))}
                </div>

                <a
                  href={proj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary shrink-0 text-xs py-2 px-4"
                >
                  <span>{proj.linkText}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4-STEP ENGINEERING METHODOLOGY ── */}
      <section className="w-full max-w-[1200px] py-16 px-6 sm:px-10 border-t border-[#E5DFD5] flex flex-col gap-8">
        <div className="flex flex-col">
          <span className="section-kicker">
            [ METHODOLOGY ]
          </span>
          <h2 className="section-title mt-1.5">
            How good data engineering <span className="text-[#5C574F]">actually happens</span>.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {engineeringProcess.map((step) => (
            <div
              key={step.step}
              className="p-6 rounded-[24px] bg-white border border-[#E5DFD5] flex flex-col justify-between gap-5 shadow-2xs hover:border-[#D1C8BA] hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD5]">
                <span className="font-notch text-[26px] font-bold text-[#E03E2D] leading-none">
                  {step.step}
                </span>
                <span className="font-headline text-[12px] font-bold text-[#141312] uppercase tracking-wider">
                  {step.name}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="font-notch text-[17px] font-bold text-[#141312]">
                  {step.title}
                </h4>
                <p className="font-headline text-[13px] leading-[22px] text-[#5C574F]">
                  {step.description}
                </p>
              </div>
              <div className="pt-2 border-t border-[#E5DFD5] text-[10.5px] font-mono text-[#8C857B]">
                Stage Verified in Production
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
