import { useEffect, useState } from 'react'
import { subscribeToVendor, subscribeToMenu } from '../services/vendors.js'

//one vendor plus its menu, both live, 2 listeners, so 2 cleanups
export function useVendor(vendorId, maxSpice=3) {
    const [vendor, setVendor] = useState(undefined) //undefined=loading, null=not found
    const [menu, setMenu] = useState([])
    const [error, setError] = useState(null)
    
    useEffect(() => {
        setError(null)
        const stopVendor = subscribeToVendor(vendorId, setVendor, (err) => setError(err.message))
        const stopMenu = subscribeToMenu(vendorId, maxSpice, setMenu, (err) => setError(err.message))
        return() => {
            stopVendor()
            stopMenu()
        }
    }, [vendorId, maxSpice])

    return { vendor, menu, loading: vendor === undefined && !error, error }
}