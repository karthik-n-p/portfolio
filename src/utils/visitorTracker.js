/**
 * visitorTracker.js - Live GoatCounter Web Analytics Engine
 *
 * Direct integration with https://karthiknp.goatcounter.com
 * Fetches real visitor stats from GoatCounter's public API.
 */

const STORAGE_KEY_GOAT_COUNT = 'karthik_goatcounter_count'
const STORAGE_OLD_FAKE_KEY = 'karthik_portfolio_visitor_count'

// Clean up any legacy artificial test count from browser storage
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem(STORAGE_OLD_FAKE_KEY)
  } catch (e) {
    // ignore
  }
}

export const GOATCOUNTER_CODE =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GOATCOUNTER_CODE) ||
  'karthiknp'

/**
 * Fetch live visitor count directly from GoatCounter API
 */
export async function fetchGoatCounterCount(code = GOATCOUNTER_CODE) {
  if (typeof window === 'undefined') return null

  const endpoints = [
    `https://${code}.goatcounter.com/counter//.json`,
    `https://${code}.goatcounter.com/counter/TOTAL.json`,
  ]

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
        cache: 'no-cache',
      })
      if (res.ok) {
        const data = await res.json()
        const rawCount = data.count || data.count_unique
        if (rawCount !== undefined && rawCount !== null) {
          const parsed = parseInt(String(rawCount).replace(/,/g, ''), 10)
          if (!isNaN(parsed) && parsed >= 0) {
            localStorage.setItem(STORAGE_KEY_GOAT_COUNT, parsed.toString())
            return parsed
          }
        }
      }
    } catch (err) {
      // ignore network/adblocker errors and try next endpoint
    }
  }

  // Fallback to locally cached real GoatCounter count
  try {
    const cached = localStorage.getItem(STORAGE_KEY_GOAT_COUNT)
    if (cached !== null) {
      const parsed = parseInt(cached, 10)
      if (!isNaN(parsed)) return parsed
    }
  } catch (e) {}

  return null
}

/**
 * Get initial cached count for instant zero-flicker render
 */
export function getInitialVisitorCount() {
  if (typeof window === 'undefined') return 1

  try {
    const cached = localStorage.getItem(STORAGE_KEY_GOAT_COUNT)
    if (cached !== null) {
      const parsed = parseInt(cached, 10)
      if (!isNaN(parsed)) return parsed
    }
  } catch (e) {}

  return null
}

/**
 * Trigger GoatCounter pageview registration if script is loaded
 */
export function triggerGoatCounterHit(path = '/') {
  if (typeof window !== 'undefined' && window.goatcounter && typeof window.goatcounter.count === 'function') {
    try {
      window.goatcounter.count({
        path: path,
        title: document.title,
        event: false,
      })
    } catch (e) {}
  }
}

/**
 * Hearts counter persistence
 */
const STORAGE_KEY_HEARTS = 'karthik_portfolio_hearts'
const STORAGE_KEY_LIKED = 'karthik_portfolio_liked'
const BASE_HEARTS = 42

export function getHeartsData() {
  if (typeof window === 'undefined') return { count: BASE_HEARTS, liked: false }

  try {
    const storedHearts = localStorage.getItem(STORAGE_KEY_HEARTS)
    const storedLiked = localStorage.getItem(STORAGE_KEY_LIKED) === 'true'
    const count = storedHearts ? parseInt(storedHearts, 10) : BASE_HEARTS
    return { count: isNaN(count) ? BASE_HEARTS : count, liked: storedLiked }
  } catch (e) {
    return { count: BASE_HEARTS, liked: false }
  }
}

export function incrementHeart() {
  if (typeof window === 'undefined') return BASE_HEARTS + 1

  try {
    const current = getHeartsData()
    if (!current.liked) {
      const newCount = current.count + 1
      localStorage.setItem(STORAGE_KEY_HEARTS, newCount.toString())
      localStorage.setItem(STORAGE_KEY_LIKED, 'true')
      return { count: newCount, liked: true }
    }
    return current
  } catch (e) {
    return { count: BASE_HEARTS + 1, liked: true }
  }
}
