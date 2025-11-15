import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import AnimatedLogo from '../components/AnimatedLogo'
import { storage } from '../utils/storage'
import './LandingPage.css'

const LandingPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    // Check if user is logged in - redirect to /home
    const isLoggedIn = storage.get('isLoggedIn') === 'true'
    if (isLoggedIn) {
      navigate('/home')
    }
  }, [navigate])

  return (
    <div className="landing-page">
      <header className="landing-header">
        <nav className="landing-nav">
          <Link to="/login" className="nav-button nav-login">
            Login
          </Link>
          <Link to="/register" className="nav-button nav-register">
            Registrieren
          </Link>
        </nav>
      </header>

      <main className="landing-main">
        <div className="logo-container">
          <AnimatedLogo />
        </div>
      </main>
    </div>
  )
}

export default LandingPage

