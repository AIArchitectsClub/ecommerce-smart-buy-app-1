async function request(path, options) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Request failed with status ${res.status}`)
  }
  return res.json()
}

export function fetchProducts() {
  return request('/products')
}

export function fetchOrders() {
  return request('/orders')
}

export function fetchOrder(orderId) {
  return request(`/orders/${orderId}`)
}

export function createOrder({ items, shipping, payment }) {
  return request('/orders', {
    method: 'POST',
    body: JSON.stringify({ items, shipping, payment }),
  })
}
