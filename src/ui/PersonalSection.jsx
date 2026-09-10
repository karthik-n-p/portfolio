import React, { useState, useEffect } from 'react'
import { indiaTravelPlaces } from '../data/indiaBucketListData.js'
import { scrapbookContent } from '../data/scrapbookData.js'
import {
  realCloudinaryPhotos,
  getCloudinaryUrl,
} from '../utils/cloudinary.js'
import {
  indiaStates,
  indiaViewBoxes,
} from '../data/indiaMapData.js'

/* ── Washi tape strip ── */
function WashiTape({ text, tilt = '0deg', color = 'bg-amber-200/90 border-amber-300', className = '' }) {
  return (
    <div
      style={{ transform: `rotate(${tilt})` }}
      className={`inline-flex items-center px-4 py-1 border shadow-xs ${color} ${className}`}
    >
      <span className="font-['Gloria_Hallelujah',cursive] text-[10.5px] text-[#2B2825] font-bold whitespace-nowrap">
        {text}
      </span>
    </div>
  )
}

/* ── Meme sticker badge ── */
function Sticker({ text, tilt = '0deg', color = 'bg-[#FEF08A] border-[#FDE047] text-[#713F12]', className = '' }) {
  return (
    <span
      style={{ transform: `rotate(${tilt})` }}
      className={`inline-block px-2.5 py-1 rounded border font-mono text-[10px] shadow-sm select-none cursor-default hover:scale-110 transition-transform ${color} ${className}`}
    >
      {text}
    </span>
  )
}

const PHOTOS_PER_PAGE = 4

