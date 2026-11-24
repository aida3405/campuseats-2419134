import { useEffect, useState } from 'react'
import { subscribeToMyOrders } from '../services/orders.js'
import { useAuth } from './useAuth.js'

export function useMyOrders() {
    const { user } = useAuth()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!user) return
        const unsubsribe = subscribeToMyOrders(
            user.uid,
            (data) => { setOrders(data); setLoading(false) },
            (err) => { setError(err.message); setLoading(false) },
        )
        return unsubsribe
    }, [user])

    return { orders, loading, error}
}