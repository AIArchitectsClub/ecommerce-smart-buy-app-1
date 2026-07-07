import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import CheckoutSteps from '../components/CheckoutSteps'

function formatCardNumber(value) {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(.{4})/g, '$1 ').trim()
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

export default function PaymentPage() {
  const { cartLines, cartTotal, shippingInfo, placeOrder } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState({ cardName: '', cardNumber: '', expiry: '', cvv: '' })
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  if (cartLines.length === 0) {
    return <Navigate to="/cart" replace />
  }
  if (!shippingInfo) {
    return <Navigate to="/checkout/shipping" replace />
  }

  const tax = Math.round(cartTotal * 0.08 * 100) / 100
  const total = Math.round((cartTotal + tax) * 100) / 100

  function handleChange(e) {
    const { name, value } = e.target
    if (name === 'cardNumber') {
      setForm((prev) => ({ ...prev, cardNumber: formatCardNumber(value) }))
    } else if (name === 'expiry') {
      setForm((prev) => ({ ...prev, expiry: formatExpiry(value) }))
    } else if (name === 'cvv') {
      setForm((prev) => ({ ...prev, cvv: value.replace(/\D/g, '').slice(0, 4) }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const digits = form.cardNumber.replace(/\s/g, '')
    if (digits.length !== 16) {
      setError('Enter a 16-digit card number (this is a dummy gateway — any digits work).')
      return
    }
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) {
      setError('Enter expiry as MM/YY.')
      return
    }
    if (form.cvv.length < 3) {
      setError('Enter a 3-4 digit CVV.')
      return
    }

    setIsProcessing(true)
    // Simulated payment gateway round-trip — no real payment processor is involved.
    setTimeout(() => {
      const order = placeOrder({
        shipping: shippingInfo,
        payment: { cardNumber: digits },
      })
      setIsProcessing(false)
      navigate(`/checkout/receipt/${order.id}`)
    }, 900)
  }

  return (
    <div className="page">
      <CheckoutSteps current="payment" />
      <h1>Payment</h1>
      <p className="dummy-notice">
        This is a simulated payment gateway — no real transaction occurs. Any valid-looking card
        number works.
      </p>
      <div className="payment-layout">
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Name on Card
            <input name="cardName" value={form.cardName} onChange={handleChange} required />
          </label>
          <label>
            Card Number
            <input
              name="cardNumber"
              value={form.cardNumber}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
              required
            />
          </label>
          <div className="form-row">
            <label>
              Expiry (MM/YY)
              <input
                name="expiry"
                value={form.expiry}
                onChange={handleChange}
                placeholder="MM/YY"
                required
              />
            </label>
            <label>
              CVV
              <input name="cvv" value={form.cvv} onChange={handleChange} placeholder="123" required />
            </label>
          </div>
          {error && <p className="form-error">{error}</p>}
          <div className="checkout-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/checkout/shipping')}
              disabled={isProcessing}
            >
              Back
            </button>
            <button type="submit" className="btn btn-primary" disabled={isProcessing}>
              {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
            </button>
          </div>
        </form>
        <div className="order-summary-card">
          <h3>Order Summary</h3>
          {cartLines.map((line) => (
            <div key={line.productId} className="order-summary-line">
              <span>
                {line.product.name} × {line.quantity}
              </span>
              <span>${line.lineTotal.toFixed(2)}</span>
            </div>
          ))}
          <div className="order-summary-line">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="order-summary-line">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="order-summary-line order-summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