export default function PersonalSection() {
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [selectedPlaceId, setSelectedPlaceId] = useState('thanjavur')
  const [activePhoto, setActivePhoto] = useState(null)
  const [photoFilter, setPhotoFilter] = useState('all')
  const [hoveredPlace, setHoveredPlace] = useState(null)
  const [imgErrors, setImgErrors] = useState({})
  const [blinkOn, setBlinkOn] = useState(true)
  const [visiblePhotos, setVisiblePhotos] = useState(PHOTOS_PER_PAGE)

  useEffect(() => {
    const t = setInterval(() => setBlinkOn(b => !b), 600)
    return () => clearInterval(t)
  }, [])

  const selectedPlace = indiaTravelPlaces.find(p => p.id === selectedPlaceId) || indiaTravelPlaces[0]

  const filteredPlaces = indiaTravelPlaces.filter(p => {
    if (activeFilter === 'VISITED') return p.status === 'VISITED'
    if (activeFilter === 'BUCKET_LIST') return p.status === 'BUCKET_LIST'
    return true
  })

  const visitedCount = indiaTravelPlaces.filter(p => p.status === 'VISITED').length
  const bucketCount = indiaTravelPlaces.filter(p => p.status === 'BUCKET_LIST').length

  const allFilteredPhotos = photoFilter === 'all'
    ? realCloudinaryPhotos
    : realCloudinaryPhotos.filter(p => p.folder === photoFilter)
  const photosToDisplay = allFilteredPhotos.slice(0, visiblePhotos)
  const hasMorePhotos = visiblePhotos < allFilteredPhotos.length

  const handlePhotoFilterChange = (filter) => {
    setPhotoFilter(filter)
    setVisiblePhotos(PHOTOS_PER_PAGE)
  }

  const handleSelectPlace = (place) => {
    setSelectedPlaceId(place.id)
    setVisiblePhotos(PHOTOS_PER_PAGE)
    if (place.folder === 'thanjavur') setPhotoFilter('thanjavur')
    else if (place.folder === 'sky_moon') setPhotoFilter('sky_moon')
    else setPhotoFilter('all')
  }

  const handleImgError = (id) => {
    setImgErrors(prev => ({ ...prev, [id]: true }))
  }

  return (
    <section
      id="personal"
      className="w-full relative overflow-hidden select-none"
      style={{
        background: 'linear-gradient(160deg, #FAFAF7 0%, #F4F0E8 35%, #EEF2F7 70%, #F8F9FA 100%)',
        minHeight: '100vh',
      }}
    >
      {/* NOISE TEXTURE */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'200\' height=\'200\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          backgroundSize: '200px 200px',
        }}
      />

      {/* GRID DOTS */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#94A3B8 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* DECORATIVE CLOUDS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-12 left-[5%] w-[360px] h-[160px] rounded-full bg-white/50 blur-3xl" />
        <div className="absolute top-[45%] right-[3%] w-[500px] h-[200px] rounded-full bg-white/60 blur-3xl" />
        <div className="absolute bottom-24 left-[12%] w-[440px] h-[180px] rounded-full bg-white/40 blur-3xl" />
      </div>

      {/* BIG WATERMARK */}
      <div
        className="absolute top-[20%] left-[-50px] text-[110px] font-black text-[#E03E2D]/[0.035] tracking-tighter pointer-events-none select-none hidden lg:block"
        style={{ transform: 'rotate(-11deg)', fontFamily: 'system-ui', lineHeight: 1 }}
      >
        PERSONAL
      </div>

      <div className="w-full max-w-[1340px] mx-auto px-4 sm:px-8 py-16 sm:py-24 relative z-10 flex flex-col gap-20 sm:gap-28">

        {/* ═══════════════════════════════════════════════════════
            BLOCK 1 — HERO STATEMENT + INTERESTS
        ═══════════════════════════════════════════════════════ */}
        <div className="relative w-full">

          {/* Pre-headline stickers */}
          <div className="hidden md:flex items-end gap-3 mb-5 pl-2">
            <Sticker text="currently figuring it out ✨" tilt="-2.5deg" color="bg-[#FEF9C3] border-[#FDE047] text-[#713F12]" />
            <Sticker text="off the clock ☕" tilt="3deg" color="bg-amber-100 border-amber-300 text-amber-900" />
          </div>

          {/* Main card */}
          <div className="relative bg-white/85 backdrop-blur-md rounded-[36px] border border-[#D1D5DB] shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8 sm:p-14 overflow-visible">

            {/* Corner washi tapes */}
            <div className="absolute -top-3 left-12 hidden sm:block">
              <WashiTape text="off the clock ☕" tilt="-3deg" color="bg-amber-200/90 border-amber-300" />
            </div>
            <div className="absolute -top-3 right-12 hidden lg:block">
              <WashiTape text="not everything needs a reason" tilt="2.5deg" color="bg-[#E0F2FE] border-[#BAE6FD] text-[#0369A1]" />
            </div>

            {/* Blinking cursor */}
            <div
              className="absolute top-6 right-8 font-mono text-[#E03E2D] text-xl font-bold hidden sm:block"
              style={{ opacity: blinkOn ? 1 : 0, transition: 'opacity 0.08s' }}
            >
              █
            </div>

            {/* Mobile: 2-col side-by-side (text left, photo right). Desktop: 12-col grid */}
            <div className="grid grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-8 lg:gap-16 items-center">

              {/* LEFT: Headline + bio + interest badges */}
              <div className="col-span-1 lg:col-span-7 flex flex-col gap-3 sm:gap-6">
                <div className="flex flex-col gap-0">
                  <h2 className="font-notch text-[22px] sm:text-[60px] lg:text-[70px] font-black text-[#141312] leading-[1.05] tracking-tight">
                    Work keeps
                    me busy.
                  </h2>
                  <h2 className="font-notch text-[22px] sm:text-[60px] lg:text-[70px] font-black italic text-[#E03E2D] leading-[1.05] tracking-tight">
                    The rest keeps
                    me sane.
                  </h2>
                </div>

                <p className="font-headline text-[11.5px] sm:text-[15.5px] text-[#475569] leading-relaxed hidden sm:block max-w-[580px]">
                  I like going somewhere I've never been. Taking too many photos.
                  Sometimes a book. Sometimes a mountain.
                  <span className="font-['Gloria_Hallelujah',cursive] text-[#E03E2D] ml-2 text-[13px]">still figuring things out.</span>
                </p>

                {/* Mobile short bio */}
                <p className="font-['Gloria_Hallelujah',cursive] text-[10px] text-[#E03E2D] font-bold sm:hidden leading-snug">
                  traveller · reader · gym rat
                </p>

                {/* Interest badges — hidden on mobile (too cramped) */}
                <div className="hidden sm:flex flex-wrap gap-2.5">
                  {scrapbookContent.interests.map((item) => (
                    <div
                      key={item.id}
                      style={{ transform: `rotate(${item.tilt})` }}
                      className={`px-3.5 py-1.5 rounded-2xl border shadow-sm flex items-center gap-2 hover:scale-105 hover:rotate-0 transition-all duration-200 cursor-default ${item.color}`}
                    >
                      <span className="text-sm">{item.doodle}</span>
                      <span className="font-mono text-[9.5px] font-black uppercase tracking-widest">{item.label}:</span>
                      <span className="font-['Gloria_Hallelujah',cursive] text-[11px] font-semibold">{item.scribble}</span>
                    </div>
                  ))}
                </div>

                {/* Mobile interest emoji row */}
                <div className="flex gap-2.5 sm:hidden flex-wrap">
                  {scrapbookContent.interests.map((item) => (
                    <span key={item.id} className="text-xl" title={item.label}>{item.doodle}</span>
                  ))}
                </div>
              </div>

              {/* RIGHT: Cheeky photo strip */}
              <div className="col-span-1 lg:col-span-5 flex items-end justify-center gap-0 relative min-h-[240px] sm:min-h-[360px]">

                {/* Photo 1 — blue plaid, explaining (hidden on mobile) */}
                <div
                  className="hidden sm:block relative z-10 w-[120px] sm:w-[148px] shrink-0 hover:z-30 hover:scale-105 transition-all duration-300"
                  style={{ transform: 'rotate(-8deg) translateY(20px)' }}
                >
                  <img
                    src="/karthik-cheeky-1.png"
                    alt="Karthik — the explainer"
                    className="w-full object-contain drop-shadow-2xl"
                    draggable="false"
                  />
                  <div
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-amber-200/90 border border-amber-300 font-['Gloria_Hallelujah',cursive] text-[9px] text-[#713F12] whitespace-nowrap shadow-sm"
                    style={{ transform: 'rotate(-2deg)' }}
                  >
                    "hear me out"
                  </div>
                </div>

                {/* Photo 2 — green shirt, pointing + sunglasses */}
                {/* On mobile: hidden. On desktop: center dominant */}
                <div
                  className="hidden sm:block relative z-20 w-[138px] sm:w-[170px] shrink-0 hover:z-30 hover:scale-105 transition-all duration-300"
                  style={{ transform: 'rotate(0deg) translateY(-10px)' }}
                >
                  <img
                    src="/karthik-cheeky-2.png"
                    alt="Karthik — the cool one"
                    className="w-full object-contain drop-shadow-2xl"
                    draggable="false"
                  />
                  <div
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#FEF9C3] border border-[#FDE047] font-['Gloria_Hallelujah',cursive] text-[9px] text-[#713F12] whitespace-nowrap shadow-sm"
                    style={{ transform: 'rotate(1.5deg)' }}
                  >
                    off the clock ☕
                  </div>
                </div>

                {/* Photo 3 — double finger guns, wink */}
                {/* Mobile: this is the HERO photo, large and centered */}
                <div
                  className="relative z-30 sm:z-10 w-[140px] sm:w-[148px] shrink-0 hover:z-30 hover:scale-105 transition-all duration-300"
                  style={{ transform: 'rotate(4deg) translateY(0px)' }}
                >
                  <img
                    src="/karthik-cheeky-3.png"
                    alt="Karthik — the wink"
                    className="w-full object-contain drop-shadow-2xl"
                    draggable="false"
                  />
                  <div
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-rose-100 border border-rose-200 font-['Gloria_Hallelujah',cursive] text-[9px] text-[#9F1239] whitespace-nowrap shadow-sm"
                    style={{ transform: 'rotate(2deg)' }}
                  >
                    trust me 😎
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating note below */}
          <div className="hidden lg:block absolute -bottom-6 right-20">
            <div
              className="px-3 py-1 bg-rose-100 border border-rose-200 text-[10.5px] font-['Gloria_Hallelujah',cursive] text-[#9F1239]"
              style={{ transform: 'rotate(-4deg)', boxShadow: '2px 2px 5px rgba(0,0,0,0.1)' }}
            >
              probably unnecessary ¯\_(ツ)_/¯
            </div>
          </div>
        </div>


        {/* ═══════════════════════════════════════════════════════
            BLOCK 2 — INDIA TRAVEL MAP
        ═══════════════════════════════════════════════════════ */}
        <div id="bucket-list" className="w-full relative">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-7 px-1">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🗺️</span>
                <span className="font-['Gloria_Hallelujah',cursive] text-sm text-[#E03E2D] font-bold">travel logs &amp; dream roadmap</span>
              </div>
              <h3 className="font-notch text-[26px] sm:text-[40px] font-black text-[#141312] leading-tight">
                India: Covered &amp; Bucket List.
              </h3>
              <p className="font-headline text-[13px] text-[#64748B] mt-1.5 max-w-[600px]">
                <span className="font-bold text-emerald-700">✓ {visitedCount} visited</span> — places actually been to ·
                <span className="font-bold text-[#E03E2D] ml-1">★ {bucketCount} bucket list</span> — still on the list
              </p>
            </div>

            <div className="p-1 rounded-2xl bg-white border border-[#CBD5E1] inline-flex items-center gap-0.5 shadow-sm self-start md:self-auto">
              {[
                { key: 'ALL', label: `All (${visitedCount + bucketCount})`, activeClass: 'bg-[#141312] text-white' },
                { key: 'VISITED', label: `✓ Visited (${visitedCount})`, activeClass: 'bg-emerald-700 text-white' },
                { key: 'BUCKET_LIST', label: `★ Dream (${bucketCount})`, activeClass: 'bg-[#E03E2D] text-white' },
              ].map(f => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setActiveFilter(f.key)}
                  className={`px-3 py-1.5 rounded-xl font-headline text-[11px] font-bold uppercase tracking-wide transition-all cursor-pointer ${
                    activeFilter === f.key ? f.activeClass + ' shadow-sm' : 'text-[#64748B] hover:text-[#141312]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full rounded-[36px] bg-white/80 backdrop-blur-md border border-[#CBD5E1] p-5 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden">

            <div className="absolute -top-2.5 left-16">
              <WashiTape text="india trails 🏔️" tilt="-2deg" color="bg-amber-100 border-amber-300" />
            </div>

            {/* SVG India Map */}
            <div className="lg:col-span-7 min-h-[480px] sm:min-h-[560px] relative rounded-[28px] bg-[#F8FAFC] border border-[#E2E8F0] p-4 sm:p-5 flex items-center justify-center shadow-inner overflow-hidden">

              <div className="absolute top-4 left-4 font-['Gloria_Hallelujah',cursive] text-[9px] text-[#94A3B8] font-bold">INDIA</div>

              <svg
                viewBox={indiaViewBoxes.allIndia}
                className="w-full h-full max-h-[520px] transition-all duration-500 ease-out"
                style={{ overflow: 'visible' }}
              >
                <g>
                  {indiaStates.map((state) => {
                    const isSelected = (selectedPlace.state || '').toLowerCase().includes((state.name || '').toLowerCase())
                    return (
                      <path
                        key={state.id}
                        id={`map-${state.id}`}
                        d={state.d}
                        fill={isSelected ? '#FEE2E2' : '#F1F5F9'}
                        stroke={isSelected ? '#E03E2D' : '#CBD5E1'}
                        strokeWidth={isSelected ? 1.5 : 0.6}
                        className="transition-colors duration-200 hover:fill-[#E0F2FE]"
                      />
                    )
                  })}
                </g>

                {/* Dashed trails between visited places */}
                {(() => {
                  const vis = indiaTravelPlaces.filter(p => p.status === 'VISITED' && (activeFilter === 'ALL' || activeFilter === 'VISITED'))
                  return vis.slice(0, vis.length - 1).map((p, i) => {
                    const n = vis[i + 1]
                    return (
                      <line key={`trail-${i}`}
                        x1={p.svgX} y1={p.svgY}
                        x2={n.svgX} y2={n.svgY}
                        stroke="#10B981" strokeWidth="0.7"
                        strokeDasharray="4 4" opacity="0.35"
                      />
                    )
                  })
                })()}

                {/* Pins */}
                {filteredPlaces.map((place) => {
                  const isSel = selectedPlaceId === place.id
                  const isVis = place.status === 'VISITED'
                  const isHov = hoveredPlace === place.id
                  return (
                    <g
                      key={place.id}
                      transform={`translate(${place.svgX}, ${place.svgY})`}
                      className="cursor-pointer"
                      onClick={() => handleSelectPlace(place)}
                      onMouseEnter={() => setHoveredPlace(place.id)}
                      onMouseLeave={() => setHoveredPlace(null)}
                    >
                      {isSel && (
                        <circle cx="0" cy="0" r="16"
                          fill={isVis ? '#059669' : '#E03E2D'} fillOpacity="0.18"
                          className="animate-ping"
                        />
                      )}
                      {isVis ? (
                        <circle cx="0" cy="0"
                          r={isSel ? 7 : isHov ? 6 : 4.5}
                          fill="#047857" stroke="#FFFFFF"
                          strokeWidth={isSel ? 2 : 1.5}
                          className="transition-all duration-150"
                        />
                      ) : (
                        <>
                          <circle cx="0" cy="0"
                            r={isSel ? 7 : isHov ? 6 : 4.5}
                            fill="none" stroke="#E03E2D"
                            strokeWidth={isSel ? 2.2 : 1.8}
                            strokeDasharray={isSel ? 'none' : '2 1.5'}
                            className="transition-all duration-150"
                          />
                          <circle cx="0" cy="0" r="1.5" fill="#E03E2D" />
                        </>
                      )}
                      {(isSel || isHov) && (
                        <g transform="translate(0, -14)">
                          <rect
                            x={-(place.name.length * 3.5)} y="-12"
                            width={place.name.length * 7} height="14"
                            rx="5"
                            fill={isVis ? '#047857' : '#E03E2D'} fillOpacity="0.94"
                          />
                          <text x="0" y="-3" textAnchor="middle"
                            fill="#FFFFFF" fontSize="7.5" fontWeight="bold"
                            fontFamily="'Gloria Hallelujah', cursive"
                          >
                            {place.name}
                          </text>
                        </g>
                      )}
                      <text x="0" y={isSel ? 18 : 14} textAnchor="middle"
                        fontSize={isSel ? 9 : 7}
                        className="transition-all duration-150"
                      >
                        {place.doodle}
                      </text>
                    </g>
                  )
                })}
              </svg>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 p-2.5 rounded-xl bg-white/95 border border-[#E2E8F0] text-[10.5px] font-mono flex flex-col gap-1.5 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                  <span className="font-bold text-[#1E293B]">Visited</span>
                  <span className="text-[#94A3B8]">({visitedCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-dashed border-[#E03E2D] bg-transparent shrink-0" />
                  <span className="font-bold text-[#E03E2D]">Bucket List</span>
                  <span className="text-[#94A3B8]">({bucketCount})</span>
                </div>
              </div>
            </div>

            {/* Detail card */}
            <div className="lg:col-span-5 flex flex-col gap-4">

              <div
                className="p-6 rounded-[24px] bg-white border border-[#CBD5E1] shadow-md relative overflow-hidden"
                style={{ transform: 'rotate(-0.8deg)' }}
              >
                <div className="absolute -top-2.5 right-8">
                  <WashiTape
                    text={selectedPlace.status === 'VISITED' ? 'visited memory ✓' : 'bucket list dream ★'}
                    tilt="1.5deg"
                    color={selectedPlace.status === 'VISITED' ? 'bg-emerald-100 border-emerald-300' : 'bg-rose-100 border-rose-200'}
                  />
                </div>

                <div className="flex items-center justify-between pt-2 mb-3">
                  <span className="text-3xl">{selectedPlace.doodle}</span>
                  <span className={`px-2.5 py-1 rounded-full font-mono text-[9.5px] font-black uppercase tracking-wider ${
                    selectedPlace.status === 'VISITED'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-[#E03E2D] border border-rose-300'
                  }`}>
                    {selectedPlace.badge}
                  </span>
                </div>

                <h4 className="font-notch text-[26px] font-black text-[#141312] leading-tight">{selectedPlace.name}</h4>
                <p className="font-headline text-[12px] text-[#94A3B8] font-medium mt-0.5 mb-2">{selectedPlace.state}</p>
                <p className="font-['Gloria_Hallelujah',cursive] text-[#E03E2D] text-[13px] font-bold mb-2">"{selectedPlace.scribble}"</p>
                <p className="font-headline text-[13px] text-[#64748B] leading-relaxed">{selectedPlace.annotation}</p>

                {selectedPlace.hasRealPhotos && (
                  <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between font-mono text-[10.5px] text-emerald-800 font-semibold">
                    <span>✓ photos in camera roll</span>
                    <button
                      type="button"
                      onClick={() => { setPhotoFilter(selectedPlace.folder); document.getElementById('photos')?.scrollIntoView({ behavior: 'smooth' }) }}
                      className="text-[9.5px] bg-emerald-700 text-white px-2 py-0.5 rounded cursor-pointer hover:bg-emerald-900"
                    >
                      see photos ↓
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-['Gloria_Hallelujah',cursive] text-xs text-[#94A3B8] pl-1 font-bold">choose destination:</span>
                <div className="flex flex-wrap gap-1.5 max-h-[200px] overflow-y-auto pr-1 pb-1">
                  {filteredPlaces.map((place) => (
                    <button
                      key={place.id}
                      type="button"
                      onClick={() => handleSelectPlace(place)}
                      className={`px-2.5 py-1 rounded-xl font-['Gloria_Hallelujah',cursive] text-[10.5px] transition-all cursor-pointer ${
                        selectedPlaceId === place.id
                          ? place.status === 'VISITED'
                            ? 'bg-emerald-700 text-white shadow-sm scale-105'
                            : 'bg-[#E03E2D] text-white shadow-sm scale-105'
                          : place.status === 'VISITED'
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-white text-[#475569] border border-[#CBD5E1] hover:border-[#E03E2D] hover:text-[#E03E2D]'
                      }`}
                    >
                      {place.doodle} {place.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* ═══════════════════════════════════════════════════════
            BLOCK 3 — CLOUDINARY PHOTOS
        ═══════════════════════════════════════════════════════ */}
        <div id="photos" className="w-full relative">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 px-1">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">📷</span>
                <span className="font-['Gloria_Hallelujah',cursive] text-sm text-[#E03E2D] font-bold">real camera roll</span>
              </div>
              <h3 className="font-notch text-[26px] sm:text-[40px] font-black text-[#141312] leading-tight">Camera Roll Fragments.</h3>
              <p className="font-headline text-[13px] text-[#64748B] mt-1">
                actual shots from <code className="text-[#1E293B] font-bold bg-[#F1F5F9] px-1 rounded">portfolio/</code> — temples, skies, roadtrips
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap self-start sm:self-auto">
              {[
                { key: 'all', label: `All (${realCloudinaryPhotos.length})` },
                { key: 'thanjavur', label: '🛕 Thanjavur' },
                { key: 'sky_moon', label: '🌅 Skies' },
                { key: 'portfolio', label: '📸 Misc' },
              ].map(f => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => handlePhotoFilterChange(f.key)}
                  className={`px-3 py-1 rounded-xl font-['Gloria_Hallelujah',cursive] text-[10.5px] transition-all cursor-pointer ${
                    photoFilter === f.key
                      ? 'bg-[#141312] text-white shadow-sm'
                      : 'bg-white text-[#64748B] border border-[#CBD5E1] hover:border-[#141312] hover:text-[#141312]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            {/* Coffee ring stain */}
            <div
              className="absolute -top-8 left-12 w-24 h-24 rounded-full pointer-events-none z-20 hidden md:block"
              style={{
                background: 'radial-gradient(circle, transparent 58%, rgba(120,53,15,0.10) 62%, rgba(120,53,15,0.04) 72%, transparent 80%)',
                border: '1px solid rgba(120,53,15,0.08)',
              }}
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 items-start">
              {photosToDisplay.map((photo, idx) => {
                const cloudUrl = getCloudinaryUrl(photo.publicId, { width: 800, quality: 'auto', format: 'auto' })
                const hasError = imgErrors[photo.id]
                return (
                  <div
                    key={photo.id || idx}
                    onClick={() => !hasError && setActivePhoto(photo)}
                    style={{ transform: `rotate(${photo.tilt || '-1.5deg'})` }}
                    className={`group relative bg-white p-3.5 pb-7 rounded-lg border border-[#CBD5E1] shadow-[0_10px_28px_rgba(0,0,0,0.11)] hover:shadow-2xl hover:!rotate-0 hover:scale-105 transition-all duration-300 ${hasError ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {/* Washi tape */}
                    <div
                      className={`absolute -top-3 left-1/2 w-16 h-4 ${photo.tapeColor || 'bg-amber-200/90'} border border-amber-300/60 shadow-xs`}
                      style={{ transform: `translateX(-50%) rotate(${photo.tapeTilt || '-2deg'})` }}
                    />

                    {/* Image */}
                    <div className="w-full aspect-[3/4] rounded overflow-hidden bg-neutral-200 relative">
                      {!hasError ? (
                        <img
                          src={cloudUrl}
                          alt={photo.caption}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                          onError={() => handleImgError(photo.id)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-mono text-[10px] text-neutral-400 flex-col gap-1">
                          <span>📵</span><span>loading...</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/5 pointer-events-none" />
                    </div>

                    {/* Caption */}
                    <div className="mt-3 flex flex-col gap-0.5 text-center px-1">
                      <span className="font-['Gloria_Hallelujah',cursive] text-[11px] sm:text-[12px] text-[#1E293B] font-bold leading-snug">
                        "{photo.caption}"
                      </span>
                      <span className="font-mono text-[9px] text-[#94A3B8] mt-0.5">
                        📍 {photo.note}
                      </span>
                    </div>

                    {/* Photo number */}
                    <div className="absolute bottom-1.5 right-2 font-mono text-[8px] text-[#CBD5E1] font-bold">
                      #{String(idx + 1).padStart(2, '0')}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Load More Button */}
            {hasMorePhotos && (
              <div className="flex justify-center mt-10">
                <button
                  type="button"
                  onClick={() => setVisiblePhotos(v => v + PHOTOS_PER_PAGE)}
                  className="group flex items-center gap-2.5 px-7 py-3 rounded-full bg-white border-2 border-[#141312] font-['Gloria_Hallelujah',cursive] text-[12px] text-[#141312] font-bold shadow-sm hover:bg-[#141312] hover:text-white transition-all duration-200 cursor-pointer"
                >
                  <span>load more photos</span>
                  <span className="text-[#E03E2D] group-hover:text-white transition-colors">↓</span>
                  <span className="font-mono text-[10px] opacity-60">({allFilteredPhotos.length - visiblePhotos} remaining)</span>
                </button>
              </div>
            )}
          </div>
        </div>


        {/* ═══════════════════════════════════════════════════════
            BLOCK 4 — BOOK + FITNESS
        ═══════════════════════════════════════════════════════ */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Book */}
          <div className="lg:col-span-7 bg-white/80 backdrop-blur-md rounded-[36px] border border-[#CBD5E1] p-7 sm:p-10 shadow-sm flex flex-col gap-6 relative overflow-hidden">

            <div className="absolute top-4 right-8">
              <WashiTape text={scrapbookContent.readingBook.tagline} tilt="2deg" color="bg-emerald-100 border-emerald-300" />
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-7 pt-3">
              {/* 3D Book object */}
              <div
                className="relative w-[145px] sm:w-[158px] h-[215px] sm:h-[230px] rounded-r-xl rounded-l-sm bg-[#0A0A0A] text-white p-4 flex flex-col justify-between shrink-0 hover:scale-105 transition-transform overflow-hidden"
                style={{ transform: 'rotate(-3.5deg)', boxShadow: '14px 16px 36px rgba(0,0,0,0.55)' }}
              >
                {/* Spine shadow */}
                <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/80 to-transparent rounded-l-sm" />
                {/* Nike swoosh red accent band */}
                <div className="absolute bottom-0 left-0 right-0 h-[38%] bg-[#CC0000]" style={{ clipPath: 'polygon(0 30%, 100% 0%, 100% 100%, 0% 100%)' }} />
                {/* Bookmark ribbon */}
                <div className="absolute -bottom-6 right-6 w-3.5 h-10 bg-[#FFD700] shadow-md" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)' }} />
                <div className="pl-2 flex flex-col gap-2 relative z-10">
                  <span className="font-mono text-[7.5px] uppercase tracking-widest text-[#CC0000] font-black">#1 NYT BESTSELLER</span>
                  <h5 className="font-notch text-[19px] font-black text-[#D4A017] leading-[1.0] mt-0.5 tracking-tight">SHOE<br/>DOG</h5>
                  <p className="font-headline text-[7px] text-white/60 leading-tight">A Memoir by the<br/>Creator of <span className="font-black text-white">NIKE</span></p>
                </div>
                <div className="pl-2 pb-1 font-mono text-[7.5px] text-white/80 relative z-10 font-bold">PHIL KNIGHT</div>
              </div>

              <div className="flex flex-col gap-3">
                <span className="font-mono text-[10.5px] font-black uppercase tracking-wider text-[#E03E2D]">CURRENTLY ON THE NIGHTSTAND</span>
                <h4 className="font-notch text-[22px] sm:text-[26px] font-bold text-[#141312] leading-tight">{scrapbookContent.readingBook.title}</h4>
                <p className="font-headline text-[13px] text-[#475569] leading-relaxed">{scrapbookContent.readingBook.subtitle}</p>
                <div
                  className="p-3 bg-[#FEF08A] font-['Gloria_Hallelujah',cursive] text-[11px] text-[#713F12]"
                  style={{ transform: 'rotate(0.8deg)', boxShadow: '2px 3px 8px rgba(0,0,0,0.12)' }}
                >
                  🔖 {scrapbookContent.readingBook.bookmarkNote}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between font-mono text-[11px] text-[#64748B]">
              <span>Progress:</span>
              <strong className="text-[#141312]">{scrapbookContent.readingBook.progress}</strong>
            </div>
          </div>

          {/* Fitness + Coffee */}
          <div className="lg:col-span-5 flex flex-col gap-5">

            <div className="bg-white/80 backdrop-blur-md rounded-[28px] border border-[#CBD5E1] p-6 sm:p-7 shadow-sm flex flex-col gap-4 relative">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏋️‍♂️</span>
                  <span className="font-mono text-[11px] font-black uppercase tracking-wider text-[#141312]">{scrapbookContent.fitnessFragment.title}</span>
                </div>
                <span className="font-['Gloria_Hallelujah',cursive] text-[11px] text-[#E03E2D] font-bold" style={{ transform: 'rotate(-1.5deg)' }}>
                  {scrapbookContent.fitnessFragment.scribble}
                </span>
              </div>

              <div
                className="p-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] shadow-inner flex flex-col gap-4"
                style={{ transform: 'rotate(1deg)' }}
              >
                {scrapbookContent.fitnessFragment.items.map((fit) => (
                  <div key={fit.name} className="flex flex-col gap-1.5 pb-3 border-b border-[#FDE68A]/60 last:border-none last:pb-0">
                    <div className="flex items-center justify-between font-mono text-xs font-bold text-[#1E293B]">
                      <span>{fit.name}</span>
                      <span className="text-sm font-black text-[#E03E2D]">{fit.value} <span className="text-xs font-normal">{fit.unit}</span></span>
                    </div>
                    <div className="font-mono text-[14px] text-emerald-700 tracking-wider">{fit.bar}</div>
                    <span className="font-['Gloria_Hallelujah',cursive] text-[10.5px] text-[#64748B]">{fit.note}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <Sticker text="no rest day 😭" tilt="-2deg" color="bg-rose-50 border-rose-200 text-rose-700" />
                <Sticker text="form: acceptable" tilt="1.5deg" color="bg-emerald-50 border-emerald-200 text-emerald-700" />
                <Sticker text="skipped: 0 days" tilt="-1deg" color="bg-sky-50 border-sky-200 text-sky-700" />
              </div>
            </div>

            <div className="p-5 rounded-[24px] bg-orange-50/80 border border-orange-200 flex items-center gap-4 shadow-sm">
              <span className="text-4xl">☕</span>
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[9.5px] font-black uppercase tracking-wider text-orange-800">DAILY ROUTINE</span>
                <p className="font-['Gloria_Hallelujah',cursive] text-[11.5px] text-[#7C2D12] leading-snug">
                  South Indian filter coffee: "unreasonably useful for solving 2AM Spark shuffle spills."
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* ═══════════════════════════════════════════════════════
            BLOCK 5 — MEME STRIP FOOTER
        ═══════════════════════════════════════════════════════ */}
        <div className="w-full flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-dashed border-[#CBD5E1]/70">
          <div
            className="p-3 bg-[#C0C0C0] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] shadow-md font-mono text-[10.5px] text-[#000000] flex items-center gap-2"
            style={{ transform: 'rotate(-1deg)' }}
          >
            <span className="font-bold text-[#000080]">📀</span>
            <span>karthik.exe has stopped working.</span>
            <button className="px-2 py-0.5 bg-[#C0C0C0] border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080] text-[9.5px] cursor-pointer font-bold hover:bg-[#D0D0D0]">
              restart weekday
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {scrapbookContent.internetStickers.map(stk => (
              <Sticker key={stk.id} text={stk.text} tilt={stk.tilt} color="bg-white border-slate-200 text-slate-500 hover:border-[#E03E2D] hover:text-[#E03E2D]" />
            ))}
            <Sticker text="// TODO: touch grass" tilt="2deg" color="bg-[#FEF08A] border-[#FDE047] text-[#713F12]" />
          </div>

          <div className="font-['Gloria_Hallelujah',cursive] text-[11px] text-[#94A3B8] text-right hidden md:block">
            made with coffee &amp; unnecessary side quests<br />
            <span className="text-[#E03E2D]">— karthik np, somewhere in india</span>
          </div>
        </div>

      </div>

      {/* PHOTO LIGHTBOX */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/88 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-[620px] w-full p-5 sm:p-7 flex flex-col gap-4 relative shadow-2xl border border-[#CBD5E1]"
            onClick={(e) => e.stopPropagation()}
            style={{ transform: 'rotate(-0.4deg)' }}
          >
            <div className="absolute -top-3 left-16">
              <WashiTape text={activePhoto.caption} tilt="-2deg" color={`${activePhoto.tapeColor || 'bg-amber-200'} border-amber-300`} />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="font-['Gloria_Hallelujah',cursive] text-sm text-[#E03E2D] font-bold">"{activePhoto.caption}"</span>
              <button
                onClick={() => setActivePhoto(null)}
                className="w-7 h-7 rounded-full bg-[#F1F5F9] border border-[#CBD5E1] text-[#141312] font-bold flex items-center justify-center text-xs cursor-pointer hover:bg-[#E2E8F0]"
              >
                ✕
              </button>
            </div>

            <div className="w-full h-[340px] sm:h-[420px] rounded-xl overflow-hidden bg-neutral-900">
              <img
                src={getCloudinaryUrl(activePhoto.publicId, { width: 1200, quality: 'auto' })}
                alt={activePhoto.caption}
                className="w-full h-full object-contain bg-black"
              />
            </div>

            <div className="text-center font-mono text-[10px] text-[#94A3B8]">
              📍 {activePhoto.note}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
