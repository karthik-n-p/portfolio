/**
 * supabaseLockin.js
 * Supabase client and data fetcher for live reading and workout telemetry.
 */

const FALLBACK_SUPABASE_URL = 'https://mntwuxdmgqwrztfucyuz.supabase.co'
const FALLBACK_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1udHd1eGRtZ3F3cnp0ZnVjeXV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1ODU5OTMsImV4cCI6MjEwNjE2MTk5M30.nCMh1laLyVTSKBJplxvmoqTAHyjTNoWFF4nw23jLFRw'

export const SUPABASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  FALLBACK_SUPABASE_URL

export const SUPABASE_ANON_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  FALLBACK_SUPABASE_ANON_KEY

/**
 * Standard default payload matching the prompt JSON specification.
 * Used for immediate rendering and robust fallback whenever Supabase
 * is initializing, paused, or network is disconnected.
 */
export const DEFAULT_LOCKIN_DATA = {
  id: 'latest',
  updated_at: '2026-09-29T12:50:00.000Z',
  reading: {
    start_date: '2026-01-01',
    streak: 5,
    longest_streak: 14,
    today_pages_read: 20,
    today_page_goal: 20,
    total_pages_read: 1845,
    max_pages_single_day: 85,
    completed_books_count: 6,
    current_book: {
      id: 'shoe-dog',
      title: 'Shoe Dog',
      author: 'Phil Knight',
      total_pages: 386,
      current_page: 277,
      progress_fraction: 0.7176,
      progress_percent: 72,
      cover_url: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1457284880i/27220736.jpg',
      status: 'CURRENT',
      tagline: 'Currently Reading',
    },
    previous_reads: [
      {
        id: 'atomic-habits',
        title: 'Atomic Habits',
        author: 'James Clear',
        pages: 320,
        finished_date: '2024-04-15',
        topic: 'Systems & Habit Compounding',
      },
      {
        id: 'psychology-of-money',
        title: 'The Psychology of Money',
        author: 'Morgan Housel',
        pages: 252,
        finished_date: '2024-08-20',
        topic: 'Behavioral Finance & Mindset',
      },
      {
        id: 'ikigai',
        title: 'Ikigai: The Japanese Secret to a Long and Happy Life',
        author: 'Héctor García & Francesc Miralles',
        pages: 208,
        finished_date: '2024-12-10',
        topic: 'Purpose, Flow & Longevity',
      },
      {
        id: 'same-as-ever',
        title: 'Same as Ever: A Guide to What Never Changes',
        author: 'Morgan Housel',
        pages: 240,
        finished_date: '2025-05-18',
        topic: 'Human Nature, Invariance & Risk',
      },
      {
        id: 'hidden-potential',
        title: 'Hidden Potential: The Science of Achieving Greater Things',
        author: 'Adam Grant',
        pages: 304,
        finished_date: '2025-09-25',
        topic: 'Growth Mindset & Character Skills',
      },
      {
        id: 'almanack-naval-ravikant',
        title: 'The Almanack of Naval Ravikant',
        author: 'Eric Jorgenson',
        pages: 244,
        finished_date: '2026-01-14',
        topic: 'Wealth Creation, Leverage & Judgment',
      },
    ],
  },
  workout: {
    start_date: '2026-01-01',
    streak: 22,
    longest_streak: 22,
    today_pushups: 81,
    today_plank_seconds: 143,
    dynamic_pushup_goal: 40,
    dynamic_plank_goal: 180,
    total_pushups: 752,
    total_plank_seconds: 4085,
    longest_plank_pr_seconds: 422,
    max_pushups_pr: 40,
    rpg_level: 15,
    rpg_title: 'Discipline Seeker',
  },
}

/**
 * Convert seconds into a human-readable "Xm Ys" or "Xs" string.
 * @param {number} totalSeconds
 * @returns {string}
 */
export function formatSeconds(totalSeconds) {
  if (!totalSeconds || isNaN(totalSeconds)) return '0s'
  const sec = Math.round(Number(totalSeconds))
  const mins = Math.floor(sec / 60)
  const remainingSecs = sec % 60
  if (mins === 0) return `${remainingSecs}s`
  if (remainingSecs === 0) return `${mins}m`
  return `${mins}m ${remainingSecs}s`
}

/**
 * Format numbers with comma separators (e.g. 1850 -> "1,850").
 * @param {number|string} num
 * @returns {string}
 */
export function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return '0'
  return Number(num).toLocaleString('en-US')
}

/**
 * Returns human-readable relative time from ISO string.
 * @param {string} isoString
 * @returns {string}
 */
