import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function OrderHistoryPage() {
  const { orders } = useCart()

  return (
    <div className="page">
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <div className="empty-state">
          <p>You haven't placed any orders yet.</p>
          <Link to="/" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="order-history-list">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/checkout/receipt/${order.id}`}
              className="order-history-row"
            >
              <div>
                <h3>{order.orderNumber}</h3>
                <span className="order-history-date">
                  {new Date(order.placedAt).toLocaleString()}
                </span>
              </div>
              <div className="order-history-items">
                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
              </div>
              <div className="order-history-total">${order.total.toFixed(2)}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
