import { Router } from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

router.use(requireAuth)

function toOrderJson(orderRow, itemRows) {
  return {
    id: orderRow.id,
    orderNumber: orderRow.order_number,
    placedAt: orderRow.placed_at,
    subtotal: Number(orderRow.subtotal),
    tax: Number(orderRow.tax),
    total: Number(orderRow.total),
    status: orderRow.status,
    shipping: {
      fullName: orderRow.shipping_full_name,
      address: orderRow.shipping_address,
      city: orderRow.shipping_city,
      state: orderRow.shipping_state,
      zip: orderRow.shipping_zip,
      phone: orderRow.shipping_phone,
    },
    payment: {
      method: 'Dummy Card',
      last4: orderRow.payment_last4,
    },
    items: itemRows.map((item) => ({
      productId: item.product_id,
      name: item.name,
      price: Number(item.price),
      quantity: item.quantity,
      lineTotal: Number(item.line_total),
    })),
  }
}

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY placed_at DESC',
      [req.user.id],
    )
    const orders = []
    for (const order of rows) {
      const { rows: items } = await pool.query(
        'SELECT * FROM order_items WHERE order_id = $1',
        [order.id],
      )
      orders.push(toOrderJson(order, items))
    }
    res.json(orders)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id],
    )
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' })
    const { rows: items } = await pool.query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [req.params.id],
    )
    res.json(toOrderJson(rows[0], items))
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  const { items, shipping, payment } = req.body

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items must be a non-empty array' })
  }
  if (!shipping?.fullName || !shipping?.address || !shipping?.city || !shipping?.state || !shipping?.zip || !shipping?.phone) {
    return res.status(400).json({ error: 'Complete shipping information is required' })
  }
  if (!payment?.cardNumber || payment.cardNumber.length < 4) {
    return res.status(400).json({ error: 'Payment information is required' })
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const lineItems = []
    for (const { productId, quantity } of items) {
      if (!productId || !Number.isInteger(quantity) || quantity <= 0) {
        throw Object.assign(new Error('Invalid line item'), { status: 400 })
      }
      const { rows } = await client.query(
        `UPDATE products SET stock_quantity = stock_quantity - $2
         WHERE id = $1 AND stock_quantity >= $2
         RETURNING id, name, price, stock_quantity`,
        [productId, quantity],
      )
      if (rows.length === 0) {
        throw Object.assign(new Error(`Insufficient stock for product "${productId}"`), { status: 409 })
      }
      const product = rows[0]
      const lineTotal = Math.round(Number(product.price) * quantity * 100) / 100
      lineItems.push({ productId, name: product.name, price: Number(product.price), quantity, lineTotal })
    }

    const subtotal = Math.round(lineItems.reduce((sum, l) => sum + l.lineTotal, 0) * 100) / 100
    const tax = Math.round(subtotal * 0.08 * 100) / 100
    const total = Math.round((subtotal + tax) * 100) / 100
    const orderNumber = `SB-${Date.now().toString().slice(-8)}`

    const { rows: orderRows } = await client.query(
      `INSERT INTO orders
         (user_id, order_number, subtotal, tax, total, shipping_full_name, shipping_address,
          shipping_city, shipping_state, shipping_zip, shipping_phone, payment_last4, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'confirmed')
       RETURNING *`,
      [
        req.user.id,
        orderNumber,
        subtotal,
        tax,
        total,
        shipping.fullName,
        shipping.address,
        shipping.city,
        shipping.state,
        shipping.zip,
        shipping.phone,
        payment.cardNumber.slice(-4),
      ],
    )
    const order = orderRows[0]

    const itemRows = []
    for (const line of lineItems) {
      const { rows } = await client.query(
        `INSERT INTO order_items (order_id, product_id, name, price, quantity, line_total)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [order.id, line.productId, line.name, line.price, line.quantity, line.lineTotal],
      )
      itemRows.push(rows[0])
    }

    await client.query('COMMIT')
    res.status(201).json(toOrderJson(order, itemRows))
  } catch (err) {
    await client.query('ROLLBACK')
    if (err.status) return res.status(err.status).json({ error: err.message })
    next(err)
  } finally {
    client.release()
  }
})

export default router
