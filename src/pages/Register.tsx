import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import { generateRefCode } from '../utils/generateRefCode'
import './Auth.css'

const Register = () => {
  const [searchParams] = useSearchParams()
  const referralRef = searchParams.get('ref') // Get ref code from URL parameter
  
  const [formData, setFormData] = useState({
    name: '',
    vorname: '',
    email: '',
    telefonnummer: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

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
    setEmailSent(false)

    // Validation
    if (!formData.name || !formData.vorname || !formData.email || !formData.telefonnummer || !formData.password) {
      setError('Bitte füllen Sie alle Felder aus')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Die Passwörter stimmen nicht überein')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Das Passwort muss mindestens 6 Zeichen lang sein')
      setLoading(false)
      return
    }

    try {
      // Generate unique referral code for new user
      let refCode = generateRefCode()
      let attempts = 0
      const maxAttempts = 10

      // Check if ref code already exists and generate new one if needed
      while (attempts < maxAttempts) {
        const { data: existingUser } = await supabase
          .from('user')
          .select('ref')
          .eq('ref', refCode)
          .single()

        if (!existingUser) {
          break // Code is unique
        }

        refCode = generateRefCode()
        attempts++
      }

      if (attempts >= maxAttempts) {
        throw new Error('Fehler beim Generieren des Referral-Codes. Bitte versuchen Sie es erneut.')
      }

      // Register user directly with Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            vorname: formData.vorname,
            telefonnummer: formData.telefonnummer
          },
          emailRedirectTo: `${window.location.origin}/login?verified=true`
        }
      })

      if (authError) {
        throw new Error(authError.message || 'Registrierung fehlgeschlagen')
      }

      if (!authData.user) {
        throw new Error('Registrierung fehlgeschlagen - kein Benutzer erstellt')
      }

      // Store user in database table 'user' with ref code
      const { error: dbError } = await supabase
        .from('user')
        .insert({
          id: authData.user.id,
          email: formData.email,
          name: formData.name,
          vorname: formData.vorname,
          telefonnummer: formData.telefonnummer,
          ref: refCode,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()

      // If DB insert fails, still show success (user is created in auth)
      if (dbError) {
        console.warn('Database insert warning:', dbError.message)
        // Don't throw error - user is created in auth system
      } else if (referralRef) {
        // Create recommendation link if user came through referral
        // Find the referrer by ref code
        const { data: referrer, error: referrerError } = await supabase
          .from('user')
          .select('id')
          .eq('ref', referralRef)
          .single()

        if (!referrerError && referrer) {
          // Create recommendation entry
          const { error: recommendationError } = await supabase
            .from('recommendations')
            .insert({
              referrer_id: referrer.id,
              referred_id: authData.user.id,
              ref_code: referralRef,
              created_at: new Date().toISOString()
            })

          if (recommendationError) {
            console.warn('Recommendation creation warning:', recommendationError.message)
            // Don't throw error - registration was successful
          }
        }
      }

      // Success - show email verification message
      // Keep email in state for display
      const userEmail = formData.email
      setEmailSent(true)
      
      // Reset form (except email for display)
      setFormData({
        name: '',
        vorname: '',
        email: userEmail, // Keep email to show in verification message
        telefonnummer: '',
        password: '',
        confirmPassword: ''
      })

    } catch (err: any) {
      setError(err.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <h1>✓ Registrierung erfolgreich!</h1>
            <p>E-Mail zur Verifizierung gesendet</p>
          </div>

          <div className="verification-message">
            <div className="verification-icon">📧</div>
            <h2>Bitte überprüfen Sie Ihr E-Mail-Postfach</h2>
            <p>
              Wir haben Ihnen eine Verifizierungs-E-Mail an <strong>{formData.email}</strong> gesendet.
            </p>
            <div className="verification-steps">
              <p><strong>Bitte führen Sie folgende Schritte durch:</strong></p>
              <ol>
                <li>Öffnen Sie Ihr E-Mail-Postfach</li>
                <li>Suchen Sie nach der E-Mail von Optimizer</li>
                <li>Klicken Sie auf den Bestätigungslink in der E-Mail</li>
                <li>Kehren Sie zurück und melden Sie sich an</li>
              </ol>
            </div>
            <div className="verification-note">
              <p>⚠️ <strong>Wichtig:</strong> Sie können sich erst nach der E-Mail-Verifizierung anmelden.</p>
              <p>Haben Sie keine E-Mail erhalten? Überprüfen Sie auch Ihren Spam-Ordner.</p>
            </div>
            <Link to="/login" className="auth-button" style={{ marginTop: '1.5rem', textDecoration: 'none', display: 'inline-block' }}>
              Zur Anmeldung
            </Link>
            <Link to="/" className="back-link">
              ← Zurück zur Startseite
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Registrieren</h1>
          <p>Erstelle einen neuen Account</p>
          {referralRef && (
            <p style={{ fontSize: '0.85rem', color: 'rgba(102, 126, 234, 0.8)', marginTop: '0.5rem' }}>
              ✨ Du wurdest über einen Empfehlungslink eingeladen!
            </p>
          )}
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Dein Nachname"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="vorname">Vorname *</label>
            <input
              type="text"
              id="vorname"
              name="vorname"
              placeholder="Dein Vorname"
              value={formData.vorname}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">E-Mail *</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="deine.email@beispiel.de"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefonnummer">Telefonnummer *</label>
            <input
              type="tel"
              id="telefonnummer"
              name="telefonnummer"
              placeholder="+49 123 456789"
              value={formData.telefonnummer}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Passwort *</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Mindestens 6 Zeichen"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Passwort bestätigen *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Passwort wiederholen"
              value={formData.confirmPassword}
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
            {loading ? 'Registrierung läuft...' : 'Registrieren'}
          </button>

          <p className="auth-footer">
            Bereits ein Account?{' '}
            <Link to="/login" className="auth-link">
              Anmelden
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

export default Register
