import { useState, useEffect, useCallback } from 'react'
import {
  fetchPortfolioLockin,
  DEFAULT_LOCKIN_DATA,
} from '../utils/supabaseLockin.js'

export function usePortfolioLockin() {
  const [data, setData] = useState(DEFAULT_LOCKIN_DATA)
  const [isLive, setIsLive] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastSynced, setLastSynced] = useState(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    const result = await fetchPortfolioLockin()
    setData(result.data)
    setIsLive(result.isLive)
    setError(result.error)
    setLastSynced(new Date())
    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()
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
