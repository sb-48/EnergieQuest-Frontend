import { useEffect } from 'react'
import BurgerMenu from '../components/BurgerMenu'
import NavigationButtons from '../components/NavigationButtons'
import crownImage from '../assets/krone.svg'
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
      <div className="homepage-top-bar">
        <header className="homepage-header">
          <BurgerMenu />
        </header>

        <NavigationButtons />
      </div>

      <main className="homepage-main">
        {/* Upper half - Crown */}
        <div className="homepage-section homepage-section-top">
          <div className="crown-container">
            <img
              src={crownImage}
              alt="Krone"
              className="crown-image"
            />
          </div>
        </div>

        {/* Lower half - Eule */}
        <div className="homepage-section homepage-section-bottom">
          <div className="andre-image-container">
            <img 
              src="./assets/eule.png" 
              alt="Eule" 
              className="andre-image"
            />
          </div>
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
