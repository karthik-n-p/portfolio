/**
 * cloudinary.js - Cloudinary Asset Delivery Client
 * Cloud Name: ddmfpkfce | Folder: portfolio
 *
 * Photos are AUTO-FETCHED from Cloudinary at dev-server start + build time
 * via the vite-cloudinary-photos plugin (vite-plugin-cloudinary.js).
 * To refresh: restart `npm run dev` or trigger /api/cloudinary-refresh
 */
import { dynamicPhotos } from 'virtual:cloudinary-photos'

export const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'ddmfpkfce'
export const BASE_FOLDER = import.meta.env.VITE_CLOUDINARY_FOLDER || 'portfolio'
export const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY || '664168187261325'

/**
 * Generate an optimized Cloudinary delivery URL with automatic format and quality.
 */
export function getCloudinaryUrl(publicId, options = {}) {
  if (!publicId) return ''
  if (publicId.startsWith('http://') || publicId.startsWith('https://') || publicId.startsWith('/')) {
    return publicId
  }

  const {
    width = 900,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
  } = options

  const transforms = []
  if (crop) transforms.push(`c_${crop}`)
  if (width) transforms.push(`w_${width}`)
  if (height) transforms.push(`h_${height}`)
  if (quality) transforms.push(`q_${quality}`)
  if (format) transforms.push(`f_${format}`)

  const transformStr = transforms.length > 0 ? transforms.join(',') + '/' : ''
  const cleanId = publicId.replace(/^\/+/, '')

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformStr}${cleanId}`
}

// ── FALLBACK: hardcoded list used only if the Vite plugin didn't run ──────────
const FALLBACK_PHOTOS = [
  {
    id: 'cld-thanjavur-1',
    publicId: 'portfolio/Thanjavur/IMG_20251114_192429_098.webp',
    folder: 'thanjavur',
    caption: 'Thanjavur Great Temple at dusk',
    note: 'Brihadisvara thousand-year stone engineering',
    tilt: '-2.8deg',
    tapeColor: 'bg-amber-200/90',
    tapeTilt: '-3deg',
  },
  {
    id: 'cld-sky-1',
    publicId: 'portfolio/Sky_moon/IMG_20260516_180632.jpg',
    folder: 'sky_moon',
    caption: 'took 47 photos. kept this sunset.',
    note: 'golden hour horizon line',
    tilt: '2.5deg',
    tapeColor: 'bg-rose-200/90',
    tapeTilt: '3deg',
  },
  {
    id: 'cld-snap-1',
    publicId: 'portfolio/Snapchat-68484314.jpg',
    folder: 'portfolio',
    caption: 'somewhere between lost and happy',
    note: 'candid camera roll capture',
    tilt: '-1.5deg',
    tapeColor: 'bg-emerald-200/90',
    tapeTilt: '-2deg',
  },
  {
    id: 'cld-img-1',
    publicId: 'portfolio/IMG_20250601_175423.jpg',
    folder: 'portfolio',
    caption: 'finding a good view & staying there',
    note: 'coastal afternoon breeze',
    tilt: '3deg',
    tapeColor: 'bg-sky-200/90',
    tapeTilt: '1.5deg',
  },
  {
    id: 'cld-sky-2',
    publicId: 'portfolio/Sky_moon/IMG_20260906_185433.jpg',
    folder: 'sky_moon',
    caption: 'this view was worth the climb',
    note: 'twilight sky gradient',
    tilt: '-2deg',
    tapeColor: 'bg-yellow-200/90',
    tapeTilt: '-2.5deg',
  },
  {
    id: 'cld-img-2',
    publicId: 'portfolio/IMG_20260613_122044.jpg',
    folder: 'portfolio',
    caption: 'probably going back',
    note: 'weekend roadtrip trail',
    tilt: '1.8deg',
    tapeColor: 'bg-orange-200/90',
    tapeTilt: '2deg',
  },
  {
    id: 'cld-thanjavur-2',
    publicId: 'portfolio/Thanjavur/IMG-20251114-WA0331.jpg',
    folder: 'thanjavur',
    caption: 'monolithic granite pillars',
    note: 'Chola heritage architectural symmetry',
    tilt: '-3.2deg',
    tapeColor: 'bg-purple-200/90',
    tapeTilt: '-1deg',
  },
  {
    id: 'cld-img-3',
    publicId: 'portfolio/IMG_20260627_172357.jpg',
    folder: 'portfolio',
    caption: 'unnecessary side quests',
    note: 'chasing evening light',
    tilt: '2.2deg',
    tapeColor: 'bg-lime-200/90',
    tapeTilt: '3.5deg',
  },
  {
    id: 'cld-sky-3',
    publicId: 'portfolio/Sky_moon/IMG_20250501_183534.jpg',
    folder: 'sky_moon',
    caption: 'sky on fire at 6pm',
    note: 'May golden hour',
    tilt: '-1.8deg',
    tapeColor: 'bg-red-200/90',
    tapeTilt: '-2deg',
  },
  {
    id: 'cld-img-4',
    publicId: 'portfolio/IMG_20260613_190327.jpg',
    folder: 'portfolio',
    caption: 'one more photo then i stop',
    note: 'evening light catch',
    tilt: '3.4deg',
    tapeColor: 'bg-teal-200/90',
    tapeTilt: '2.5deg',
  },
  {
    id: 'cld-sky-4',
    publicId: 'portfolio/Sky_moon/IMG_20260906_183231.jpg',
    folder: 'sky_moon',
    caption: 'nobody warned me about this view',
    note: 'September sky haze',
    tilt: '-2.5deg',
    tapeColor: 'bg-indigo-200/90',
    tapeTilt: '-3deg',
  },
  {
    id: 'cld-sky-5',
    publicId: 'portfolio/Sky_moon/IMG_20251010_182620.jpg',
    folder: 'sky_moon',
    caption: 'the clouds were doing something',
    note: 'October dusk magic',
    tilt: '1.5deg',
    tapeColor: 'bg-pink-200/90',
    tapeTilt: '1deg',
  },
]

/**
 * Live photo list — auto-synced from Cloudinary via vite-plugin-cloudinary.js
 * dynamicPhotos is populated at dev-server start and production build time.
 * Falls back to FALLBACK_PHOTOS if plugin hasn't fetched yet.
 */
export const realCloudinaryPhotos =
  (dynamicPhotos && dynamicPhotos.length > 0) ? dynamicPhotos : FALLBACK_PHOTOS

/**
 * Filter photos by folder slug, or return full list.
 */
export function getPhotosByFolder(folderSlug) {
  if (!folderSlug || folderSlug === 'all') return realCloudinaryPhotos
  const filtered = realCloudinaryPhotos.filter(
    p => p.folder.toLowerCase() === folderSlug.toLowerCase()
  )
  return filtered.length > 0 ? filtered : realCloudinaryPhotos
}
