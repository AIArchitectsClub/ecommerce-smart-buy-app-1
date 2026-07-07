import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import CheckoutSteps from '../components/CheckoutSteps'

export default function CartPage() {
  const { cartLines, cartTotal, updateCartQuantity, removeFromCart } = useCart()
  const navigate = useNavigate()

  return (
    <div className="page">
      <CheckoutSteps current="cart" />
      <h1>Your Cart</h1>
      {cartLines.length === 0 ? (
        <div className="empty-state">
          <p>Your cart is empty.</p>
          <Link to="/" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {cartLines.map((line) => (
              <div key={line.productId} className="cart-row">
                <div className="cart-row-emoji">{line.product.emoji}</div>
                <div className="cart-row-info">
                  <h3>{line.product.name}</h3>
                  <span className="product-price">${line.product.price.toFixed(2)}</span>
                </div>
                <div className="cart-row-qty">
                  <button
                    onClick={() => updateCartQuantity(line.productId, line.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{line.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(line.productId, line.quantity + 1)}
                    disabled={line.quantity >= line.product.stockQuantity}
                  >
                    +
                  </button>
                </div>
                <div className="cart-row-total">${line.lineTotal.toFixed(2)}</div>
                <button
                  className="btn btn-link"
                  onClick={() => removeFromCart(line.productId)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <span>Subtotal</span>
            <span className="cart-summary-total">${cartTotal.toFixed(2)}</span>
          </div>
          <div className="checkout-actions">
            <Link to="/" className="btn btn-secondary">
              Continue Shopping
            </Link>
            <button className="btn btn-primary" onClick={() => navigate('/checkout/shipping')}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  )
}
