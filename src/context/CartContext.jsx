import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { loadCart, saveCart } from '../lib/storage'
import { fetchProducts, fetchOrders, createOrder } from '../lib/api'
import { useSession } from '../lib/authClient'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { data: session } = useSession()
  const [cart, setCart] = useState(() => loadCart())
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [shippingInfo, setShippingInfo] = useState(null)
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)

  useEffect(() => saveCart(cart), [cart])

  const refreshProducts = useCallback(() => {
    return fetchProducts().then(setProducts)
  }, [])

  const refreshOrders = useCallback(() => {
    if (!session) {
      setOrders([])
      return Promise.resolve()
    }
    return fetchOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
  }, [session])

  useEffect(() => {
    setIsLoadingProducts(true)
    refreshProducts().finally(() => setIsLoadingProducts(false))
  }, [refreshProducts])

  useEffect(() => {
    refreshOrders()
  }, [refreshOrders])

  const addToCart = useCallback(
    (productId, quantity = 1) => {
      setCart((prev) => {
        const product = products.find((p) => p.id === productId)
        const available = product?.stockQuantity ?? 0
        const existing = prev.find((item) => item.productId === productId)
        const currentQty = existing ? existing.quantity : 0
        const nextQty = Math.min(currentQty + quantity, available)
        if (nextQty <= 0) return prev
        if (existing) {
          return prev.map((item) =>
            item.productId === productId ? { ...item, quantity: nextQty } : item,
          )
        }
        return [...prev, { productId, quantity: nextQty }]
      })
    },
    [products],
  )

  const updateCartQuantity = useCallback(
    (productId, quantity) => {
      setCart((prev) => {
        if (quantity <= 0) return prev.filter((item) => item.productId !== productId)
        const product = products.find((p) => p.id === productId)
        const available = product?.stockQuantity ?? 0
        const clamped = Math.min(quantity, available)
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity: clamped } : item,
        )
      })
    },
    [products],
  )

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const cartLines = useMemo(() => {
    return cart
      .map((item) => {
        const product = products.find((p) => p.id === item.productId)
        if (!product) return null
        return { ...item, product, lineTotal: product.price * item.quantity }
      })
      .filter(Boolean)
  }, [cart, products])

  const cartTotal = useMemo(
    () => cartLines.reduce((sum, line) => sum + line.lineTotal, 0),
    [cartLines],
  )

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  )

  const placeOrder = useCallback(
    async ({ shipping, payment }) => {
      const items = cart.map((item) => ({ productId: item.productId, quantity: item.quantity }))
      const order = await createOrder({ items, shipping, payment })
      setCart([])
      await Promise.all([refreshProducts(), refreshOrders()])
      return order
    },
    [cart, refreshProducts, refreshOrders],
  )

  const getOrder = useCallback(
    (orderId) => orders.find((o) => o.id === orderId),
    [orders],
  )

  const value = {
    products,
    isLoadingProducts,
    cart,
    cartLines,
    cartTotal,
    cartCount,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    orders,
    placeOrder,
    getOrder,
    shippingInfo,
    setShippingInfo,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
