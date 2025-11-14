import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import AnimatedLogo from '../components/AnimatedLogo'
import BottomNavigation from '../components/BottomNavigation'
import './LandingPage.css'

const LandingPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    // Check if user is logged in - redirect to /home
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true'
    if (isLoggedIn) {
      navigate('/home')
    }
  }, [navigate])

  return (
    <div className="landing-page page-with-bottom-nav">
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
      <BottomNavigation />
    </div>
  )
}

export default LandingPage

