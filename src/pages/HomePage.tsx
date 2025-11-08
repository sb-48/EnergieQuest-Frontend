import { useEffect } from 'react'
import BurgerMenu from '../components/BurgerMenu'
import NavigationButtons from '../components/NavigationButtons'
import './HomePage.css'

const HomePage = () => {
  useEffect(() => {
    // Request notification permission on homepage
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  return (
    <div className="homepage">
      <header className="homepage-header">
        <BurgerMenu />
      </header>

      <NavigationButtons />

      <main className="homepage-main">
        <div className="crown-container">
          <img
            src="/assets/krone.svg"
            alt="Krone"
            className="crown-image"
          />
        </div>
      </main>

      {/* OPTIMIZER footer */}
      <div className="optimizer-footer">
        <span className="optimizer-text">OPTIMIZER</span>
        <span className="copyright-footer">©</span>
      </div>
    </div>
  )
}

export default HomePage
