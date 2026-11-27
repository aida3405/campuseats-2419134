import { useSubscription } from '../hooks/useSubscription.js'
import { subscribeToVendorOrders, updateOrderStatus, STATUSES } from '../services/orders.js'

function VendorOrders({ ownerUid }) {
    const { data: orders } = useSubscription(subscribeToVendorOrders, [ownerUid], [])
    const active = orders.filter((o) => o.status !== 'Collected')
    return (
        <div className="card">
            <h3>Incoming orders ({active.length})</h3>
            <ul className="cart-list">
                {active.map((order) => {
                    //TODO 3: const next = the status AFTER order.status in STATUSES
                    //Hint: STATUSES[STATUSES.indexOf(order.status) + 1]
                    const next = STATUSES[STATUSES.indexOf(order.status) + 1]
                    return (
                        <li key={order.id} className="cart-line">
                            <p className="cart-name">{order.studentName} · {order.pickupTime}</p>
                            <p className="muted">{order.items.map((i) => `${i.qty}× $ {i.name}`).join(', ')}</p>
                            <p className="tag">{order.status}</p>
                            {next && <button className="btn btn-small" onClick={() =>
                                updateOrderStatus(order.id, next)}>Mark {next}</button>}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default VendorOrders