/**
 * visitorTracker.js - High-Reliability Live Visitor Counter
 * 
 * Features:
 * 1. Primary: CountAPI (mileshilliard.com) - Instant, CORS-ready, adblock-resilient.
 * 2. Session-aware: Increments once per user browsing session (via sessionStorage)
 *    so multiple page switches / refreshes read the live count without spamming.
 * 3. Multi-tier Fallback: Secondary fallback to GoatCounter TOTAL.json.
 * 4. Local Persistence: localStorage caching for instant zero-flicker render.
 */

const STORAGE_KEY_VISITOR_COUNT = 'karthik_portfolio_visitor_count'
const SESSION_KEY_COUNTED = 'karthik_session_counted'
const COUNTER_KEY = 'karthiknp_portfolio_visitors'
const BASE_FLOOR = 44

/**
 * Fetch live visitor count with real-time increment on new session
 */
export async function fetchVisitorCount() {
  if (typeof window === 'undefined') return BASE_FLOOR

  // Determine whether this is a new session (needs increment) or existing (just read)
  let isNewSession = false
  try {
    isNewSession = !sessionStorage.getItem(SESSION_KEY_COUNTED)
  } catch (e) {
    isNewSession = true
  }

  // CountAPI endpoints: /hit/ to increment, /get/ to read
  const action = isNewSession ? 'hit' : 'get'
  const countApiUrl = `https://countapi.mileshilliard.com/api/v1/${action}/${COUNTER_KEY}`

  // Strategy 1: Try CountAPI
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 4000)

    const res = await fetch(countApiUrl, {
      signal: controller.signal,
      cache: 'no-cache',
    })
    clearTimeout(timeoutId)

    if (res.ok) {
      const data = await res.json()
      if (data && typeof data.value === 'number') {
        const count = Math.max(data.value, BASE_FLOOR)
        try {
          sessionStorage.setItem(SESSION_KEY_COUNTED, 'true')
          localStorage.setItem(STORAGE_KEY_VISITOR_COUNT, String(count))
        } catch (e) {}
        return count
      }
    }
  } catch (err) {
    // CountAPI timed out or offline, proceed to fallback
  }

  // Strategy 2: Fallback to GoatCounter TOTAL.json
  try {
    const gcUrl = `https://karthiknp.goatcounter.com/counter/TOTAL.json?_=${Date.now()}`
    const res = await fetch(gcUrl, { cache: 'no-cache' })
    if (res.ok) {
      const data = await res.json()
      const raw = data.count || data.count_unique
      if (raw) {
        const parsed = parseInt(String(raw).replace(/,/g, ''), 10)
        if (!isNaN(parsed) && parsed > 0) {
          const count = Math.max(parsed, BASE_FLOOR)
          try {
            localStorage.setItem(STORAGE_KEY_VISITOR_COUNT, String(count))
          } catch (e) {}
          return count
        }
      }
    }
  } catch (err) {
    // ignore
  }

  // Strategy 3: Fallback to locally cached value
  try {
    const cached = localStorage.getItem(STORAGE_KEY_VISITOR_COUNT)
    if (cached) {
      const parsed = parseInt(cached, 10)
      if (!isNaN(parsed) && parsed >= BASE_FLOOR) return parsed
    }
  } catch (e) {}

  return BASE_FLOOR
}

// Export alias for backwards compatibility
export const fetchGoatCounterCount = fetchVisitorCount

/**
 * Get initial cached count for instant zero-flicker render
 */
export function getInitialVisitorCount() {
  if (typeof window === 'undefined') return BASE_FLOOR

  try {
    const cached = localStorage.getItem(STORAGE_KEY_VISITOR_COUNT)
    if (cached !== null) {
      const parsed = parseInt(cached, 10)
      if (!isNaN(parsed) && parsed >= BASE_FLOOR) return parsed
    }
  } catch (e) {}

  return BASE_FLOOR
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
