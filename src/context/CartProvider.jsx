import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { CartContext } from './cart-context.js'

export function CartProvider ({children}) {
    //cart n orders survive refresh using useLocalStorage
    const [cart, setCart] = useLocalStorage('campuseats-cart', [])
    const [orders, setOrders] = useLocalStorage('campuseats-orders', [])

    //total item count
    const count = cart.reduce((sum, line) => sum + line.qty, 0)

    //total price
    const total = cart.reduce((sum, line) => sum + line.item.price * line.qty, 0)

    //add item or increment quantity if already exist
    const addToCart = (product) => {
      setCart((prevCart) => {
        const existingIndex = prevCart.findIndex((line) => line.item.id == product.id)
        if (existingIndex !== -1) {
          return prevCart.map((line, index) =>
            index === existingIndex ? { ...line, qty: line.qty + 1 } : line)
        }
        return [...prevCart, { item: product, qty: 1 }]
      }) // new item is added to the cart array
    }

    //change quantity of specific item
    const changeQty = (itemId, delta) => {
        setCart((prevCart) => {
        return prevCart
          .map((line) => {
            if (line.item.id === itemId) {
              const newQty = line.qty + delta
              return newQty > 0 ? { ...line, qty: newQty } : null
            }
            return line
          })
          .filter(Boolean) //remove items with qty <= 0
      })
    }

    //remove item completely from cart
    const removeFromCart = (itemId) => {
        setCart((prevCart) => prevCart.filter((line) => line.item.id !== itemId))
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