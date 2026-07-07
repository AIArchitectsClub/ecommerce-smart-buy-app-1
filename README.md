# SmartBuy

A full-stack ecommerce app: browse products by category, add to cart, and
check out through a multi-stage flow (cart → shipping → dummy payment →
receipt). Inventory stock levels decrease automatically on purchase.

Stack: React + Vite (frontend), Express + Neon Postgres (backend), served as
a single deployable process.

## Setup

1. Create a Neon Postgres project and copy its connection string.
2. `cp .env.example .env` and fill in `DATABASE_URL`.
3. `npm install`
4. `npm run db:setup` — creates tables and seeds ~18 products across 5 categories.

## Development

```bash
npm run dev
```

Runs the Vite dev server and the Express API together; the Vite proxy
forwards `/api/*` to the API so both share an origin (no CORS needed).

## Production

```bash
npm run build
npm start
```

Serves the built frontend and the API from a single process on one port
(`PORT` env var, default 3001).

## API

- `GET /api/products` — list all products with live stock levels
- `GET /api/products/:id`
- `GET /api/orders` — order history
- `GET /api/orders/:id` — a single order/receipt
- `POST /api/orders` — place an order `{ items, shipping, payment }`; atomically
  checks and decrements stock, rejecting with 409 if any item is oversold
