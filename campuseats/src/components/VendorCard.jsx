function VendorCard() {
    const vendor = {
        name: 'Masakan Malaysia',
        location: 'Seksyen 6, Kota Damansara',
        openHours: '2:00 PM - 6:00 PM',
        isOpen: true,
    }
    
    return (
        <article className="vendor-card">
            <div className="thumb" aria-hidden="true">
                {vendor.name.charAt(0)}
            </div>
            <div>
                <h2>{vendor.name}</h2>
                <p className="muted">{vendor.location}</p>
                <p className="muted">Open: {vendor.openHours}</p>
                <span className={vendor.isOpen ? 'status open' : 'status closed'}>
                    {vendor.isOpen ? 'Open now' : 'Closed'}
                </span>
            </div>
        </article>
    )
}

export default VendorCard