import React, { useState } from 'react'
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

const PHOTOS_PER_PAGE = 8

export default function PersonalSection() {
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [selectedPlaceId, setSelectedPlaceId] = useState('thanjavur')
  const [activePhoto, setActivePhoto] = useState(null)
  const [photoFilter, setPhotoFilter] = useState('all')
  const [hoveredPlace, setHoveredPlace] = useState(null)
  const [imgErrors, setImgErrors] = useState({})
  const [visiblePhotos, setVisiblePhotos] = useState(PHOTOS_PER_PAGE)

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
      className="w-full relative overflow-hidden bg-[#FBF9F5] text-[#141312]"
      style={{ minHeight: '100vh' }}
    >
      {/* Subtle Architectural Dot Grid Canvas matching HomePage */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'radial-gradient(#D9D2C7 1.2px, transparent 1.2px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Crosshair markers */}
      <div className="absolute top-10 left-10 font-mono text-[11px] text-[#8C857B]/40 pointer-events-none select-none hidden sm:block">+</div>
      <div className="absolute bottom-16 right-10 font-mono text-[11px] text-[#8C857B]/40 pointer-events-none select-none hidden sm:block">+</div>

      <div className="w-full max-w-[1240px] mx-auto px-5 sm:px-10 py-16 sm:py-24 relative z-10 flex flex-col gap-20 sm:gap-28">

        {/* ═══════════════════════════════════════════════════════
            BLOCK 1 — OFF THE CLOCK + 3-PHOTO TRIO SHOWCASE
        ═══════════════════════════════════════════════════════ */}
        <div className="relative w-full">
          <div className="relative bg-white border border-[#E5DFD5] rounded-[32px] sm:rounded-[36px] p-7 sm:p-12 lg:p-14 shadow-[0_16px_40px_rgba(20,19,18,0.04)] overflow-hidden">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* LEFT: Editorial Headline & Interests */}
              <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-6">
                
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#E03E2D]"></span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8C857B] font-bold">
                      [ 01 // OFF THE CLOCK ]
                    </span>
                  </div>

                  <h2 className="font-notch text-[34px] sm:text-[48px] lg:text-[56px] font-extrabold text-[#141312] leading-[1.0] tracking-tight mt-1">
                    Work keeps me focused.<br />
                    <span className="font-editorial italic font-normal text-[#E03E2D]">
                      The rest keeps me grounded.
                    </span>
                  </h2>
                </div>

                <p className="font-headline text-[14.5px] sm:text-[15.5px] text-[#5C574F] leading-relaxed max-w-[540px]">
                  When the IDE closes: exploring ancient temple architecture across India, capturing shifting horizon skies, reading founder memoirs, and staying disciplined with calisthenics and cricket.
                </p>

                {/* Minimalist Interest Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {scrapbookContent.interests.map((item) => (
                    <div
                      key={item.id}
                      className="px-3.5 py-1.5 rounded-full border border-[#E5DFD5] bg-[#F8F5EE] flex items-center gap-2 text-[#141312] hover:border-[#141312] transition-colors cursor-default"
                      title={item.note}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E03E2D]"></span>
                      <span className="font-headline text-[12px] font-semibold tracking-wide">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT: ALL 3 PHOTOS IN APT POSITIONS (Mobile + Tablet + Desktop) */}
              <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-center justify-center pt-4 lg:pt-0">
                
                {/* 3-Photo Trio Stage */}
                <div className="relative w-full max-w-[420px] h-[230px] sm:h-[280px] lg:h-[310px] flex items-end justify-center select-none">
                  
                  {/* Backdrop glow */}
                  <div className="absolute inset-x-8 bottom-4 h-32 bg-[#EFEAE1]/70 rounded-full blur-2xl -z-10 pointer-events-none" />

                  {/* Photo 1 — Left angled frame */}
                  <div
                    className="relative z-10 w-[33%] sm:w-[130px] lg:w-[145px] shrink-0 hover:z-30 hover:scale-105 transition-all duration-300 cursor-pointer group"
                    style={{ transform: 'rotate(-5deg) translateY(14px)' }}
                    title="Karthik NP — Exploring"
                  >
                    <div className="rounded-2xl overflow-hidden bg-[#F3EFE9] border border-[#D5CDBD] p-1 shadow-[0_12px_28px_rgba(20,19,18,0.12)] group-hover:border-[#141312] transition-colors">
                      <img
                        src="/karthik-cheeky-1.png"
                        alt="Karthik NP"
                        className="w-full h-[180px] sm:h-[220px] lg:h-[240px] object-contain object-bottom"
                        draggable="false"
                      />
                    </div>
                  </div>

                  {/* Photo 2 — Center dominant frame */}
                  <div
                    className="relative z-20 w-[38%] sm:w-[145px] lg:w-[165px] shrink-0 hover:z-30 hover:scale-105 transition-all duration-300 cursor-pointer -mx-3 sm:-mx-4 group"
                    style={{ transform: 'rotate(0deg) translateY(-8px)' }}
                    title="Karthik NP — Candid"
                  >
                    <div className="rounded-2xl overflow-hidden bg-[#EFEAE1] border-2 border-[#D5CDBD] p-1 shadow-[0_16px_36px_rgba(20,19,18,0.18)] group-hover:border-[#E03E2D] transition-colors">
                      <img
                        src="/karthik-cheeky-2.png"
                        alt="Karthik NP"
                        className="w-full h-[195px] sm:h-[240px] lg:h-[265px] object-contain object-bottom"
                        draggable="false"
                      />
                    </div>
                  </div>

                  {/* Photo 3 — Right angled frame */}
                  <div
                    className="relative z-10 w-[33%] sm:w-[130px] lg:w-[145px] shrink-0 hover:z-30 hover:scale-105 transition-all duration-300 cursor-pointer group"
                    style={{ transform: 'rotate(5deg) translateY(8px)' }}
                    title="Karthik NP — Off the Clock"
                  >
                    <div className="rounded-2xl overflow-hidden bg-[#F3EFE9] border border-[#D5CDBD] p-1 shadow-[0_12px_28px_rgba(20,19,18,0.12)] group-hover:border-[#141312] transition-colors">
                      <img
                        src="/karthik-cheeky-3.png"
                        alt="Karthik NP"
                        className="w-full h-[180px] sm:h-[220px] lg:h-[240px] object-contain object-bottom"
                        draggable="false"
                      />
                    </div>
                  </div>
                </div>

                {/* Subtitle / Caption for the 3 frames */}
                <div className="flex items-center gap-2 mt-4 text-[#8C857B] font-mono text-[10.5px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C857B]"></span>
                  <span>3 Perspectives · Off the Clock</span>
                </div>

              </div>

            </div>

          </div>
        </div>


        {/* ═══════════════════════════════════════════════════════
            BLOCK 2 — INDIA TRAVEL ARCHIVE & INTERACTIVE MAP
        ═══════════════════════════════════════════════════════ */}
        <div id="bucket-list" className="w-full relative">

          {/* Section Header & Minimal Filters */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
            <div className="flex flex-col">
              <span className="section-kicker">
                [ 02 // TRAVEL ARCHIVE ]
              </span>
              <h3 className="font-notch text-[28px] sm:text-[38px] font-bold text-[#141312] mt-1.5">
                India: Explored <span className="text-[#5C574F]">&amp; Wishlist</span>.
              </h3>
              <p className="font-headline text-[14px] text-[#5C574F] mt-1">
                <span className="font-semibold text-emerald-800">{visitedCount} Explored</span>
                <span className="mx-2 text-[#CBD5E1]">·</span>
                <span className="font-semibold text-[#E03E2D]">{bucketCount} on the Wishlist</span>
              </p>
            </div>

            {/* Filter Toggle Buttons */}
            <div className="p-1 rounded-full bg-white border border-[#E5DFD5] inline-flex items-center gap-1 shadow-2xs self-start md:self-auto">
              {[
                { key: 'ALL', label: `All (${visitedCount + bucketCount})` },
                { key: 'VISITED', label: `Explored (${visitedCount})` },
                { key: 'BUCKET_LIST', label: `Wishlist (${bucketCount})` },
              ].map(f => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setActiveFilter(f.key)}
                  className={`px-3.5 py-1.5 rounded-full font-headline text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeFilter === f.key
                      ? 'bg-[#141312] text-white shadow-xs'
                      : 'text-[#5C574F] hover:text-[#141312]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Map + Place Info Container */}
          <div className="w-full rounded-[32px] bg-white border border-[#E5DFD5] p-5 sm:p-8 shadow-[0_16px_40px_rgba(20,19,18,0.03)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">

            {/* SVG India Map */}
            <div className="lg:col-span-7 min-h-[460px] sm:min-h-[540px] relative rounded-[24px] bg-[#FBF9F5] border border-[#E5DFD5] p-4 sm:p-6 flex items-center justify-center overflow-hidden">
              
              <div className="absolute top-4 left-4 font-mono text-[10px] text-[#8C857B] tracking-widest uppercase font-bold">
                Map Canvas · India
              </div>

              <svg
                viewBox={indiaViewBoxes.allIndia}
                className="w-full h-full max-h-[500px] transition-all duration-500 ease-out"
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
                        fill={isSelected ? '#F7EBE8' : '#EFEAE1'}
                        stroke={isSelected ? '#E03E2D' : '#D5CDBD'}
                        strokeWidth={isSelected ? 1.4 : 0.6}
                        className="transition-colors duration-200 hover:fill-[#E8E2D7]"
                      />
                    )
                  })}
                </g>

                {/* Trail connections between visited locations */}
                {(() => {
                  const vis = indiaTravelPlaces.filter(p => p.status === 'VISITED' && (activeFilter === 'ALL' || activeFilter === 'VISITED'))
                  return vis.slice(0, vis.length - 1).map((p, i) => {
                    const n = vis[i + 1]
                    return (
                      <line
                        key={`trail-${i}`}
                        x1={p.svgX} y1={p.svgY}
                        x2={n.svgX} y2={n.svgY}
                        stroke="#059669"
                        strokeWidth="0.8"
                        strokeDasharray="4 3"
                        opacity="0.4"
                      />
                    )
                  })
                })()}

                {/* Interactive Destination Pins */}
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
                      {/* Active pulse aura */}
                      {isSel && (
                        <circle
                          cx="0" cy="0" r="14"
                          fill={isVis ? '#059669' : '#E03E2D'}
                          fillOpacity="0.2"
                          className="animate-ping"
                        />
                      )}

                      {/* Pin Circle */}
                      <circle
                        cx="0" cy="0"
                        r={isSel ? 6.5 : isHov ? 5.5 : 4}
                        fill={isVis ? '#059669' : '#E03E2D'}
                        stroke="#FFFFFF"
                        strokeWidth={isSel ? 2 : 1.5}
                        className="transition-all duration-200"
                      />

                      {/* Minimal Label Tooltip on Hover / Select */}
                      {(isSel || isHov) && (
                        <g transform="translate(0, -12)">
                          <rect
                            x={-(place.name.length * 3.6)}
                            y="-13"
                            width={place.name.length * 7.2}
                            height="16"
                            rx="5"
                            fill="#141312"
                            fillOpacity="0.95"
                          />
                          <text
                            x="0"
                            y="-2"
                            textAnchor="middle"
                            fill="#FFFFFF"
                            fontSize="8"
                            fontWeight="bold"
                            fontFamily="sans-serif"
                          >
                            {place.name}
                          </text>
                        </g>
                      )}
                    </g>
                  )
                })}
              </svg>

              {/* Clean Map Legend */}
              <div className="absolute bottom-4 left-4 p-3 rounded-2xl bg-white/95 border border-[#E5DFD5] text-[11px] font-mono flex flex-col gap-1.5 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#059669] shrink-0" />
                  <span className="font-semibold text-[#141312]">Explored ({visitedCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E03E2D] shrink-0" />
                  <span className="font-semibold text-[#141312]">Wishlist ({bucketCount})</span>
                </div>
              </div>

            </div>

            {/* Selected Destination Card & Direct Switcher */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              
              {/* Destination Detail Card */}
              <div className="p-6 sm:p-7 rounded-[26px] bg-[#FBF9F5] border border-[#E5DFD5] shadow-xs flex flex-col gap-3">
                
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider ${
                    selectedPlace.status === 'VISITED'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-[#E03E2D] border border-rose-200'
                  }`}>
                    {selectedPlace.status === 'VISITED' ? 'Explored' : 'Wishlist Destination'}
                  </span>

                  <span className="font-mono text-[11px] text-[#8C857B]">
                    {selectedPlace.state}
                  </span>
                </div>

                <h4 className="font-notch text-[26px] sm:text-[30px] font-bold text-[#141312] leading-tight">
                  {selectedPlace.name}
                </h4>

                <p className="font-headline text-[13.5px] leading-relaxed text-[#5C574F]">
                  {selectedPlace.annotation}
                </p>

                {selectedPlace.hasRealPhotos && (
                  <div className="mt-2 pt-3 border-t border-[#E5DFD5] flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[#059669] font-semibold">
                      Photographs in camera roll
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoFilter(selectedPlace.folder)
                        document.getElementById('photos')?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="text-[11px] font-headline font-bold bg-[#141312] text-white px-3 py-1 rounded-full hover:bg-[#E03E2D] transition-colors cursor-pointer"
                    >
                      View Photos ↓
                    </button>
                  </div>
                )}
              </div>

              {/* Destination Pill List */}
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] uppercase text-[#8C857B] font-bold tracking-wider">
                  Select Destination:
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-[190px] overflow-y-auto pr-1 pb-1">
                  {filteredPlaces.map((place) => (
                    <button
                      key={place.id}
                      type="button"
                      onClick={() => handleSelectPlace(place)}
                      className={`px-3 py-1.5 rounded-full font-headline text-[12px] font-semibold transition-all cursor-pointer ${
                        selectedPlaceId === place.id
                          ? place.status === 'VISITED'
                            ? 'bg-emerald-800 text-white shadow-xs'
                            : 'bg-[#E03E2D] text-white shadow-xs'
                          : place.status === 'VISITED'
                          ? 'bg-white text-emerald-900 border border-emerald-200 hover:bg-emerald-50'
                          : 'bg-white text-[#5C574F] border border-[#E5DFD5] hover:border-[#141312] hover:text-[#141312]'
                      }`}
                    >
                      {place.name}
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>


        {/* ═══════════════════════════════════════════════════════
            BLOCK 3 — PHOTOGRAPHY / CAMERA ROLL
        ═══════════════════════════════════════════════════════ */}
        <div id="photos" className="w-full relative">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
            <div className="flex flex-col">
              <span className="section-kicker">
                [ 03 // PHOTOGRAPHY ]
              </span>
              <h3 className="font-notch text-[28px] sm:text-[38px] font-bold text-[#141312] mt-1.5">
                Camera Roll <span className="text-[#5C574F]">&amp; Frames</span>.
              </h3>
              <p className="font-headline text-[14px] text-[#5C574F] mt-1">
                Heritage stone monuments, coastal sunsets, and dynamic skies across India.
              </p>
            </div>

            {/* Photo Category Filter Tabs */}
            <div className="flex items-center gap-1.5 flex-wrap self-start sm:self-auto">
              {[
                { key: 'all', label: `All (${realCloudinaryPhotos.length})` },
                { key: 'thanjavur', label: 'Thanjavur Temples' },
                { key: 'sky_moon', label: 'Skies & Sunsets' },
                { key: 'portfolio', label: 'Archive' },
              ].map(f => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => handlePhotoFilterChange(f.key)}
                  className={`px-3.5 py-1.5 rounded-full font-headline text-[11.5px] font-bold tracking-wide transition-all cursor-pointer ${
                    photoFilter === f.key
                      ? 'bg-[#141312] text-white shadow-xs'
                      : 'bg-white text-[#5C574F] border border-[#E5DFD5] hover:border-[#141312] hover:text-[#141312]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clean Photographic Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 items-start">
            {photosToDisplay.map((photo, idx) => {
              const cloudUrl = getCloudinaryUrl(photo.publicId, { width: 800, quality: 'auto', format: 'auto' })
              const hasError = imgErrors[photo.id]
              return (
                <div
                  key={photo.id || idx}
                  onClick={() => !hasError && setActivePhoto(photo)}
                  className={`group relative bg-white p-3 rounded-2xl border border-[#E5DFD5] shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
                    hasError ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  {/* Photo Container */}
                  <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-[#EFEAE1] relative">
                    {!hasError ? (
                      <img
                        src={cloudUrl}
                        alt={photo.caption}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        onError={() => handleImgError(photo.id)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-mono text-[11px] text-[#8C857B] flex-col gap-1">
                        <span>Unable to load</span>
                      </div>
                    )}
                  </div>

                  {/* Clean Caption & Location */}
                  <div className="mt-3 flex flex-col gap-0.5 px-0.5">
                    <span className="font-headline text-[12.5px] sm:text-[13px] font-semibold text-[#141312] leading-snug line-clamp-1 group-hover:text-[#E03E2D] transition-colors">
                      {photo.caption}
                    </span>
                    <span className="font-mono text-[9.5px] text-[#8C857B]">
                      {photo.note}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Clean Load More Button */}
          {hasMorePhotos && (
            <div className="flex justify-center mt-10">
              <button
                type="button"
                onClick={() => setVisiblePhotos(v => v + PHOTOS_PER_PAGE)}
                className="btn-secondary text-[13px] px-6 py-3 cursor-pointer shadow-xs hover:border-[#141312]"
              >
                <span>Load More Photos</span>
                <span className="font-mono text-[11px] text-[#8C857B]">
                  ({allFilteredPhotos.length - visiblePhotos} remaining)
                </span>
              </button>
            </div>
          )}

        </div>


        {/* ═══════════════════════════════════════════════════════
            BLOCK 4 — DISCIPLINES: READING & PHYSICAL TRAINING
        ═══════════════════════════════════════════════════════ */}
        <div className="w-full flex flex-col gap-8">
          
          <div className="flex flex-col">
            <span className="section-kicker">
              [ 04 // DISCIPLINES ]
            </span>
            <h3 className="font-notch text-[28px] sm:text-[38px] font-bold text-[#141312] mt-1.5">
              Beyond the Terminal.
            </h3>
            <p className="font-headline text-[14px] text-[#5C574F] mt-1">
              The books, routines, and physical habits that keep thinking clear and grounded.
            </p>
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Book Card */}
            <div className="lg:col-span-6 xl:col-span-7 bg-white rounded-[32px] border border-[#E5DFD5] p-7 sm:p-10 shadow-2xs flex flex-col justify-between gap-6">
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-7">
                
                {/* 3D Book Silhouette */}
                <div
                  className="relative w-[140px] sm:w-[155px] h-[210px] sm:h-[225px] rounded-r-xl rounded-l-sm bg-[#141312] text-white p-4 flex flex-col justify-between shrink-0 shadow-[12px_14px_30px_rgba(20,19,18,0.35)] overflow-hidden"
                  style={{ transform: 'rotate(-2deg)' }}
                >
                  {/* Spine shadow */}
                  <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/80 to-transparent" />
                  {/* Crimson accent curve */}
                  <div className="absolute bottom-0 left-0 right-0 h-[36%] bg-[#CC0000]" style={{ clipPath: 'polygon(0 30%, 100% 0%, 100% 100%, 0% 100%)' }} />
                  {/* Bookmark ribbon */}
                  <div className="absolute -bottom-5 right-5 w-3 h-8 bg-[#FFD700] shadow-md" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)' }} />
                  
                  <div className="pl-1.5 flex flex-col gap-1.5 relative z-10">
                    <span className="font-mono text-[7.5px] uppercase tracking-widest text-[#CC0000] font-black">MEMOIR</span>
                    <h5 className="font-notch text-[18px] font-black text-[#D4A017] leading-[1.0] mt-0.5 tracking-tight">
                      SHOE<br />DOG
                    </h5>
                    <p className="font-headline text-[7.5px] text-white/70 leading-tight">
                      By <span className="font-bold text-white">Phil Knight</span>
                    </p>
                  </div>

                  <div className="pl-1.5 pb-0.5 font-mono text-[7.5px] text-white/80 relative z-10 font-bold">
                    CREATOR OF NIKE
                  </div>
                </div>

                {/* Book Details & Reflection */}
                <div className="flex flex-col gap-3">
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#E03E2D]">
                    {scrapbookContent.readingBook.tagline}
                  </span>

                  <h4 className="font-notch text-[22px] sm:text-[26px] font-bold text-[#141312] leading-tight">
                    {scrapbookContent.readingBook.title}
                  </h4>

                  <p className="font-headline text-[13.5px] text-[#5C574F] leading-relaxed">
                    {scrapbookContent.readingBook.subtitle}
                  </p>

                  <div className="p-3.5 rounded-2xl bg-[#F8F5EE] border border-[#E5DFD5] font-editorial italic text-[13px] text-[#2B2825] leading-relaxed">
                    "{scrapbookContent.readingBook.reflection}"
                  </div>
                </div>

              </div>

              {/* Progress Bar */}
              <div className="pt-4 border-t border-[#E5DFD5] flex flex-col gap-2">
                <div className="flex items-center justify-between font-mono text-[11px] text-[#8C857B]">
                  <span>Progress: {scrapbookContent.readingBook.progress}</span>
                  <span className="font-semibold text-[#141312]">{scrapbookContent.readingBook.status}</span>
                </div>
                <div className="w-full h-2 bg-[#EFEAE1] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#141312] rounded-full transition-all duration-500"
                    style={{ width: `${scrapbookContent.readingBook.progressPercent}%` }}
                  />
                </div>
              </div>

            </div>

            {/* Physical Training Card */}
            <div className="lg:col-span-6 xl:col-span-5 bg-white rounded-[32px] border border-[#E5DFD5] p-7 sm:p-9 shadow-2xs flex flex-col justify-between gap-6">
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD5]">
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#E03E2D]">
                      PHYSICAL DISCIPLINE
                    </span>
                    <h4 className="font-notch text-[20px] sm:text-[22px] font-bold text-[#141312] mt-0.5">
                      {scrapbookContent.fitnessFragment.title}
                    </h4>
                  </div>
                  <span className="font-mono text-[10px] text-[#8C857B]">
                    Active Habits
                  </span>
                </div>

                <p className="font-headline text-[13px] text-[#5C574F]">
                  {scrapbookContent.fitnessFragment.subtitle}
                </p>

                {/* Training Metric Items */}
                <div className="flex flex-col gap-4 pt-1">
                  {scrapbookContent.fitnessFragment.items.map((fit) => (
                    <div key={fit.name} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between font-headline text-[13px] font-semibold text-[#141312]">
                        <span>{fit.name}</span>
                        <span className="font-mono text-[13px] font-bold text-[#E03E2D]">
                          {fit.value} <span className="text-[11px] font-normal text-[#8C857B]">{fit.unit}</span>
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#EFEAE1] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#141312] rounded-full"
                          style={{ width: `${fit.barPercent}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-[#8C857B]">{fit.note}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8F5EE] border border-[#E5DFD5] font-editorial italic text-[12.5px] text-[#5C574F]">
                "{scrapbookContent.fitnessFragment.reflection}"
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* PHOTO LIGHTBOX MODAL */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-[640px] w-full p-5 sm:p-7 flex flex-col gap-4 relative shadow-2xl border border-[#E5DFD5]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-headline text-[15px] font-bold text-[#141312]">{activePhoto.caption}</span>
                <span className="font-mono text-[10.5px] text-[#8C857B] mt-0.5">{activePhoto.note}</span>
              </div>

              <button
                onClick={() => setActivePhoto(null)}
                className="w-8 h-8 rounded-full bg-[#F3EFE9] border border-[#E5DFD5] text-[#141312] font-bold flex items-center justify-center text-xs cursor-pointer hover:bg-[#141312] hover:text-white transition-colors"
                title="Close"
              >
                ✕
              </button>
            </div>

            <div className="w-full h-[360px] sm:h-[440px] rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              <img
                src={getCloudinaryUrl(activePhoto.publicId, { width: 1400, quality: 'auto' })}
                alt={activePhoto.caption}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
