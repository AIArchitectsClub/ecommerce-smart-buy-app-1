import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { signUp } from '../lib/authClient'

export default function SignUpPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    const { error: signUpError } = await signUp.email({
      name: form.name,
      email: form.email,
      password: form.password,
    })
    setIsSubmitting(false)
    if (signUpError) {
      setError(signUpError.message || 'Sign up failed')
      return
    }
    navigate(location.state?.from || '/')
  }

  return (
    <div className="page">
      <h1>Create Account</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Full Name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
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
            minLength={8}
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <div className="checkout-actions">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </div>
      </form>
      <p style={{ marginTop: 16 }}>
        Already have an account? <Link to="/sign-in">Sign in</Link>
      </p>
    </div>
  )
}
