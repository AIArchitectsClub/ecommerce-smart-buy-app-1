import { useEffect, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { fetchOrder } from '../lib/api'
import CheckoutSteps from '../components/CheckoutSteps'

export default function ReceiptPage() {
  const { orderId } = useParams()
  const { getOrder } = useCart()
  const cached = getOrder(orderId)
  const [fetched, setFetched] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (cached) return
    fetchOrder(orderId)
      .then(setFetched)
      .catch(() => setNotFound(true))
  }, [orderId, cached])

  const order = cached || fetched

  if (notFound) {
    return <Navigate to="/" replace />
  }
  if (!order) {
    return <div className="page">Loading receipt...</div>
  }

  const placedDate = new Date(order.placedAt)

  return (
    <div className="page">
      <CheckoutSteps current="receipt" />
      <div className="receipt">
        <div className="receipt-header">
          <h1>Thank you, {order.shipping.fullName.split(' ')[0]}!</h1>
          <p>Your order has been confirmed.</p>
        </div>
        <div className="receipt-meta">
          <div>
            <span className="receipt-label">Order Number</span>
            <span>{order.orderNumber}</span>
          </div>
          <div>
            <span className="receipt-label">Date</span>
            <span>{placedDate.toLocaleString()}</span>
          </div>
          <div>
            <span className="receipt-label">Payment</span>
            <span>{order.payment.method} ending in {order.payment.last4}</span>
          </div>
        </div>
        <table className="receipt-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.productId}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${item.lineTotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="receipt-totals">
          <div>
            <span>Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          <div>
            <span>Tax</span>
            <span>${order.tax.toFixed(2)}</span>
          </div>
          <div className="receipt-grand-total">
            <span>Total Paid</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
        <div className="receipt-shipping">
          <span className="receipt-label">Shipping To</span>
          <p>
            {order.shipping.fullName}
            <br />
            {order.shipping.address}
            <br />
            {order.shipping.city}, {order.shipping.state} {order.shipping.zip}
            <br />
            {order.shipping.phone}
          </p>
        </div>
        <div className="checkout-actions">
          <Link to="/orders" className="btn btn-secondary">
            View My Orders
          </Link>
          <Link to="/" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
