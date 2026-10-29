import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { CartContext } from './cart-context.js'

export function CartProvider ({children}) {
    //cart n orders survive refresh using useLocalStorage
    const [cart, setCart] = useLocalStorage('campuseats-cart', [])
    const [orders, setOrders] = useLocalStorage('campuseats-orders', [])

    //total item count
    const count = cart.reduce((sum, item) => sum + item.qty, 0)

    //total price
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

    //add item or increment quantity if already exist
    const addToCart = (product) => {
      setCart((prevCart) => {
        const existingIndex = prevCart.findIndex((item) => item.id == product.id)
        if (existingIndex) {
          return prevCart.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item)
        }
        return [...prevCart, {...product, qty: 1}]
      }) // new item is added to the cart array
    }

    //change quantity of specific item
    const changeQty = (id, delta) => {
        setCart((prevCart) => {
        return prevCart
          .map((item) => {
            if (item.id === id) {
              const newQty = item.qty + delta
              return newQty > 0 ? { ...item, qty: newQty } : null
            }
            return item
          })
          .filter(Boolean) //remove items with qty <= 0
      })
    }

    //remove item completely from cart
    const removeFromCart = (id) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id))
    }

    //move cart items to orders and clears the cart
    const placeOrder = (customerDetails) => {
        const newOrder = {
            id: Date.now(),
            date: new Date().toISOString(),
            items: [...cart],
            total,
            ...customerDetails,
        }
        setOrders((prevOrders) => [newOrder, ...prevOrders])
        setCart([]) //clear cart
    }

    return (
      <CartContext.Provider
      value = {{
        cart,
          orders,
          count,
          total,
          addToCart,
          changeQty,
          removeFromCart,
          placeOrder,
      }}>
        { children }
      </CartContext.Provider>
    )
}