import { useState } from 'react'
import { useSubscription } from '../hooks/useSubscription.js'
import { subscribeToPendingVendors, approveVendor } from '../services/vendors.js'
import { Loading } from '../components/Status.jsx'

function AdminPage() {
    const { data: pending, loading } = useSubscription(subscribeToPendingVendors, [], [])
    const [message, setMessage] = useState('')

    async function handleApprove(vendor) {
        try { await approveVendor(vendor); setMessage(`${vendor.name} approved.`) }
        catch (err) { setMessage(`Could not approve: ${err.message}`) }
    }

    if (loading) return <Loading />
    return (
        <section>
            <h2 classname="section-title">Shop applications</h2>
            {message && <p role="status">{message}</p>}
            {pending.length === 0 && <p className="muted">No applications waiting.</p>}
            <ul className="order-list">
                {pending.map((v) => (
                    <li key={v.id} className="card row">
                        <p className="cart-name">{v.name} · {v.location}</p>
                        <button className="btn btn-small" onClick={() =>
                            handleApprove(v)}>Approve</button>
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default AdminPage