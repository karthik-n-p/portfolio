import React, { useState } from 'react'
import {
  profile,
  careerJourney,
  toolsMatrix,
  credentialsShelf,
  educationList,
  workoutStatus,
  photographyGallery,
} from '../data/karthik.js'
import {
  indiaStates,
  coveredStateIds,
  coveredStatesSummary,
  destinationPins,
  indiaViewBoxes,
} from '../data/indiaMapData.js'

// ── CHEEKY & HUMAN ENGINEERING HOT TAKES (Inspired by AskUmi & UX Dularia) ──
const lifeHotTakes = [
  {
    quote: "90% of enterprise data engineering is politely explaining why a 50MB spreadsheet with 400 merged cells cannot be queried as an analytical table.",
    kaomoji: "(ノಠ益ಠ)ノ彡┻━┻",
    topic: "The Excel Struggle",
    tag: "Real World ETL"
  },
  {
    quote: "Deadlifts are technically just manual ETL: Extract barbell from floor, Transform through gravity, Load into posterior chain.",
    kaomoji: "(ง •̀_•́)ง",
    topic: "Gym Logic",
    tag: "Iron & Algorithms"
  },
  {
    quote: "Leg day is significantly more agonizing than a multi-node Apache Spark shuffle spill.",
    kaomoji: "🏋️‍♂️",
    topic: "Leg Day vs Spark",
    tag: "High Latency"
  },
  {
    quote: "If a production pipeline crashes at 2 AM on a Saturday, it was 100% DNS or someone renamed a column in an upstream DB without warning anyone.",
    kaomoji: "🤦‍♂️",
    topic: "Incident Response",
    tag: "Production Truths"
  },
  {
    quote: "South Indian filter coffee isn't a morning beverage; it's a high-throughput streaming protocol directly into the central nervous system.",
    kaomoji: "☕",
    topic: "Caffeine Architecture",
    tag: "Ingestion Protocol"
  },
  {
    quote: "Touching grass in Manali with 0 cellular bars is the highest emotional and mental uptime known to humankind.",
    kaomoji: "🏔️",
    topic: "Himalayan Recharge",
    tag: "100% Mental SLA"
  },
  {
    quote: "My camera roll is 10% misty mountain landscapes and 90% whiteboards with pipeline DAG sketches that look like modern art.",
    kaomoji: "📸",
    topic: "Visual Memory",
    tag: "Camera Roll"
  },
  {
    quote: "Never trust a SQL query that runs in 12ms on the first try. It definitely returned zero rows.",
    kaomoji: "👀",
    topic: "Developer Paranoia",
    tag: "Golden Rule"
  }
]

// ── MUSIC & FOCUS PLAYLIST MOODS ──
const focusSoundtracks = [
  { genre: "Synthwave & Retrowave", track: "Nightfall Pipeline Run", vibe: "Laser focus for midnight Databricks debugging", bpm: "128 BPM" },
  { genre: "Deep Lo-Fi Chill", track: "Coffee & Jupyter Notebooks", vibe: "Flow state for Python metadata automation", bpm: "85 BPM" },
  { genre: "Atmospheric Post-Rock", track: "Western Ghats Fog", vibe: "Winding down after a 100K event Kafka stream launch", bpm: "95 BPM" },
]

