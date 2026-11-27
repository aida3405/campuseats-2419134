import { useState } from 'react'
import { useSubscription } from '../hooks/useSubscription.js'
import { subscribeToMenu, addMenuItem, setItemAvailable, deleteMenuItem } from '../services/vendors.js'

const EMPTY = { name: '', description: '', price: '', category: '', photoUrl: '' }

function MenuManager({ vendorId }) {
    const { data: menu } = useSubscription(subscribeToMenu, [vendorId, 3], []) //3 to pass as argument to subscribeToMenu in vendors.js
    const [values, setValues] = useState(EMPTY)
    const [error, setError] = useState('')
    const handleChange = (e) => setValues((prev) => ({ ...prev, [e.target.name]: e.target.value}))

    async function handleAdd(e) {
        e.preventDefault()
        const price = Number(values.price)
        if (!values.name.trim() || !(price > 0))
            return setError('Name and a price above 0 are required.')
        setError('')
        try { await addMenuItem(vendorId, { ...values, name: values.name.trim(), price }); setValues(EMPTY) }
        catch(err) { setError(err.message) }
    }
    
    return (
        <div className="dash-grid">
            <ul className="card cart-list">
                {menu.map((item) => (
                    <li key={item.id} className="cart-line">
                        <p className="cart-name">{item.name} · RM {Number(item.price).toFixed(2)}</p>
                        <label>
                            <input type="checkbox" checked={item.available} onChange={ (e) =>
                                setItemAvailable(vendorId, item.id, e.target.checked)} />
                                Available
                        </label>
                        <button type="button" className="link danger" onClick={() =>
                            deleteMenuItem(vendorId, item.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <form className="card form" onSubmit={handleAdd}>
                <h3>Add an item</h3>
                {['name', 'description', 'price', 'category', 'photoUrl'].map((f) => (
                    <input key={f} name={f} placeholder={f === 'photoUrl' ? 'Photo link (optional)' : f}
                        type={f === 'price' ? 'number' : 'text'} value={values[f]}
                        onChange={handleChange} />
                ))}
                {error && <p className="field-error" role="alert">{error}</p>}
                <button type="submit" className="btn">Add item</button>
            </form>
        </div>
    )
}

export default MenuManager