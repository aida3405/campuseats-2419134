import { useState , useEffect} from 'react'
import Header from './components/Header.jsx'
import VendorCard from './components/VendorCard.jsx'
import MenuList from './components/MenuList.jsx'
import CartPage from './components/CartPage.jsx'
import Footer from './components/Footer.jsx'
import { Loading, ErrorMessage } from './components/Status.jsx'

function App() {

  const [selectedVendorId, setSelectedVendorId] = useState(null)
  const [cart, setCart] = useState([])

  //view state and cartCount reduce
  const [view, setView] = useState('menu')  //'menu' | 'cart' | 'done'
  const cartCount = cart.reduce((total, line) => total + line.qty, 0)

  const [lastOrder, setLastOrder] = useState(null)

  //personal feature: spice level badge and filter
  const [maxSpice, setMaxSpice] = useState(0)

    //cart management function
    function handleAddToCart(item) {
      setCart((prevCart) => {
        const existingIndex = prevCart.findIndex((line) => line.item.id == item.id)
        if (existingIndex > -1) {
          return prevCart.map((line, idx) =>
            idx === existingIndex ? { ...line, qty: line.qty +1 } :line)
        } else {
          return [...prevCart, {item, qty: 1}]
        }
      }) // new item is added to the cart array
    }

    function handleChangeQty(itemId, delta) {
      setCart((prevCart) => {
        return prevCart
          .map((line) => {
            if (line.item.id === itemId) {
              return { ...line, qty: line.qty + delta }
            }
            return line
          })
          .filter((line) => line.qty > 0) //remove items with qty <= 0
      })
    }

    function handleRemove(itemId) {
      setCart((prevCart) => prevCart.filter((line) => line.item.id !== itemId))
    }

    function handlePlaceOrder(orderDetails) {
      const total = cart.reduce((sum, line) => sum + line.item.price * line.qty, 0)
      setLastOrder({ ...orderDetails, total })
      setCart([]) // clear the cart after placing the order
      setView('done') // switch to the done view
    }

    //find current selected vendor safely
    const selectedVendor = vendors.find((v) => v.id === selectedVendorId)

    //filtered menu using maxSpice state
    const filteredMenu = selectedVendor ? selectedVendor.menu.filter((item) => {
      const spice = item.spiceLevel !== undefined ? item.spiceLevel : 0
      return spice === maxSpice
    }) : []

    let content
    if (view === 'cart') {
      content = (
        <CartPage 
        cart={cart} 
        onChangeQty={handleChangeQty}
        onRemove={handleRemove} 
        onPlaceOrder={handlePlaceOrder} />
      )
    } else if (view === 'done') {
      //b5:show pickup time and total
      content = (
        <div>
        <h2>Order Placed.</h2>
        {lastOrder && (
          <div style={{ marginTop: '1rem' }}>
            <p>Thank you, {lastOrder.name}!</p>
            <p>Your order from {lastOrder.mahallah} will be ready for pickup at {lastOrder.pickupTime}.</p>
            <p>Total Paid: RM {lastOrder.total.toFixed(2)}</p>
          </div>
        )}
        <button className="btn" style={{ marginTop: '1rem' }} onClick={() => setView('menu')}>
          Back to Vendors</button>
        </div>
      )
    } else if (loading) {
      content = <Loading />
    } else if (error) {
      content = <ErrorMessage message={error} onRetry={() => setReloadKey((k) => k + 1)} />
    } else {
      content = (
        <>
        <section>
          <h2 className="section-title">Choose a vendor</h2>
          <div className="vendor-grid">
            {vendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                isSelected={vendor.id === selectedVendorId}
                onSelect={setSelectedVendorId}
              />
            ))}
          </div>
        </section>
    
        {selectedVendor && (
          <section>
            <h2 className="section-title">Menu: {selectedVendor.name}</h2>

            <div className="filter-container" style={{ margin: '1rem 0' }}>
              <label htmlFor="spiceRange">
                Max Spice Level: <strong>{maxSpice}</strong>
              </label>
              <input
                type="range"
                id="spiceRange"
                min="0"
                max="3"
                value={maxSpice}
                onChange={(e) => setMaxSpice(Number(e.target.value))} 
                style={{ display: 'block', width: '100%', maxWidth: '300px', marginTop: '0.5rem' }}
              />
            </div>
            <MenuList items={filteredMenu} onAdd={handleAddToCart} />
          </section>
        )}
      </>
      )
    }

  return (
    <>
      <Header 
        cartCount={cartCount} 
        onShowMenu={() => setView('menu')} 
        onShowCart={() => setView('cart')}/>
      <main className="container">{content}</main>
      <Footer />
    </>
  )
}

export default App