export default function AboutPage({ setActivePage }) {
  const [activeTab, setActiveTab] = useState('professional') // 'professional' | 'personal'
  const [mapView, setMapView] = useState('allIndia') // 'allIndia' | 'southIndia' | 'northIndia'
  const [selectedPin, setSelectedPin] = useState(destinationPins[0]) // Manali default
  const [hoveredState, setHoveredState] = useState(null)
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  // Interactive Personal States
  const [hotTakeIdx, setHotTakeIdx] = useState(0)
  const [reactions, setReactions] = useState({ fire: 142, tooReal: 98, chuckled: 215 })
  const [coffeeCups, setCoffeeCups] = useState(2)
  const [coffeeToast, setCoffeeToast] = useState('')
  const [musicIdx, setMusicIdx] = useState(0)
  const [activeLift, setActiveLift] = useState('deadlift') // 'deadlift' | 'squat' | 'bench' | 'run'

  const handleReact = (type) => {
    setReactions((prev) => ({ ...prev, [type]: prev[type] + 1 }))
  }

  const handleSelectPin = (pin) => {
    setSelectedPin(pin)
    if (mapView !== 'allIndia') {
      if (pin.region === 'north' && mapView !== 'northIndia') {
        setMapView('northIndia')
      } else if (pin.region === 'south' && mapView !== 'southIndia') {
        setMapView('southIndia')
      }
    }
  }

  const rollHotTake = () => {
    setHotTakeIdx((prev) => (prev + 1) % lifeHotTakes.length)
  }

  const handleBrewCoffee = () => {
    if (coffeeCups < 4) {
      setCoffeeCups((prev) => prev + 1)
      setCoffeeToast('☕ Caffeine ingested! Brain overclocked to 4.2GHz.')
    } else {
      setCoffeeToast('⚠️ Daily coffee limit reached. Switching to water!')
    }
    setTimeout(() => setCoffeeToast(''), 2800)
  }

  const handleCycleMusic = () => {
    setMusicIdx((prev) => (prev + 1) % focusSoundtracks.length)
  }

  const currentHotTake = lifeHotTakes[hotTakeIdx]
  const currentMusic = focusSoundtracks[musicIdx]

  return (
    <div className="w-full flex flex-col items-center bg-[#FBF9F5] text-[#141312]">
      
      {/* ── PAGE HERO HEADER ── */}
      <section className="w-full max-w-[1200px] pt-28 sm:pt-36 pb-8 px-6 sm:px-10 flex flex-col items-center text-center gap-3">
        <span className="section-kicker">
          [ ABOUT ME ]
        </span>
        <h1 className="font-notch text-[38px] sm:text-[52px] md:text-[64px] leading-[1.04] font-extrabold tracking-tight text-[#141312]">
          two sides of one <span className="font-editorial italic font-normal text-[#141312]">engineer</span><span className="text-[#E03E2D]">.</span>
        </h1>
        <p className="font-headline text-[15px] sm:text-[16.5px] text-[#5C574F] max-w-[620px] leading-relaxed">
          The Azure Data Engineer building resilient data products by day, and the curious explorer chasing sunrises and calisthenics discipline by night.
        </p>

        {/* ── DUAL MODE TOGGLE PILL ── */}
        <div className="mt-4 p-1.5 rounded-full bg-white border border-[#E5DFD5] inline-flex items-center gap-1 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab('professional')}
            className={`px-5 py-2 rounded-full font-headline text-[12px] md:text-[13px] tracking-wider uppercase font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'professional'
                ? 'bg-[#141312] text-white shadow-xs'
                : 'text-[#5C574F] hover:text-[#141312] hover:bg-[#F3EFE9]'
            }`}
          >
            Professional
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`px-5 py-2 rounded-full font-headline text-[12px] md:text-[13px] tracking-wider uppercase font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
              activeTab === 'personal'
                ? 'bg-[#141312] text-white shadow-xs'
                : 'text-[#5C574F] hover:text-[#141312] hover:bg-[#F3EFE9]'
            }`}
          >
            <span>Personal</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-[#E03E2D] text-white font-mono font-bold">
              Fun
            </span>
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          MODE 1: PROFESSIONAL VIEW (Grounded, Human, High-Status Engineering)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'professional' && (
        <div className="w-full flex flex-col items-center animate-fadeIn">
          
          {/* 1. Core Philosophy (Deeply Human & Engaging) */}
          <section className="w-full max-w-[1200px] py-14 px-6 sm:px-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 flex flex-col">
              <span className="section-kicker">
                [ 01 // HOW I WORK ]
              </span>
              <h2 className="section-title mt-1.5">
                Architecting for scale—<span className="text-[#E03E2D]">without the fluff</span>.
              </h2>
            </div>
            <div className="lg:col-span-8 flex flex-col gap-4 font-headline text-[15px] leading-[27px] text-[#5C574F]">
              <p>
                I'm an Azure Data Engineer who loves turning messy, chaotic data into clean, predictable lakehouses that businesses can bet their decisions on. Over the last <strong className="font-bold text-[#141312]">2+ years at UST Global</strong>, I’ve spent my days inside Databricks, PySpark, and Kafka—getting massive volumes of enterprise data to move fast, stay reliable, and never drop a row.
              </p>
              <p>
                From processing <strong className="font-semibold text-[#141312]">2M+ retail records daily</strong> to eliminating <strong className="font-semibold text-[#141312]">80% of manual migration effort</strong> by building automated metadata translation tools with Claude Code, I care about solving real operational headaches.
              </p>
              
              {/* 3 Human Engineering Tenets */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 mt-2 border-t border-[#E5DFD5]">
                <div className="flex flex-col gap-1 p-4 rounded-2xl bg-white border border-[#E5DFD5] shadow-2xs">
                  <span className="font-mono text-xs font-bold text-[#E03E2D]">01 // IDEMPOTENCY</span>
                  <span className="font-headline text-[13px] font-bold text-[#141312]">No 2 AM Panic</span>
                  <p className="text-xs text-[#8C857B] leading-relaxed">If a pipeline runs twice, the outcome must be identical. Zero duplicate rows, zero drama.</p>
                </div>
                <div className="flex flex-col gap-1 p-4 rounded-2xl bg-white border border-[#E5DFD5] shadow-2xs">
                  <span className="font-mono text-xs font-bold text-[#E03E2D]">02 // AUTOMATION</span>
                  <span className="font-headline text-[13px] font-bold text-[#141312]">Build Once, Save Weeks</span>
                  <p className="text-xs text-[#8C857B] leading-relaxed">If my team has to do a manual mapping task more than twice, I build a tool for it.</p>
                </div>
                <div className="flex flex-col gap-1 p-4 rounded-2xl bg-white border border-[#E5DFD5] shadow-2xs">
                  <span className="font-mono text-xs font-bold text-[#E03E2D]">03 // COST EFFICIENCY</span>
                  <span className="font-headline text-[13px] font-bold text-[#141312]">Smart Partitioning</span>
                  <p className="text-xs text-[#8C857B] leading-relaxed">Fast Spark code is great; fast Spark code that doesn't balloon cloud bills is real engineering.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Technical Arsenal Matrix */}
          <section className="w-full max-w-[1200px] py-14 px-6 sm:px-10 border-t border-[#E5DFD5] flex flex-col gap-8">
            <div className="flex flex-col">
              <span className="section-kicker">
                [ 02 // TECHNICAL STACK ]
              </span>
              <h2 className="section-title mt-1.5">
                Skills & <span className="text-[#5C574F]">Competencies</span>.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {toolsMatrix.map((group, i) => (
                <div
                  key={i}
                  className="p-6 rounded-[24px] bg-white border border-[#E5DFD5] flex flex-col gap-4 shadow-2xs hover:shadow-md hover:border-[#D1C8BA] transition-all"
                >
                  <span className="font-notch text-[13px] uppercase font-bold text-[#141312] tracking-wider pb-2 border-b border-[#E5DFD5]">
                    {group.category}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item, idx) => (
                      <span
                        key={idx}
                        className="badge-tech"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Professional Experience */}
          <section className="w-full max-w-[1200px] py-14 px-6 sm:px-10 border-t border-[#E5DFD5] flex flex-col gap-8">
            <div className="flex flex-col">
              <span className="section-kicker">
                [ 03 // EXPERIENCE ]
              </span>
              <h2 className="section-title mt-1.5">
                Production <span className="text-[#5C574F]">Track Record</span>.
              </h2>
            </div>

            <div className="flex flex-col gap-6">
              {careerJourney.map((job, i) => (
                <div
                  key={i}
                  className="p-8 sm:p-10 rounded-[28px] bg-white border border-[#E5DFD5] shadow-sm flex flex-col gap-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5DFD5] pb-5">
                    <div>
                      <span className="font-mono text-xs uppercase tracking-wider text-[#E03E2D] font-bold">
                        {job.company} • {job.location}
                      </span>
                      <h3 className="font-notch text-[24px] sm:text-[28px] font-bold text-[#141312] mt-0.5">
                        {job.role}
                      </h3>
                    </div>
                    <span className="font-mono text-xs px-3.5 py-1 rounded-full bg-[#F3EFE9] text-[#141312] border border-[#E5DFD5] font-semibold self-start sm:self-auto">
                      {job.period}
                    </span>
                  </div>

                  <p className="font-headline text-[14px] sm:text-[15px] leading-relaxed text-[#5C574F]">
                    {job.description || job.summary}
                  </p>

                  <div className="flex flex-col gap-2.5 font-headline text-[13.5px] text-[#5C574F]">
                    {(job.achievements || job.highlights || []).map((h, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rotate-45 bg-[#E03E2D] mt-2 shrink-0"></span>
                        <span className="leading-relaxed">{h}</span>
                      </div>
                    ))}
                  </div>

                  {(job.tech || []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#E5DFD5]">
                      {job.tech.map((t, idx) => (
                        <span key={idx} className="badge-tech">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 4. Credentials & Honors */}
          <section className="w-full max-w-[1200px] py-14 px-6 sm:px-10 border-t border-[#E5DFD5] flex flex-col gap-8">
            <div className="flex flex-col">
              <span className="section-kicker">
                [ 04 // CREDENTIALS ]
              </span>
              <h2 className="section-title mt-1.5">
                Certifications & <span className="text-[#5C574F]">Honors</span>.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {credentialsShelf.map((cred) => (
                <div
                  key={cred.id}
                  className="p-6 rounded-[24px] bg-white border border-[#E5DFD5] flex flex-col justify-between gap-4 shadow-2xs hover:shadow-md hover:border-[#D1C8BA] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10.5px] uppercase font-bold text-[#E03E2D]">
                      {cred.issuer}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <div>
                    <h3 className="font-notch text-[18px] font-bold text-[#141312] leading-snug">
                      {cred.title}
                    </h3>
                    <p className="font-headline text-[13px] text-[#E03E2D] font-semibold mt-0.5">
                      {cred.subtitle}
                    </p>
                  </div>
                  <p className="font-headline text-[12.5px] leading-relaxed text-[#5C574F] pt-3 border-t border-[#E5DFD5]">
                    {cred.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Education Lineage */}
          <section className="w-full max-w-[1200px] py-14 px-6 sm:px-10 border-t border-[#E5DFD5] flex flex-col gap-8">
            <div className="flex flex-col">
              <span className="section-kicker">
                [ 05 // ACADEMIC ROOTS ]
              </span>
              <h2 className="section-title mt-1.5">
                Education & <span className="text-[#5C574F]">Foundation</span>.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {educationList.map((edu, i) => (
                <div
                  key={i}
                  className="p-7 rounded-[26px] bg-white border border-[#E5DFD5] shadow-2xs flex flex-col justify-between gap-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase text-[#8C857B] font-semibold">{edu.period}</span>
                    <span className="font-mono text-xs font-bold text-[#E03E2D]">{edu.score}</span>
                  </div>
                  <div>
                    <h3 className="font-notch text-[20px] font-bold text-[#141312]">{edu.degree}</h3>
                    <p className="font-headline text-[13.5px] text-[#5C574F] font-medium mt-0.5">{edu.institution}</p>
                  </div>
                  <p className="font-headline text-[12.5px] text-[#8C857B] pt-3 border-t border-[#E5DFD5]">
                    {edu.details}
                  </p>
                </div>
              ))}
            </div>
          </section>

        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          MODE 2: PERSONAL VIEW (Fun, Cheeky, Interactive Playground)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'personal' && (
        <div className="w-full flex flex-col items-center animate-fadeIn">
          
          {/* 1. Cheeky Narrative Kicker & Header */}
          <section className="w-full max-w-[1200px] py-12 px-6 sm:px-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 flex flex-col">
              <span className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#E03E2D] tracking-wider uppercase mb-2">
                <span>٩(^ᗜ^ )و</span>
                <span>OFF THE CLOCK</span>
                <span>(੭˃ᴗ˂)੭</span>
              </span>
              <h2 className="font-notch text-[32px] sm:text-[42px] font-extrabold text-[#141312] leading-[1.08]">
                Karthik.exe // <span className="font-editorial italic font-normal text-[#E03E2D]">human</span> after all.
              </h2>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono font-semibold self-start">
                <span>⚠️ 100% human, zero corporate fluff</span>
              </div>
            </div>
            <div className="lg:col-span-7 flex flex-col gap-3 font-headline text-[15px] leading-[26px] text-[#5C574F]">
              <p>
                What happens when I step away from terminal windows and Databricks clusters? Proof that data engineers touch grass, lift heavy iron, chase coastal sunrises across India, and drink questionable amounts of South Indian filter coffee.
              </p>
              <p className="text-[#8C857B] text-[14px]">
                I believe physical stamina and mental discipline directly compound into cleaner, sharper engineering. When you spend hours wrestling with multi-node distributed systems, you need hobbies that ground you in reality.
              </p>
            </div>
          </section>

          {/* 2. INTERACTIVE HOT TAKE GENERATOR 🎲 (Directly inspired by UX Dularia & AskUmi) */}
          <section className="w-full max-w-[1200px] py-8 px-6 sm:px-10">
            <div className="w-full rounded-[28px] bg-white border border-[#E5DFD5] p-6 sm:p-9 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E03E2D]/5 rounded-bl-full pointer-events-none" />
              
              <div className="flex flex-col gap-3 max-w-[720px]">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F3EFE9] border border-[#E5DFD5] font-mono text-[10.5px] font-bold text-[#E03E2D] uppercase tracking-wider">
                    {currentHotTake.tag}
                  </span>
                  <span className="font-mono text-xs text-[#8C857B]">
                    Take #{hotTakeIdx + 1} of {lifeHotTakes.length}
                  </span>
                </div>
                <blockquote className="font-notch text-[20px] sm:text-[24px] font-bold text-[#141312] leading-snug">
                  "{currentHotTake.quote}"
                </blockquote>
                <div className="flex items-center gap-3 text-xs font-headline text-[#8C857B]">
                  <span>Topic: <strong className="text-[#141312]">{currentHotTake.topic}</strong></span>
                  <span>•</span>
                  <span className="font-mono text-sm">{currentHotTake.kaomoji}</span>
                </div>

                {/* Interactive Hot Take Reactions */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E5DFD5]/80 mt-1">
                  <span className="text-[11px] font-mono text-[#8C857B] uppercase tracking-wider font-semibold mr-1">React:</span>
                  <button 
                    type="button" 
                    onClick={() => handleReact('fire')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-headline font-semibold bg-[#FBF9F5] border border-[#E5DFD5] hover:border-[#E03E2D] hover:bg-rose-50 transition-all cursor-pointer active:scale-95 shadow-2xs"
                  >
                    <span>🔥 Spot On</span>
                    <span className="font-mono text-[11px] text-[#8C857B]">{reactions.fire}</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleReact('tooReal')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-headline font-semibold bg-[#FBF9F5] border border-[#E5DFD5] hover:border-[#E03E2D] hover:bg-rose-50 transition-all cursor-pointer active:scale-95 shadow-2xs"
                  >
                    <span>😭 Too Real</span>
                    <span className="font-mono text-[11px] text-[#8C857B]">{reactions.tooReal}</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleReact('chuckled')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-headline font-semibold bg-[#FBF9F5] border border-[#E5DFD5] hover:border-[#E03E2D] hover:bg-rose-50 transition-all cursor-pointer active:scale-95 shadow-2xs"
                  >
                    <span>😂 Felt That</span>
                    <span className="font-mono text-[11px] text-[#8C857B]">{reactions.chuckled}</span>
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={rollHotTake}
                className="btn-primary shrink-0 px-5 py-3 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2.5"
              >
                <span>Roll Another Take</span>
                <span className="text-base">🎲</span>
              </button>
            </div>
          </section>

          {/* 3. LIFE TELEMETRY BENTO (Caffeine, Iron PRs, Focus Beats) */}
          <section className="w-full max-w-[1200px] py-8 px-6 sm:px-10 grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Card 1: Caffeine Streaming Engine */}
            <div className="p-6 rounded-[26px] bg-white border border-[#E5DFD5] shadow-2xs flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD5]">
                <span className="font-mono text-[11px] uppercase font-bold text-[#E03E2D]">
                  CAFFEINE PROTOCOL ☕
                </span>
                <span className="font-mono text-xs font-bold text-[#141312]">
                  {coffeeCups}/3 cups
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-notch text-[18px] font-bold text-[#141312]">
                  South Indian Filter Coffee
                </h4>
                <p className="font-headline text-[13px] text-[#5C574F] leading-relaxed">
                  Chicory blend roasted fresh. The single greatest streaming ingestion protocol known to human focus.
                </p>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleBrewCoffee}
                  className="btn-secondary w-full justify-center text-xs py-2 cursor-pointer hover:border-[#141312]"
                >
                  Brew Cup ☕ (+1 Cup)
                </button>
                {coffeeToast && (
                  <span className="text-[11px] font-mono text-[#E03E2D] text-center animate-fadeIn font-semibold">
                    {coffeeToast}
                  </span>
                )}
              </div>
            </div>

            {/* Card 2: Iron PRs & Physical Stamina */}
            <div className="p-6 rounded-[26px] bg-white border border-[#E5DFD5] shadow-2xs flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD5]">
                <span className="font-mono text-[11px] uppercase font-bold text-[#E03E2D]">
                  IRON DISCIPLINE 🏋️‍♂️
                </span>
                <span className="font-mono text-xs font-bold text-emerald-700">
                  48-Wk Streak
                </span>
              </div>
              
              {/* Lift Selector Pills */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#FBF9F5] border border-[#E5DFD5]">
                {[
                  { id: 'deadlift', label: '140kg DL' },
                  { id: 'squat', label: '110kg SQ' },
                  { id: 'bench', label: '80kg BP' },
                  { id: 'run', label: '5K Run' },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setActiveLift(l.id)}
                    className={`flex-1 py-1 rounded-lg text-[10.5px] font-mono font-bold transition-all cursor-pointer ${
                      activeLift === l.id
                        ? 'bg-[#141312] text-white shadow-2xs'
                        : 'text-[#5C574F] hover:text-[#141312]'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              {/* Lift Insight */}
              <div className="p-3 rounded-xl bg-[#FBF9F5] border border-[#E5DFD5] text-xs font-headline text-[#5C574F]">
                {activeLift === 'deadlift' && "Deadlift: 140kg. Extracting heavy iron from floor to hips. Heavier than legacy enterprise database schemas."}
                {activeLift === 'squat' && "Squat: 110kg. Building functional leg drive with better partitioning than Apache Hive."}
                {activeLift === 'bench' && "Bench Press: 80kg. Pushing through upper body plateaus and code blockers with equal intensity."}
                {activeLift === 'run' && "Coastal 5K Run: 5:15 /km pace. Clearing mental cache along the Arabian Sea morning breeze."}
              </div>

              <div className="text-[11px] font-mono text-[#8C857B] text-center border-t border-[#E5DFD5] pt-2">
                "Heavy deadlifts make prod outages feel easy."
              </div>
            </div>

            {/* Card 3: Deep Focus Beats & Equalizer */}
            <div className="p-6 rounded-[26px] bg-white border border-[#E5DFD5] shadow-2xs flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD5]">
                <span className="font-mono text-[11px] uppercase font-bold text-[#E03E2D]">
                  FOCUS SOUNDTRACK 🎧
                </span>
                <span className="font-mono text-xs font-bold text-[#141312]">
                  {currentMusic.bpm}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#E03E2D] font-bold">♪ NOW PLAYING:</span>
                  {/* Animated Equalizer Bars */}
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 h-3 bg-[#E03E2D] animate-pulse"></span>
                    <span className="w-0.5 h-2 bg-[#E03E2D] animate-bounce"></span>
                    <span className="w-0.5 h-3.5 bg-[#E03E2D] animate-pulse"></span>
                    <span className="w-0.5 h-1.5 bg-[#E03E2D] animate-bounce"></span>
                  </div>
                </div>
                <h4 className="font-notch text-[17px] font-bold text-[#141312]">
                  {currentMusic.track}
                </h4>
                <p className="font-headline text-[12.5px] text-[#5C574F]">
                  {currentMusic.vibe}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCycleMusic}
                className="btn-secondary w-full justify-center text-xs py-2 cursor-pointer hover:border-[#141312]"
              >
                Switch Vibe 🔀
              </button>
            </div>

          </section>

          {/* 4. AUTHENTIC INTERACTIVE INDIA EXPEDITION MAP & JOURNAL */}
          <section className="w-full max-w-[1200px] py-14 px-6 sm:px-10 border-t border-[#E5DFD5] flex flex-col gap-8">
            
            {/* Header with View Controls */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="section-kicker">
                  [ 🗺️ EXPEDITION JOURNAL ]
                </span>
                <h2 className="section-title mt-1.5">
                  States & Trails <span className="text-[#E03E2D]">Covered</span>.
                </h2>
                <p className="font-headline text-[14px] text-[#5C574F] mt-1">
                  8 marked destinations across 7 covered Indian states & union territories. Tap any pin to open the travel log!
                </p>
              </div>

              {/* View Switcher: All-India vs Regional Focus */}
              <div className="p-1 rounded-full bg-white border border-[#E5DFD5] inline-flex items-center gap-1 self-start sm:self-auto shadow-2xs">
                <button
                  type="button"
                  onClick={() => setMapView('allIndia')}
                  className={`px-3.5 py-1 rounded-full font-headline text-[11px] uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                    mapView === 'allIndia'
                      ? 'bg-[#141312] text-white shadow-2xs'
                      : 'text-[#5C574F] hover:text-[#141312]'
                  }`}
                >
                  All-India View
                </button>
                <button
                  type="button"
                  onClick={() => setMapView('southIndia')}
                  className={`px-3.5 py-1 rounded-full font-headline text-[11px] uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                    mapView === 'southIndia'
                      ? 'bg-[#141312] text-white shadow-2xs'
                      : 'text-[#5C574F] hover:text-[#141312]'
                  }`}
                >
                  South Focus
                </button>
                <button
                  type="button"
                  onClick={() => setMapView('northIndia')}
                  className={`px-3.5 py-1 rounded-full font-headline text-[11px] uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                    mapView === 'northIndia'
                      ? 'bg-[#141312] text-white shadow-2xs'
                      : 'text-[#5C574F] hover:text-[#141312]'
                  }`}
                >
                  North Focus
                </button>
              </div>
            </div>

            {/* MAIN MAP CANVAS + INTERACTIVE CHEEKY TRAVEL LOG */}
            <div className="w-full rounded-[28px] bg-white border border-[#E5DFD5] p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Left: Interactive SVG Map of India with Covered States */}
              <div className="lg:col-span-7 min-h-[460px] sm:min-h-[520px] relative rounded-[22px] bg-[#FBF9F5] border border-[#E5DFD5] p-4 sm:p-6 overflow-hidden flex items-center justify-center shadow-2xs select-none">
                
                <svg
                  viewBox={indiaViewBoxes[mapView] || indiaViewBoxes.allIndia}
                  className="w-full h-full max-h-[500px] transition-all duration-700 ease-out"
                  style={{ overflow: 'visible' }}
                >
                  <defs>
                    <pattern id="map-dots" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="0.8" fill="#D9D2C7" />
                    </pattern>
                  </defs>
                  <rect
                    x="0"
                    y="0"
                    width="1000"
                    height="1000"
                    fill="url(#map-dots)"
                  />

                  {/* Render All 36 Indian States with Covered Highlighting */}
                  <g id="india-states-layer">
                    {indiaStates.map((state) => {
                      const isCovered = coveredStateIds.includes(state.id)
                      const isHovered = hoveredState === state.id

                      return (
                        <path
                          key={state.id}
                          id={state.id}
                          d={state.d}
                          onMouseEnter={() => setHoveredState(state.id)}
                          onMouseLeave={() => setHoveredState(null)}
                          fill={
                            isCovered
                              ? isHovered
                                ? 'rgba(224, 62, 45, 0.28)'
                                : 'rgba(224, 62, 45, 0.16)'
                              : isHovered
                              ? '#E5DFD5'
                              : '#FFFFFF'
                          }
                          stroke={isCovered ? '#E03E2D' : '#D9D2C7'}
                          strokeWidth={isCovered ? 1.4 : 0.6}
                          className="transition-colors duration-200 cursor-pointer"
                        >
                          <title>{state.name} {isCovered ? '— [COVERED]' : ''}</title>
                        </path>
                      )
                    })}
                  </g>

                  {/* Connecting Expedition Trails */}
                  <path
                    d="M 348,222 L 298,245 L 344,321 L 288,395"
                    fill="none"
                    stroke="#E03E2D"
                    strokeWidth="1.6"
                    strokeDasharray="4 3"
                    strokeOpacity="0.85"
                  />
                  <path
                    d="M 340,765 L 286,792 L 328,896 L 375,835"
                    fill="none"
                    stroke="#E03E2D"
                    strokeWidth="1.6"
                    strokeDasharray="4 3"
                    strokeOpacity="0.85"
                  />
                  <path
                    d="M 288,395 Q 310,580 340,765"
                    fill="none"
                    stroke="#E03E2D"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                    strokeOpacity="0.4"
                  />

                  {/* 8 Destination Pins Plotted on Exact Coordinates */}
                  <g id="destination-pins-layer">
                    {destinationPins.map((pin) => {
                      const isSelected = selectedPin.id === pin.id

                      return (
                        <g
                          key={pin.id}
                          className="cursor-pointer group"
                          onClick={() => handleSelectPin(pin)}
                        >
                          {isSelected && (
                            <circle
                              cx={pin.svgX}
                              cy={pin.svgY}
                              r={mapView === 'allIndia' ? 16 : 12}
                              fill="#E03E2D"
                              fillOpacity="0.25"
                              className="animate-ping"
                            />
                          )}

                          <circle
                            cx={pin.svgX}
                            cy={pin.svgY}
                            r={isSelected ? (mapView === 'allIndia' ? 8 : 6) : (mapView === 'allIndia' ? 5 : 4)}
                            fill={isSelected ? '#141312' : '#E03E2D'}
                            stroke="#FFFFFF"
                            strokeWidth={1.5}
                          />

                          <circle
                            cx={pin.svgX}
                            cy={pin.svgY}
                            r={mapView === 'allIndia' ? 2.2 : 1.6}
                            fill="#FFFFFF"
                          />

                          <foreignObject
                            x={pin.svgX - 44}
                            y={pin.svgY - (mapView === 'allIndia' ? 24 : 22)}
                            width="88"
                            height="20"
                            className="pointer-events-none"
                          >
                            <div className="flex justify-center">
                              <span className={`px-1.5 py-0.5 rounded-full text-[8.5px] font-mono font-bold tracking-tight shadow-2xs whitespace-nowrap ${
                                isSelected ? 'bg-[#141312] text-white' : 'bg-white/90 text-[#141312] border border-[#E5DFD5]'
                              }`}>
                                {pin.name}
                              </span>
                            </div>
                          </foreignObject>
                        </g>
                      )
                    })}
                  </g>
                </svg>

                {/* Map Bottom Tag */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[9.5px] font-mono text-[#8C857B] pointer-events-none">
                  <span>INDIAN SUB-CONTINENT CORRIDOR</span>
                  <span>7 STATES • 8 DESTINATIONS</span>
                </div>
              </div>

              {/* Right: Rich Cheeky Polaroid Log Card for Selected Pin */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-5 p-6 rounded-[22px] bg-[#FBF9F5] border border-[#E5DFD5]">
                
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E03E2D] text-white text-[10px] font-mono font-bold uppercase">
                      📍 {selectedPin.region === 'north' ? 'NORTH TRAIL' : 'SOUTH CORRIDOR'}
                    </span>
                    <span className="font-mono text-[10px] text-[#8C857B]">
                      {selectedPin.coordinates}
                    </span>
                  </div>

                  <div>
                    <span className="font-mono text-[11px] text-[#E03E2D] font-bold uppercase tracking-wider">
                      {selectedPin.state}
                    </span>
                    <h3 className="font-notch text-[26px] sm:text-[30px] font-bold text-[#141312] leading-tight mt-0.5">
                      {selectedPin.name}
                    </h3>
                    <span className="inline-block text-xs font-headline text-[#8C857B] font-medium mt-0.5">
                      {selectedPin.type} • {selectedPin.date}
                    </span>
                  </div>

                  {/* Cheeky Travel Review Note */}
                  <div className="p-4 rounded-xl bg-white border border-[#E5DFD5] shadow-2xs font-headline text-[13.5px] leading-relaxed text-[#5C574F]">
                    <p className="italic text-[#141312] font-medium">"{selectedPin.highlight}"</p>
                  </div>
                </div>

                {/* Jump to Pin Buttons (All 8 Places) */}
                <div className="flex flex-col gap-2 pt-3 border-t border-[#E5DFD5]">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#8C857B] font-semibold">
                    Jump to destination:
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {destinationPins.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectPin(p)}
                        className={`px-1.5 py-1.5 rounded-lg font-headline text-[10.5px] font-semibold transition-all truncate cursor-pointer ${
                          selectedPin.id === p.id
                            ? 'bg-[#141312] text-white shadow-xs'
                            : 'bg-white text-[#5C574F] hover:text-[#141312] border border-[#E5DFD5]'
                        }`}
                        title={p.name}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </section>

          {/* 5. PHOTOGRAPHY GALLERY (Moments Through The Lens) */}
          <section className="w-full max-w-[1200px] py-14 px-6 sm:px-10 border-t border-[#E5DFD5] flex flex-col gap-8">
            <div className="flex flex-col">
              <span className="section-kicker">
                [ 📸 THROUGH THE LENS ]
              </span>
              <h2 className="section-title mt-1.5">
                Moments & <span className="text-[#5C574F]">perspectives</span>.
              </h2>
              <p className="font-headline text-[14px] text-[#5C574F] mt-1">
                Visual captures across Western Ghats trails, tea terraces, and coastal horizon lines.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {photographyGallery.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group relative h-[320px] rounded-[24px] overflow-hidden border border-[#E5DFD5] cursor-pointer shadow-2xs flex flex-col justify-end p-5 transition-all hover:shadow-lg hover:scale-[1.01]"
                >
                  <div className={`absolute inset-0 bg-gradient-to-b ${photo.gradient} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
                  
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white/70 font-mono text-[10px]">
                    <span>[ FRAME {photo.id.slice(-1)} ]</span>
                    <span>{photo.camera.split('•')[0]}</span>
                  </div>
                  
                  <div className="relative z-10 flex flex-col text-white">
                    <span className="text-[10px] font-mono text-[#E03E2D] uppercase tracking-wider font-semibold">
                      {photo.category}
                    </span>
                    <h4 className="font-notch text-[18px] font-bold text-white mt-0.5 leading-snug">
                      {photo.title}
                    </h4>
                    <p className="font-headline text-[12px] text-white/80 mt-1 line-clamp-2">
                      {photo.caption}
                    </p>
                    <span className="text-[11px] font-mono text-white/60 mt-2.5 pt-2 border-t border-white/20">
                      📍 {photo.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Lightbox Modal for Photography */}
          {selectedPhoto && (
            <div
              className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-6 animate-fadeIn"
              onClick={() => setSelectedPhoto(null)}
            >
              <div
                className="bg-white rounded-[28px] max-w-[560px] w-full p-6 flex flex-col gap-5 relative shadow-2xl border border-[#E5DFD5]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD5]">
                  <span className="font-mono text-[11px] text-[#E03E2D] font-bold uppercase">
                    {selectedPhoto.category}
                  </span>
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="w-7 h-7 rounded-full bg-[#F3EFE9] border border-[#E5DFD5] text-[#141312] font-bold hover:bg-[#E5DFD5] flex items-center justify-center text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className={`w-full h-[220px] rounded-[18px] bg-gradient-to-b ${selectedPhoto.gradient} flex items-center justify-center text-white/80 p-6 text-center shadow-inner`}>
                  <div>
                    <h3 className="font-notch text-[24px] font-bold text-white">{selectedPhoto.title}</h3>
                    <p className="font-headline text-[13px] text-white/80 mt-1.5">{selectedPhoto.caption}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[12px] font-headline">
                  <div className="p-3.5 rounded-xl bg-[#FBF9F5] border border-[#E5DFD5]">
                    <span className="block text-[10px] font-mono text-[#8C857B] uppercase font-semibold">Location</span>
                    <span className="font-semibold text-[#141312]">{selectedPhoto.location}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FBF9F5] border border-[#E5DFD5]">
                    <span className="block text-[10px] font-mono text-[#8C857B] uppercase font-semibold">Camera Specs</span>
                    <span className="font-mono text-[#141312] font-semibold">{selectedPhoto.camera}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
