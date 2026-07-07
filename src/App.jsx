import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import NavBar from './components/NavBar'
import RequireAuth from './components/RequireAuth'
import ProductsPage from './pages/ProductsPage'
import CartPage from './pages/CartPage'
import ShippingPage from './pages/ShippingPage'
import PaymentPage from './pages/PaymentPage'
import ReceiptPage from './pages/ReceiptPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <NavBar />
        <main>
          <Routes>
            <Route path="/" element={<ProductsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route
              path="/checkout/shipping"
              element={
                <RequireAuth>
                  <ShippingPage />
                </RequireAuth>
              }
            />
            <Route
              path="/checkout/payment"
              element={
                <RequireAuth>
                  <PaymentPage />
                </RequireAuth>
              }
            />
            <Route
              path="/checkout/receipt/:orderId"
              element={
                <RequireAuth>
                  <ReceiptPage />
                </RequireAuth>
              }
            />
            <Route
              path="/orders"
              element={
                <RequireAuth>
                  <OrderHistoryPage />
                </RequireAuth>
              }
            />
          </Routes>
        </main>
      </CartProvider>
    </BrowserRouter>
  )
}
