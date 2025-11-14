import BottomNavigation from '../components/BottomNavigation'
import './GamePage.css'

const GamePage = () => {
  return (
    <div className="game-page page-with-bottom-nav">
      <main className="game-main">
        <div className="game-content">
          <img
            src="./assets/Schatztruhe.png"
            alt="Schatztruhe"
            className="treasure-image"
          />
        </div>
      </main>
      <BottomNavigation />
    </div>
  )
}

export default GamePage

