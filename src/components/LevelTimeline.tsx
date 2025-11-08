import { useState, useEffect } from 'react'
import { LevelService, UserProgress } from '../utils/levelService'
import './LevelTimeline.css'

const LevelTimeline = () => {
  const [progress, setProgress] = useState<UserProgress>(LevelService.getInitialProgress())
  const maxLevel = LevelService.getMaxLevel()

  useEffect(() => {
    const savedProgress = LevelService.loadProgress()
    setProgress(savedProgress)
  }, [])

  const levels = Array.from({ length: maxLevel + 1 }, (_, i) => i)
  const currentLevel = progress.currentLevel

  return (
    <div className="level-timeline-container">
      {/* Lightning Image - left side */}
      <div className="lightning-container">
        <img 
          src="/blitz.png" 
          alt="Level Status" 
          className={`lightning-image ${progress.currentLevel > 0 ? 'charged' : ''}`}
        />
        <div className="level-badge">{currentLevel}</div>
        
        {/* Levels overlay on top of lightning image */}
        <div className="levels-overlay">
          {levels.map((level) => {
            const isActive = level === currentLevel
            const isUnlocked = LevelService.isLevelUnlocked(level, progress)
            const isCompleted = level < currentLevel
            
            // Position levels vertically along the lightning path
            const totalLevels = maxLevel + 1
            const positionRatio = level / maxLevel
            const topPosition = 5 + (positionRatio * 90) // 5% to 95% of height
            
            return (
              <div
                key={level}
                className={`level-dot-overlay ${isActive ? 'active' : ''} ${
                  isUnlocked && !isActive ? 'unlocked' : ''
                } ${isCompleted ? 'completed' : ''}`}
                style={{ top: `${topPosition}%` }}
                title={`Level ${level}`}
              >
                <div className="dot"></div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Vertical Timeline - right side */}
      <div className="timeline-wrapper">
        <div className="timeline-vertical">
          {levels.map((level) => {
            const isActive = level === currentLevel
            const isUnlocked = LevelService.isLevelUnlocked(level, progress)
            const isCompleted = level < currentLevel

            return (
              <div
                key={level}
                className={`timeline-item ${isActive ? 'active' : ''} ${
                  isUnlocked && !isActive ? 'unlocked' : ''
                } ${isCompleted ? 'completed' : ''}`}
                title={`Level ${level}`}
              >
                <div className="timeline-dot"></div>
                {level < maxLevel && (
                  <div className="timeline-line"></div>
                )}
              </div>
            )
          })}
        </div>
        <div className="timeline-labels">
          <span className="timeline-label">0</span>
          <span className="timeline-label">{maxLevel}</span>
        </div>
      </div>
    </div>
  )
}

export default LevelTimeline
