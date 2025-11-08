// Level Management Service
export interface UserProgress {
  currentLevel: number
  maxLevelReached: number
  experience: number
  unlockedLevels: number[]
}

export class LevelService {
  private static readonly MAX_LEVEL = 10
  private static readonly STORAGE_KEY = 'optimizer_user_progress'

  /**
   * Get initial user progress (Level 0)
   */
  static getInitialProgress(): UserProgress {
    return {
      currentLevel: 0,
      maxLevelReached: 0,
      experience: 0,
      unlockedLevels: [0]
    }
  }

  /**
   * Load user progress from localStorage
   */
  static loadProgress(): UserProgress {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        const progress = JSON.parse(stored)
        // Ensure all required fields exist
        return {
          ...this.getInitialProgress(),
          ...progress
        }
      }
    } catch (error) {
      console.error('Error loading progress:', error)
    }
    
    return this.getInitialProgress()
  }

  /**
   * Save user progress to localStorage
   */
  static saveProgress(progress: UserProgress): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress))
    } catch (error) {
      console.error('Error saving progress:', error)
    }
  }

  /**
   * Check if a level is unlocked
   */
  static isLevelUnlocked(level: number, progress: UserProgress): boolean {
    return progress.unlockedLevels.includes(level)
  }

  /**
   * Unlock a level
   */
  static unlockLevel(level: number, progress: UserProgress): UserProgress {
    if (!progress.unlockedLevels.includes(level)) {
      const updatedProgress = {
        ...progress,
        unlockedLevels: [...progress.unlockedLevels, level],
        maxLevelReached: Math.max(progress.maxLevelReached, level)
      }
      this.saveProgress(updatedProgress)
      return updatedProgress
    }
    return progress
  }

  /**
   * Complete a level and unlock the next one
   */
  static completeLevel(
    level: number, 
    experience: number,
    progress: UserProgress
  ): UserProgress {
    const updatedProgress = {
      ...progress,
      currentLevel: Math.min(level + 1, this.MAX_LEVEL),
      experience: progress.experience + experience,
      maxLevelReached: Math.max(progress.maxLevelReached, level),
      unlockedLevels: progress.unlockedLevels.includes(level + 1) 
        ? progress.unlockedLevels 
        : [...progress.unlockedLevels, level + 1]
    }

    this.saveProgress(updatedProgress)
    return updatedProgress
  }

  /**
   * Get maximum level
   */
  static getMaxLevel(): number {
    return this.MAX_LEVEL
  }

  /**
   * Get level info
   */
  static getLevelInfo(level: number): { unlocked: boolean; name: string } {
    return {
      unlocked: this.isLevelUnlocked(level, this.loadProgress()),
      name: `Level ${level}`
    }
  }

  /**
   * Reset all progress
   */
  static resetProgress(): void {
    localStorage.removeItem(this.STORAGE_KEY)
  }
}

