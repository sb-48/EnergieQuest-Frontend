import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './BurgerMenu.css'

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true'
  
  // Get user email from sessionStorage
  let userEmail = sessionStorage.getItem('userEmail')
  if (!userEmail) {
    // Fallback: try to get email from user object
    const userStr = sessionStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        userEmail = user.email || ''
      } catch (e) {
        userEmail = ''
      }
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn')
    sessionStorage.removeItem('userEmail')
    setIsOpen(false)
    navigate('/')
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <div className="burger-menu">
      <button 
        className={`burger-button ${isOpen ? 'active' : ''}`}
        onClick={toggleMenu}
        aria-label="Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`burger-nav ${isOpen ? 'open' : ''}`}>
        <div className="burger-nav-content">
          {isLoggedIn ? (
            <>
              <div className="burger-user-info">
                <span className="burger-email">{userEmail || 'Nicht angemeldet'}</span>
              </div>
              <Link to="/home" onClick={closeMenu} className="burger-link">
                Home
              </Link>
              <Link to="/link" onClick={closeMenu} className="burger-link">
                Empfehlungslink
              </Link>
              <Link to="/recommendations" onClick={closeMenu} className="burger-link">
                Empfehlungen
              </Link>
              <Link to="/game" onClick={closeMenu} className="burger-link">
                Spiel
              </Link>
              <button onClick={handleLogout} className="burger-link burger-logout">
                Abmelden
              </button>
            </>
          ) : (
            <>
              <Link to="/" onClick={closeMenu} className="burger-link">
                Startseite
              </Link>
              <Link to="/login" onClick={closeMenu} className="burger-link">
                Login
              </Link>
              <Link to="/register" onClick={closeMenu} className="burger-link">
                Registrieren
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Overlay für mobile */}
      {isOpen && (
        <div className="burger-overlay" onClick={closeMenu}></div>
      )}
    </div>
  )
}

export default BurgerMenu

