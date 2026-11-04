import { useParams, Link } from 'react-router'
import { useVendors } from '../hooks/useVendors.js'
import MenuList from '../components/MenuList.jsx'
import { Loading, ErrorMessage } from '../components/Status.jsx'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { useCart } from '../hooks/useCart.js'

export default function VendorPage() {
    const { addToCart } = useCart()
    const { id } = useParams()
    const { vendors, loading, error, reload } = useVendors()
    const [maxSpice, setMaxSpice] = useLocalStorage('campuseats-max-spice', 3)

    if (loading) return <Loading />
    if (error) return <ErrorMessage message={error} onRetry={reload} />

    const vendor = vendors.find((v) => String(v.id) === String(id))

    if (!vendor) {
        return (
            <div className="box">
                <h2>Vendor not found</h2>
                <p>The vendor you are lookin for does not exist.</p>
                <Link to="/">Back to Vendors</Link>
            </div>
        )
    }

    const filteredMenu = vendor.menu.filter((item) => {
        const spice = item.spiceLevel !== undefined ? item.spiceLevel : 0
        return spice <= maxSpice
    })

    return (
        <div>
            <Link to="/" style={{ display: 'inline-block', marginBottom: '1rem'}}>
            &larr; Back to vendor</Link>
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