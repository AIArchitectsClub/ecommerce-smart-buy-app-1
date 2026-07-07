import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const outOfStock = product.stockQuantity <= 0
  const lowStock = !outOfStock && product.stockQuantity <= 5

  return (
    <div className="product-card">
      <div className="product-emoji">{product.emoji}</div>
      <div className="product-body">
        <span className="product-category">{product.category}</span>
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          {outOfStock ? (
            <span className="badge badge-out">Out of stock</span>
          ) : (
            <span className={lowStock ? 'badge badge-low' : 'badge badge-stock'}>
              {product.stockQuantity} in stock
            </span>
          )}
        </div>
        <button
          className="btn btn-primary"
          disabled={outOfStock}
          onClick={() => addToCart(product.id, 1)}
        >
          {outOfStock ? 'Sold Out' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
