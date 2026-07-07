import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

function toProductJson(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    description: row.description,
    stockQuantity: row.stock_quantity,
    emoji: row.emoji,
  }
}

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products ORDER BY category, name')
    res.json(rows.map(toProductJson))
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id])
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' })
    res.json(toProductJson(rows[0]))
  } catch (err) {
    next(err)
  }
})

export default router
