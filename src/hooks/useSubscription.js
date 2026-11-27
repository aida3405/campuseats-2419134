import { useEffect, useState } from 'react'

// 1hook for any "subscribeTo.." service function. deps= arguments it needs
export function useSubscription(subscribe, deps, initial = null) {
    const [data, setData] = useState(initial)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (deps.some((d) => d == null)) return //wait until e.g. user.uid exists
        setLoading(true)
        const unsubscribe = subscribe(
            ...deps,
            (value) => { setData(value); setLoading(false) },
            (err) => { setError(err.message); setLoading(false) },
        )
        return unsubsribe
    }, deps)

    return { data, loading, error }
}