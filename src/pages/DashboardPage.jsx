import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'
import { useSubscription } from '../hooks/useSubscription.js'
import { subscribeToMyVendor, setVendorOpen } from '../services/vendors.js'
import VendorOrders from '../components/VendorOrders.jsx'
import MenuManager from '../components/MenuManager.jsx'
import { Loading } from '../components/Status.jsx'

function DashboardPage() {
    const { user } = useAuth()
    const { data: vendor, loading } = useSubscription(subscribeToMyVendor, [user?.uid])
    if (loading) return <Loading />
    if (!vendor) return <p className="muted">You do not own a shop yet. <Link to="/become-vendor">Apply</Link></p>
    return (
        <section>
            <h2 className="section-title">{vendor.name} dashboard</h2>
            <label><input type="checkbox" checked={vendor.isOpen}
            onChange={(e) => setVendorOpen(vendor.id, e.target.checked)} /> Open now</label>
            <VendorOrders ownerUid={user.uid} />
            <MenuManager vendorId={vendor.id} />
        </section>
    )
}

export default DashboardPage