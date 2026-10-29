import { useCart } from '.../hooks/useCart.js'
import CartItem from './CartItem.jsx'
import CheckoutForm from './CheckoutForm.jsx'
 
function CartPage() {
  const { cart, changeQty, removeFromCart, placeOrder, total } = useCart()
  if (cart.length === 0) {
    return <p className="muted">Your cart is empty. Pick something from a menu 
first.</p>
  }
 
  return (
    <div className="cart-layout">
      <div className="card">
        <ul className="cart-list">
          {cart.map((line) => (
            <CartItem key={line.item.id} line={line}
                      onChangeQty={onChangeQty} onRemove={onRemove} />
          ))}
        </ul>
        <p className="cart-total">Total: RM {total.toFixed(2)}</p>
      </div>
      <CheckoutForm onPlaceOrder={onPlaceOrder} />
    </div>
  )
}
 
export default CartPage