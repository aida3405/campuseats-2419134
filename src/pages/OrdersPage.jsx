import { useMyOrders } from '../hooks/useMyOrders.js'
import { Loading, ErrorMessage } from '../components/Status.jsx'
import OrderStatus from '../components/OrderStatus.jsx'

export default function OrdersPage() {
    const { orders, loading, error } = useMyOrders()

    if (loading) return <Loading />
    if (error) {
        return (
            <ErrorMessage
            message={error}
            onRetry={() => window.location.reload()}
            />
        )
    }

    if (orders.length === 0) {
        return <p className="muted">
            No past orders yet.
        </p>
    }

    return (
        <div>
            <h2>Your Orders</h2>
            <ul className="order-list">
                {orders.map((order) => (
                    <li key={order.id} className="card">
                    <p className="cart-name">{order.vendorName} · pickup {order.pickupTime}</p>
                    <p className="muted">{order.items.map((i) => `${i.qty}× ${i.name}`).join(',')}</p>
                    <p className="muted">Placed {order.createdAt ? order.createdAt.toDate().toLocaleString('en-MY') : 'just now'}</p>
                    <p className="price">RM {order.total.toFixed(2)}</p>
                    <OrderStatus status={order.status} />
                </li>
            ))}
            </ul>
        </div>
    )
}