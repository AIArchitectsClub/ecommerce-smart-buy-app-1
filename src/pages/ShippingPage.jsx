import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import CheckoutSteps from '../components/CheckoutSteps'

export default function ShippingPage() {
  const { cartLines, shippingInfo, setShippingInfo } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState(
    shippingInfo || {
      fullName: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
    },
  )

  if (cartLines.length === 0) {
    return <Navigate to="/cart" replace />
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setShippingInfo(form)
    navigate('/checkout/payment')
  }

  return (
    <div className="page">
      <CheckoutSteps current="shipping" />
      <h1>Shipping Information</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Full Name
          <input name="fullName" value={form.fullName} onChange={handleChange} required />
        </label>
        <label>
          Street Address
          <input name="address" value={form.address} onChange={handleChange} required />
        </label>
        <div className="form-row">
          <label>
            City
            <input name="city" value={form.city} onChange={handleChange} required />
          </label>
          <label>
            State
            <input name="state" value={form.state} onChange={handleChange} required />
          </label>
          <label>
            ZIP Code
            <input name="zip" value={form.zip} onChange={handleChange} required />
          </label>
        </div>
        <label>
          Phone Number
          <input name="phone" value={form.phone} onChange={handleChange} required />
        </label>
        <div className="checkout-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/cart')}>
            Back to Cart
          </button>
          <button type="submit" className="btn btn-primary">
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  )
}
