import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useCart } from '../hooks/useCart.js'
import { useAuth } from '../hooks/useAuth.js'
import { placeOrders } from '../services/orders.js'
import CartItem from '../components/CartItem.jsx'
import CheckoutForm from '../components/CheckoutForm.jsx'
 
function CartPage() {
  const { cart, changeQty, removeFromCart, clearCart, total } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  async function handlePlaceOrder(details) {
    setError('')
    try {
      await placeOrders(user, cart, details)
      clearCart()
      navigate('/orders')
    } catch (err) {
      setError(`Could not place the order: ${err.message}`)
    }
  }

  if (cart.length === 0) {
    return <p className="muted">
      Your cart is empty. Pick something from a menu first.</p>
  }
 
  return (
    <div>
      <h2 className="section-title">Your Cart</h2>
      {error && (
        <p classname="field-error" role="alert">{error}</p>
      )}
    <div className="cart-layout">
      <div className="card">
        <ul className="cart-list">
          {cart.map((line) => (
            <CartItem key={line.id} line={line}
                      onChangeQty={changeQty} onRemove={removeFromCart} />
          ))}
        </ul>
        <p className="cart-total">Total: RM {total.toFixed(2)}</p>
      </div>
      <CheckoutForm defaultName={user?.displayName ?? ''} onPlaceOrder={handlePlaceOrder} />
    </div>
    </div>
  )
}
 
export default CartPage