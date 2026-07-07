import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useSession, signOut } from '../lib/authClient'

export default function NavBar() {
  const { cartCount } = useCart()
  const { data: session } = useSession()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        🛒 SmartBuy
      </Link>
      <nav className="nav-links">
        <Link to="/">Shop</Link>
        {session && <Link to="/orders">My Orders</Link>}
        <Link to="/cart" className="cart-link">
          Cart
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
        {session ? (
          <>
            <span>Hi, {session.user.name.split(' ')[0]}</span>
            <button className="btn btn-secondary" onClick={handleSignOut}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/sign-in">Sign In</Link>
            <Link to="/sign-up">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  )
}
