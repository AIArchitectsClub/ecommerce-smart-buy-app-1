import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { signIn } from '../lib/authClient'

export default function SignInPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    const { error: signInError } = await signIn.email({
      email: form.email,
      password: form.password,
    })
    setIsSubmitting(false)
    if (signInError) {
      setError(signInError.message || 'Sign in failed')
      return
    }
    navigate(location.state?.from || '/')
  }

  return (
    <div className="page">
      <h1>Sign In</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <div className="checkout-actions">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
      </form>
      <p style={{ marginTop: 16 }}>
        Don't have an account? <Link to="/sign-up">Sign up</Link>
      </p>
    </div>
  )
}
