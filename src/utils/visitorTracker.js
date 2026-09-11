/**
 * visitorTracker.js - Reliable Visitor Counter
 *
 * Architecture:
 * - Single source of truth: CountAPI (countapi.mileshilliard.com)
 * - Session-aware: only calls /hit/ once per browser session; all
 *   subsequent page navigations use /get/ so the count stays stable.
 * - Ratchet protection: the displayed number NEVER goes backwards.
 *   Once we've seen N=74, a later stale/lower response is ignored.
 * - localStorage cache: shown instantly on page load (zero flicker),
 *   and updated whenever we get a fresh value from the API.
 */

const STORAGE_KEY = 'karthik_portfolio_visitor_count'
const SESSION_KEY = 'karthik_session_counted'
const COUNTER_KEY = 'karthiknp_portfolio_visitors'
const BASE_FLOOR  = 44          // minimum ever shown

// ─── internal helpers ────────────────────────────────────────────────────────

function getCached() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return BASE_FLOOR
    const n = parseInt(raw, 10)
    return isNaN(n) ? BASE_FLOOR : Math.max(n, BASE_FLOOR)
  } catch (_) {
    return BASE_FLOOR
  }
}

function setCached(n) {
  try {
    // Ratchet: only write if the new value is >= what we already have
    const current = getCached()
    if (n >= current) {
      localStorage.setItem(STORAGE_KEY, String(n))
    }
  } catch (_) {}
}

function markSessionCounted() {
  try { sessionStorage.setItem(SESSION_KEY, '1') } catch (_) {}
}

function isSessionCounted() {
  try { return !!sessionStorage.getItem(SESSION_KEY) } catch (_) { return false }
}

// ─── public API ──────────────────────────────────────────────────────────────

/**
 * Fetch (and possibly increment) the live visitor count.
 * Returns a number that never decreases across calls.
 */
export async function fetchVisitorCount() {
  if (typeof window === 'undefined') return getCached()

  const action = isSessionCounted() ? 'get' : 'hit'
  const url = `https://countapi.mileshilliard.com/api/v1/${action}/${COUNTER_KEY}`

  try {
    const controller = new AbortController()
    const tid = setTimeout(() => controller.abort(), 5000)

    const res = await fetch(url, { signal: controller.signal, cache: 'no-cache' })
    clearTimeout(tid)

    if (res.ok) {
      const data = await res.json()
      if (data && typeof data.value === 'number') {
        const live = Math.max(data.value, BASE_FLOOR)

        // Mark session so future navigations use /get/ instead of /hit/
        markSessionCounted()

        // Ratchet-save to localStorage
        setCached(live)

        return getCached()   // always returns the highest value seen
      }
    }
  } catch (_) {
    // CountAPI unreachable (timeout, adblock, offline) — return cached best value
  }

  // Fallback: return best cached value (never less than what was seen before)
  return getCached()
}

// backwards-compat alias
export const fetchGoatCounterCount = fetchVisitorCount

/**
 * Instant cached count for zero-flicker first render.
 * Call this synchronously before the async fetchVisitorCount resolves.
 */
export function getInitialVisitorCount() {
  if (typeof window === 'undefined') return BASE_FLOOR
  return getCached()
}

/**
 * Trigger GoatCounter pageview (analytics only, not the counter source).
 */
export function triggerGoatCounterHit(path = '/') {
  if (
    typeof window !== 'undefined' &&
    window.goatcounter &&
    typeof window.goatcounter.count === 'function'
  ) {
    try {
      window.goatcounter.count({ path, title: document.title, event: false })
    } catch (_) {}
  }
}

// ─── Hearts ──────────────────────────────────────────────────────────────────

const HEARTS_KEY      = 'karthik_portfolio_hearts'
const HEARTS_LIKED_KEY = 'karthik_portfolio_liked'
const BASE_HEARTS     = 42

export function getHeartsData() {
  if (typeof window === 'undefined') return { count: BASE_HEARTS, liked: false }

  try {
    const raw    = localStorage.getItem(HEARTS_KEY)
    const liked  = localStorage.getItem(HEARTS_LIKED_KEY) === 'true'
    const count  = raw ? parseInt(raw, 10) : BASE_HEARTS
    return { count: isNaN(count) ? BASE_HEARTS : count, liked }
  } catch (_) {
    return { count: BASE_HEARTS, liked: false }
  }
}

export function incrementHeart() {
  if (typeof window === 'undefined') return { count: BASE_HEARTS + 1, liked: true }

  try {
    const { count, liked } = getHeartsData()
    if (!liked) {
      const next = count + 1
      localStorage.setItem(HEARTS_KEY, String(next))
      localStorage.setItem(HEARTS_LIKED_KEY, 'true')
      return { count: next, liked: true }
    }
    return { count, liked }
  } catch (_) {
    return { count: BASE_HEARTS + 1, liked: true }
  }
}
