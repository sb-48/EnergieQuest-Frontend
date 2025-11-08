import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import './Auth.css'

const Login = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showVerificationMessage, setShowVerificationMessage] = useState(false)

  // Check if redirected after email verification
  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setShowVerificationMessage(true)
      setTimeout(() => {
        setShowVerificationMessage(false)
      }, 5000)
    }
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!formData.email || !formData.password) {
      setError('Bitte füllen Sie alle Felder aus')
      setLoading(false)
      return
    }

    try {
      // Login directly with Supabase
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })

      if (loginError) {
        // Check if error is due to unverified email
        if (loginError.message.includes('email') && loginError.message.includes('confirm')) {
          setError('Bitte verifizieren Sie zuerst Ihre E-Mail-Adresse. Überprüfen Sie Ihr Postfach.')
          setShowVerificationMessage(true)
          throw new Error(loginError.message)
        }
        throw new Error(loginError.message || 'Anmeldung fehlgeschlagen')
      }

      // Check if email is confirmed
      if (!data.user.email_confirmed_at) {
        setError('Bitte verifizieren Sie zuerst Ihre E-Mail-Adresse. Überprüfen Sie Ihr Postfach.')
        setShowVerificationMessage(true)
        throw new Error('E-Mail-Adresse nicht verifiziert')
      }

      // Success - store session and redirect
      if (data.session) {
        sessionStorage.setItem('authToken', data.session.access_token)
        sessionStorage.setItem('user', JSON.stringify(data.user))
        sessionStorage.setItem('loggedInUser', data.user.email || '')
        sessionStorage.setItem('isLoggedIn', 'true')
      }

      navigate('/home')

    } catch (err: any) {
      if (!err.message.includes('E-Mail-Adresse nicht verifiziert')) {
        setError(err.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Willkommen zurück</h1>
          <p>Melde dich an, um weiterzuspielen</p>
        </div>

        {showVerificationMessage && (
          <div className="verification-warning">
            <p>⚠️ Bitte verifizieren Sie zuerst Ihre E-Mail-Adresse, bevor Sie sich anmelden können.</p>
            <p>Überprüfen Sie Ihr E-Mail-Postfach und klicken Sie auf den Bestätigungslink.</p>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">E-Mail</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Deine E-Mail eingeben"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Passwort</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Dein Passwort eingeben"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Anmeldung läuft...' : 'Anmelden'}
          </button>

          <p className="auth-footer">
            Noch kein Account?{' '}
            <Link to="/register" className="auth-link">
              Registrieren
            </Link>
          </p>
        </form>

        <Link to="/" className="back-link">
          ← Zurück zur Startseite
        </Link>
      </div>
    </div>
  )
}

export default Login
