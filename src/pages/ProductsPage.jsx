import { useMemo, useState } from 'react'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'

export default function ProductsPage() {
  const { products, isLoadingProducts } = useCart()
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))].sort(),
    [products],
  )

  const visibleProducts = useMemo(() => {
    if (activeCategory === 'All') return products
    return products.filter((p) => p.category === activeCategory)
  }, [products, activeCategory])

  if (isLoadingProducts) {
    return (
      <div className="page">
        <h1>Shop All Products</h1>
        <p>Loading products...</p>
      </div>
    )
  }

  return (
    <div className="page">
      <h1>Shop All Products</h1>
      <div className="category-filters">
        <button
          className={activeCategory === 'All' ? 'chip chip-active' : 'chip'}
          onClick={() => setActiveCategory('All')}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={activeCategory === category ? 'chip chip-active' : 'chip'}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="product-grid">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
