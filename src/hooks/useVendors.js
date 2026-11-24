import { useState, useEffect} from 'react'
import { subscribeToVendors } from '../services/vendors.js'

export function useVendors() {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  //fetch vendors data from the API endpoint
  //use subscribeToVendors
  useEffect(() => {
    setLoading(true)
    setError(null)
    const unsubscribe = subscribeToVendors(
      (data) => { setVendors(data); setLoading(false) },
      (err) => { setError(err.message); setLoading(false) },
    )
    return unsubscribe //stop listen when component unmounts
    }, [reloadKey])

    return { vendors, loading, error, reload: () => setReloadKey((k) => k+1) }
}