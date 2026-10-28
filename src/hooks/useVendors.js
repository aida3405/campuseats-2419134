import { useState, useEffect, useCallback } from 'react'

export function useVendors() {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  //function trigger reload/retry
  const reload = useCallback(() => {
    setReloadKey((k) => k + 1)
  }, [])

  //fetch vendors data from the API endpoint
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    
    fetch('/api/vendors.json', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server returned status ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        setVendors(data)
        if (data.length > 0) {
          //select first vendor by default if available
          setSelectedVendorId(data[0].id)
        }
        setLoading(false)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message)
          setLoading(false)
        }
      })

      return () => controller.abort()
    }, [reloadKey])

    return { vendors, loading, error, reload }
}