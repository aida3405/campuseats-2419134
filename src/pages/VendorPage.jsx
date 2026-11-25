import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router'
import { useVendor } from '../hooks/useVendor.js'
import MenuList from '../components/MenuList.jsx'
import { Loading, ErrorMessage } from '../components/Status.jsx'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { useAuth } from '../hooks/useAuth.js'

function SavedSpiceSlider({ uid, maxSpice, onChangeMaxSpice }) {
    const [savedSpice, setSavedSpice] = useLocalStorage(`ce-spice-${uid}`, maxSpice)

    useEffect(() => {
        onChangeMaxSpice(Number(savedSpice ?? 3))
    }, [savedSpice, onChangeMaxSpice])

    function handleChange(e) {
        const next = Number(e.target.value)
        setSavedSpice(next)
        onChangeMaxSpice(next)
    }

    return (
        <input type="range" id="spiceRange" min="0" max="3" value={maxSpice} onChange={handleChange} 
        style={{ display: 'block', width: '100%', maxWidth: '300px', marginTop: '0.5rem' }}/>
    )
}

export default function VendorPage() {
    const { id } = useParams()
    const { user } = useAuth()
    //const [maxSpice, setMaxSpice] = useLocalStorage('campuseats-max-spice', 3)
    //login in
    const [userMaxSpice, setUserMaxSpice] = useState(3)
    //initial state set 3
    const [guestMaxSpice, setGuestMaxSpice] = useState(3)
    
    const activeMaxSpice = user ? userMaxSpice : guestMaxSpice
    const { vendor, menu, loading, error } = useVendor(id, activeMaxSpice)

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

    return (
        <div key={id}>
            <Link to="/" style={{ display: 'inline-block', marginBottom: '1rem'}}>
            &larr; All vendors</Link>
            <h2 className="section-title">Menu: {vendor.name}</h2>

            <div className="filter-container" style={{ margin: '1rem 0' }}>
                <label htmlFor="spiceRange">
                    Max Spice Level: <strong>{activeMaxSpice}</strong>
                </label>
                {user ? (
                    <SavedSpiceSlider
                        uid={user.uid}
                        maxSpice={activeMaxSpice}
                        onChangeMaxSpice={setUserMaxSpice}
                        />
                ) : (
                <input
                type = "range"
                id = "spiceRange"
                min = "0"
                max = "3"
                value = {guestMaxSpice}
                onChange = {(e) => setGuestMaxSpice(Number(e.target.value))}
                style={{ display: 'block', width: '100%', maxWidth: '300px', marginTop: '0.5rem' }}
                />
                )}
            </div>
            <MenuList items={itemsWithVendor} />
        </div>
    )
}