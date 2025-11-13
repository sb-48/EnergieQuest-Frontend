import { useEffect, useState } from 'react'
import BurgerMenu from '../components/BurgerMenu'
import NavigationButtons from '../components/NavigationButtons'
import crownImage from '../assets/krone.svg'
import { supabase } from '../utils/supabase'
import './HomePage.css'

const HomePage = () => {
  const [userLevel, setUserLevel] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Request notification permission on homepage
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    // Load user level from database
    const loadUserLevel = async () => {
      try {
        const userStr = sessionStorage.getItem('user')
        if (userStr) {
          const user = JSON.parse(userStr)

          // Get user's level from database
          const { data, error } = await supabase
            .from('user')
            .select('level')
            .eq('id', user.id)
            .single()

          if (!error && data) {
            setUserLevel(data.level ?? 0)
          } else {
            setUserLevel(0)
          }
        } else {
          setUserLevel(0)
        }
      } catch (error) {
        console.error('Error loading user level:', error)
        setUserLevel(0)
      } finally {
        setLoading(false)
      }
    }

    loadUserLevel()
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
        {/* Level heading */}
        <div className="homepage-level-header">
          <h1 className="homepage-level-title">
            {loading ? 'Lade...' : `Level ${userLevel ?? 0}`}
          </h1>
        </div>

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
