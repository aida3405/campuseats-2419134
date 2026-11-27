import { NavLink, useNavigate } from 'react-router'
import { useCart } from '../hooks/useCart.js'
import { useAuth } from '../hooks/useAuth.js'

function Header() {
  const { count } = useCart()
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
  <header className="header">
    <h1 className="logo">CampusEats</h1>
    <nav className="nav">
      { role === 'vendor' && <NavLink to="/dashboard">Dashboard</NavLink>}
      { role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
      { role === 'student' && <NavLink to="/become-vendor">Sell food</NavLink>}
      <NavLink to="/" end>Vendors</NavLink>
      <NavLink to="/orders">My Orders</NavLink>
      <NavLink to="/cart">
      Cart <span className="badge">{count}</span>
      </NavLink>
      {user ? (
        <>
        <span className="user-name">Hi, {user.displayName || user.email}</span>
        <button type="button" className="link" onClick={handleLogout}>Log out</button>
        </>
        ) : (
          <NavLink to="/login">Log in</NavLink>
        )}
    </nav>
  </header>
  )
}

export default Header