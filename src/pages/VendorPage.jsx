import { useParams, Link } from 'react-router'
import { useVendor } from '../hooks/useVendor.js'
import MenuList from '../components/MenuList.jsx'
import { Loading, ErrorMessage } from '../components/Status.jsx'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { useAuth } from '../hooks/useAuth.js'

export default function VendorPage() {
    const { id } = useParams()
    const { vendor, menu, loading, error } = useVendor(id)
    //const [maxSpice, setMaxSpice] = useLocalStorage('campuseats-max-spice', 3)
    const { user, loading: authLoading } = useAuth()
    //login in
    const spiceKey = user ? `ce-spice-${user.uid}` : null
    //initial state set 3
    const [maxSpice, setMaxSpice] = useLocalStorage(spiceKey, 3) 

    if (loading) return <Loading />
    if (error) {
        return <ErrorMessage message={error} onRetry={() => 
        window.location.reload()} />
    }

    if (!vendor) {
        return (
            <div className="box">
                <h2>Vendor not found</h2>
                <p>The vendor you are lookin for does not exist.</p>
                <Link to="/">Back to Vendors</Link>
            </div>
        )
    }

    const itemsWithVendor = menu.map((item) => ({
        ...item,
        vendorName: vendor.name,
    }))

    const filteredMenu = itemsWithVendor.filter((item) => {
        const spice = item.spiceLevel !== undefined ? Number(item.spiceLevel) : 0
        return spice <= maxSpice
    })

    return (
        <div key={id}>
            <Link to="/" style={{ display: 'inline-block', marginBottom: '1rem'}}>
            &larr; All vendors</Link>
            <h2 className="section-title">Menu: {vendor.name}</h2>

            <div className="filter-container" style={{ margin: '1rem 0' }}>
                <label htmlFor="spiceRange">
                    Max Spice Level: <strong>{maxSpice}</strong>
                </label>
                <input
                type = "range"
                id = "spiceRange"
                min = "0"
                max = "3"
                value = {maxSpice}
                onChange = {(e) => setMaxSpice(Number(e.target.value))}
                style={{ display: 'block', width: '100%', maxWidth: '300px', marginTop: '0.5rem' }}
                />
            </div>
            <MenuList items={filteredMenu} />
        </div>
    )
}