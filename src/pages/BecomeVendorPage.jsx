import { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'
import { useSubscription } from '../hooks/useSubscription.js'
import { applyAsVendor, subscribeToMyVendor } from '../services/vendors.js'
import { Loading } from '../components/Status.jsx'

function BecomeVendorPage() {
    const { user } = useAuth()
    const { data: myVendor, loading } = useSubscription(subscribeToMyVendor, [user?.uid])
    const [values, setValues] = useState({ name: '', location: '', openHours: ''})
    const [error, setError] = useState('')

    if(loading) return <Loading />
    if (myVendor) return myVendor.approved 
    ? <p>Approved. Go to your <Link to="/dashboard">dashboard</Link></p>
    : <p className="muted">Your application is waiting for an admin.</p>

    const handleChange = (e) => setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }))

    async function handleSubmit(e) {
        e.preventDefault()
        if (Object.values(values).some((v) => v.trim() === ''))
            return setError('Fill in all three fields.')
        try { await applyAsVendor(user, values) } catch (err) { setError(err.message) }
    }

    return (
        <form className="card form" onSubmit={handleSubmit}>
            <h2>Open a shop on CampusEats</h2>
            <label htmlFor="name">Shop name</label>
            <input id="name" name="name" value={values.name} onChange={handleChange} />
            <label htmlFor="location">Location</label>
            <input id="location" name="location" value={values.location} onChange={handleChange} />
            <label htmlFor="openHours">Opening hours</label>
            <input id="openHours" name="openHours" value={values.openHours} onChange={handleChange} />
            {error && <p className="field-error" role="alert">{error}</p>}
            <button type="submit" className="btn">Apply</button>
        </form>
    )
}

export default BecomeVendorPage