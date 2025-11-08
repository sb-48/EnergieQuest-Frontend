import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LevelService, UserProgress } from '../utils/levelService'
import { notificationService } from '../utils/notificationService'
import './GamePage.css'

const GamePage = () => {
  const [progress, setProgress] = useState<UserProgress>(LevelService.getInitialProgress())
  const [notificationEnabled, setNotificationEnabled] = useState(false)

  useEffect(() => {
    // Load progress on mount
    const savedProgress = LevelService.loadProgress()
    setProgress(savedProgress)

    // Check notification permission
    if (notificationService.hasPermission()) {
      setNotificationEnabled(true)
    }
  }, [])

  const handleLevelComplete = () => {
    const newProgress = LevelService.completeLevel(
      progress.currentLevel,
      100,
      progress
    )
    setProgress(newProgress)

    // Send notification
    if (notificationService.hasPermission()) {
      notificationService.showNotification(
        `Level ${progress.currentLevel} abgeschlossen!`,
        {
          body: `Du hast jetzt Zugang zu Level ${newProgress.currentLevel}!`,
          tag: 'level-complete',
        }
      )
    }
  }

  const handleEnableNotifications = async () => {
    const permission = await notificationService.requestPermission()
    if (permission === 'granted') {
      setNotificationEnabled(true)
      await notificationService.subscribe()
    }
  }

  return (
    <div className="game-page">
      <header className="game-header">
        <Link to="/home" className="back-button">← Zurück</Link>
        <h1>Optimizer Spiel</h1>
      </header>

      <main className="game-main">
        <div className="progress-container">
          <div className="level-display">
            <h2>Aktuelles Level</h2>
            <div className="level-number">{progress.currentLevel}</div>
            <p className="level-description">Du bist auf Level {progress.currentLevel} von {LevelService.getMaxLevel()}</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Maximal erreicht</div>
              <div className="stat-value">{progress.maxLevelReached}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Erfahrung</div>
              <div className="stat-value">{progress.experience}</div>
            </div>
          </div>

          <div className="level-grid">
            <h3>Verfügbare Level</h3>
            <div className="levels">
              {Array.from({ length: LevelService.getMaxLevel() + 1 }, (_, i) => (
                <div
                  key={i}
                  className={`level-button ${
                    LevelService.isLevelUnlocked(i, progress) ? 'unlocked' : 'locked'
                  }`}
                >
                  {i}
                </div>
              ))}
            </div>
          </div>

          {!notificationEnabled && (
            <button
              onClick={handleEnableNotifications}
              className="notification-button"
            >
              🔔 Benachrichtigungen aktivieren
            </button>
          )}

          <button onClick={handleLevelComplete} className="complete-button">
            Level abschließen (+100 XP)
          </button>
        </div>
      </main>
    </div>
  )
}

export default GamePage

