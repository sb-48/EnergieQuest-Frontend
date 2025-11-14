import { useNavigate, useLocation } from 'react-router-dom'
import './NavigationButtons.css'

const NavigationButtons = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handlePrevious = () => {
    if (location.pathname === '/upload') {
      navigate('/recommendations')
    } else if (location.pathname === '/recommendations') {
      navigate('/home')
    } else if (location.pathname === '/home') {
      navigate('/')
    }
  }

  const handleNext = () => {
    if (location.pathname === '/') {
      navigate('/home')
    } else if (location.pathname === '/home') {
      navigate('/recommendations')
    } else if (location.pathname === '/recommendations') {
      navigate('/upload')
    }
  }

  const canGoBack = location.pathname !== '/'
  const canGoNext = location.pathname !== '/upload'

  return (
    <div className="navigation-buttons">
      <button
        className={`nav-arrow nav-arrow-left ${!canGoBack ? 'disabled' : ''}`}
        onClick={handlePrevious}
        disabled={!canGoBack}
        aria-label="Vorherige Seite"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button
        className={`nav-arrow nav-arrow-right ${!canGoNext ? 'disabled' : ''}`}
        onClick={handleNext}
        disabled={!canGoNext}
        aria-label="Nächste Seite"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}

export default NavigationButtons

