import { useState, useEffect, useCallback, useRef } from 'react'
import {
  fetchPortfolioLockin,
  DEFAULT_LOCKIN_DATA,
} from '../utils/supabaseLockin.js'

const CACHE_KEY = 'karthik_portfolio_lockin_cache'

function getInitialLockinData() {
  if (typeof window === 'undefined') return DEFAULT_LOCKIN_DATA
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && parsed.reading && parsed.workout) {
        return parsed
      }
    }
  } catch (_) {}
  return DEFAULT_LOCKIN_DATA
}

export function usePortfolioLockin() {
  const [data, setData] = useState(getInitialLockinData)
  const [isLive, setIsLive] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastSynced, setLastSynced] = useState(null)
  const isFetchingRef = useRef(false)

  const loadData = useCallback(async () => {
    if (isFetchingRef.current) return
    isFetchingRef.current = true
    setLoading(true)

    try {
      const result = await fetchPortfolioLockin()
      setData(result.data)
      setIsLive(result.isLive)
      setError(result.error)
      setLastSynced(new Date())

      if (result.isLive && typeof window !== 'undefined') {
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(result.data))
        } catch (_) {}
      }
    } catch (err) {
      setError(err?.message || 'Failed to fetch lockin telemetry')
    } finally {
      setLoading(false)
      isFetchingRef.current = false
    }
  }, [])

  useEffect(() => {
    loadData()

    // Periodically re-sync telemetry every 60 seconds
    const interval = setInterval(() => {
      loadData()
    }, 60000)

    // Re-sync when user returns to tab
    const handleVisibility = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        loadData()
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('focus', loadData)
      document.addEventListener('visibilitychange', handleVisibility)
    }

    return () => {
      clearInterval(interval)
      if (typeof window !== 'undefined') {
        window.removeEventListener('focus', loadData)
        document.removeEventListener('visibilitychange', handleVisibility)
      }
    }
  }, [loadData])

  return {
    data,
    isLive,
    loading,
    error,
    lastSynced,
    refresh: loadData,
  }
}

export default usePortfolioLockin