export function formatTimeAgo(isoString) {
  if (!isoString) return 'Active'
  try {
    const date = new Date(isoString)
    if (isNaN(date.getTime())) return 'Active'
    const now = new Date()
    const diffSec = Math.floor((now - date) / 1000)

    if (diffSec < 60) return 'Just now'
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`
    if (diffSec < 172800) return 'Yesterday'
    return `${Math.floor(diffSec / 86400)}d ago`
  } catch {
    return 'Active'
  }
}

/**
 * Format date into "MMM D, YYYY" or "MMM YYYY".
 * @param {string} dateStr
 * @returns {string}
 */
export function formatDate(dateStr) {
  if (!dateStr) return 'Jan 2026'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return String(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return String(dateStr)
  }
}

/**
 * Deep merge helper to ensure partial Supabase records safely adopt defaults.
 */
function mergeWithDefaults(incoming) {
  if (!incoming || typeof incoming !== 'object') return DEFAULT_LOCKIN_DATA

  const incReading = incoming.reading || {}
  const incWorkout = incoming.workout || {}

  const previousReads =
    (Array.isArray(incReading.previous_reads) && incReading.previous_reads.length > 0)
      ? incReading.previous_reads
      : (Array.isArray(incReading.previous_books) && incReading.previous_books.length > 0)
      ? incReading.previous_books
      : DEFAULT_LOCKIN_DATA.reading.previous_reads

  const prevPagesSum = previousReads.reduce((sum, b) => sum + (Number(b.pages) || 0), 0)
  const incBook = incReading.current_book || {}
  const currentPage = Number(incBook.current_page) || DEFAULT_LOCKIN_DATA.reading.current_book.current_page
  const totalPages = Number(incBook.total_pages) || DEFAULT_LOCKIN_DATA.reading.current_book.total_pages
  const progressPercent = totalPages > 0 ? Math.min(100, Math.round((currentPage / totalPages) * 100)) : (incBook.progress_percent || 72)
  const progressFraction = totalPages > 0 ? +(currentPage / totalPages).toFixed(4) : (incBook.progress_fraction || 0.7176)

  // Ensure total_pages_read is at least prevPagesSum + currentPage if database has an outdated or daily-only value
  const totalPagesFromPayload = Number(incReading.total_pages_read) || 0
  const computedTotalPages = prevPagesSum + currentPage
  const totalPagesRead = totalPagesFromPayload >= computedTotalPages ? totalPagesFromPayload : computedTotalPages

  // Ensure completed_books_count is not 0 when books exist
  const completedBooksCount = (typeof incReading.completed_books_count === 'number' && incReading.completed_books_count > 0)
    ? incReading.completed_books_count
    : previousReads.length

  // Filter out invalid/search cover URLs
  let coverUrl = incBook.cover_url
  if (!coverUrl || typeof coverUrl !== 'string' || coverUrl.includes('google.com/search') || !coverUrl.startsWith('http')) {
    coverUrl = DEFAULT_LOCKIN_DATA.reading.current_book.cover_url
  }

  // Ensure dynamic_plank_goal is not accidentally set to the all-time PR (422s)
  let dynamicPlankGoal = Number(incWorkout.dynamic_plank_goal) || DEFAULT_LOCKIN_DATA.workout.dynamic_plank_goal
  const longestPlankPr = Number(incWorkout.longest_plank_pr_seconds) || DEFAULT_LOCKIN_DATA.workout.longest_plank_pr_seconds
  if (dynamicPlankGoal === longestPlankPr && dynamicPlankGoal > 240) {
    dynamicPlankGoal = DEFAULT_LOCKIN_DATA.workout.dynamic_plank_goal
  }

  return {
    id: incoming.id || DEFAULT_LOCKIN_DATA.id,
    updated_at: incoming.updated_at || DEFAULT_LOCKIN_DATA.updated_at,
    reading: {
      ...DEFAULT_LOCKIN_DATA.reading,
      ...incReading,
      start_date: incReading.start_date || DEFAULT_LOCKIN_DATA.reading.start_date,
      total_pages_read: totalPagesRead,
      completed_books_count: completedBooksCount,
      current_book: {
        ...DEFAULT_LOCKIN_DATA.reading.current_book,
        ...incBook,
        current_page: currentPage,
        total_pages: totalPages,
        progress_percent: progressPercent,
        progress_fraction: progressFraction,
        cover_url: coverUrl,
      },
      previous_reads: previousReads,
    },
    workout: {
      ...DEFAULT_LOCKIN_DATA.workout,
      ...incWorkout,
      start_date: incWorkout.start_date || DEFAULT_LOCKIN_DATA.workout.start_date,
      dynamic_plank_goal: dynamicPlankGoal,
      longest_plank_pr_seconds: longestPlankPr,
    },
  }
}

/**
 * Fetch portfolio_lockin data from Supabase.
 * Endpoint: ${SUPABASE_URL}/rest/v1/portfolio_lockin?id=eq.latest&select=*
 */
export async function fetchPortfolioLockin(timeoutMs = 8000) {
  const cleanBaseUrl = (SUPABASE_URL || '')
    .replace(/\/+$/, '')
    .replace(/\/rest\/v1\/?$/, '')
  const url = `${cleanBaseUrl}/rest/v1/portfolio_lockin?id=eq.latest&select=*`

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Accept: 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      },
      signal: controller.signal,
    })

    clearTimeout(timer)

    if (!response.ok) {
      throw new Error(`Supabase returned HTTP ${response.status}: ${response.statusText}`)
    }

    const payload = await response.json()
    const record = Array.isArray(payload) ? payload[0] : payload

    if (!record) {
      // Table exists but record is empty
      return {
        data: DEFAULT_LOCKIN_DATA,
        isLive: false,
        error: 'No latest lockin record found in table.',
      }
    }

    const merged = mergeWithDefaults(record)
    return {
      data: merged,
      isLive: true,
      error: null,
    }
  } catch (err) {
    clearTimeout(timer)
    return {
      data: DEFAULT_LOCKIN_DATA,
      isLive: false,
      error: err.name === 'AbortError' ? 'Supabase request timed out' : err.message,
    }
  }
}
