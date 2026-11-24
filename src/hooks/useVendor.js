import { useEffect, useState } from 'react'
import { subscribeToVendor, subscribeToMenu } from '../services/vendors.js'

//one vendor plus its menu, both live, 2 listeners, so 2 cleanups
export function useVendor(vendorId) {
    const [vendor, setVendor] = useState(undefined) //undefined=loading, null=not found
    const [menu, setMenu] = useState([])
    const [error, setError] = useState(null)
    
    useEffect(() => {
        const stopVendor = subscribeToVendor(vendorId, setVendor, (err) => setError(err.message))
        const stopMenu = subscribeToMenu(vendorId, setMenu, (err) => setError(err.message))
        return() => {
            stopVendor()
            stopMenu()
        }
    }, [vendorId])

    return { vendor, menu, loading: vendor === undefined && !error, error }
}