import { useCart } from '../hooks/useCart.js'

export default function OrdersPage() {
    const { orders } = useCart()

    if (orders.length === 0) {
        return <p className="muted">
            No past orders yet.
        </p>
    }

    return (
        <div>
            <h2>Your Past Orders</h2>
            {orders.map((order) => (
                <div key={order.id} className="card" style={{ marginBottom: '1rem' }}>
                    <p><strong>Order ID:</strong> {order.id}</p>
                    <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>
                    <p><strong>Name:</strong> {order.name}</p>
                    <p><strong>Pickup Time:</strong> {order.pickupTime}</p>
                    <p><strong>Mahallah:</strong> {order.mahallah}</p>
                    <p><strong>Total Paid:</strong> RM {order.total.toFixed(2)}</p>

                    <div>
                        <h4>Items Ordered:</h4>
                        <ul>
                            {order.items.map((line, index) => (
                                <li key={index}>
                                    {line.item.name} - Quantity: {line.qty}, Price: RM {(line.item.price * line.qty).toFixed(2)}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    )
}