import { useState, useEffect } from 'react'
import BurgerMenu from '../components/BurgerMenu'
import NavigationButtons from '../components/NavigationButtons'
import { LevelService } from '../utils/levelService'
import SpeechBubble from '../components/SpeechBubble'
import { supabase } from '../utils/supabase'
import './LinkPage.css'

const LinkPage = () => {
  const [userRefCode, setUserRefCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [shareSuccess, setShareSuccess] = useState(false)

  const urlParams = new URLSearchParams(window.location.search)
  const isRedirect = urlParams.get('ref') !== null

  // Generate recommendation link based on user's ref code
  const recommendationLink = userRefCode 
    ? `${window.location.origin}/register?ref=${userRefCode}`
    : null

  useEffect(() => {
    // Load user's ref code
    const loadUserRef = async () => {
      try {
        const userStr = sessionStorage.getItem('user')
        if (userStr) {
          const user = JSON.parse(userStr)
          
          // Get user's ref code from database
          const { data, error } = await supabase
            .from('user')
            .select('ref')
            .eq('id', user.id)
            .single()

          if (!error && data) {
            setUserRefCode(data.ref)
          }
        }
      } catch (error) {
        console.error('Error loading user ref:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUserRef()

    // Check if redirected from link (mission complete)
    if (isRedirect) {
      // Mission completed - unlock level 1
      const progress = LevelService.loadProgress()
      if (progress.currentLevel === 0) {
        const newProgress = LevelService.completeLevel(0, 100, progress)
        // Show notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Mission erfüllt!', {
            body: 'Du hast Level 1 freigeschaltet!',
          })
        }
      }
    }
  }, [isRedirect])

  const handleShareLink = async () => {
    if (!recommendationLink) {
      alert('Fehler: Empfehlungslink nicht verfügbar.')
      return
    }

    try {
      const nav = navigator as Navigator & {
        share?: (data: ShareData) => Promise<void>
        canShare?: (data: ShareData) => boolean
      }

      const shareData = {
        title: 'Mein Empfehlungslink',
        text: 'Melde dich über meinen Empfehlungslink an und sichere dir Vorteile!',
        url: recommendationLink
      }

      if (nav.share) {
        if (!nav.canShare || nav.canShare(shareData)) {
          await nav.share(shareData)
          setShareSuccess(true)
          setTimeout(() => setShareSuccess(false), 2000)
          return
        }
      }

      // Fallback: Copy to clipboard if Web Share API is not available
      await navigator.clipboard.writeText(recommendationLink)
      setShareSuccess(true)
      setTimeout(() => setShareSuccess(false), 2000)
      alert('Dein Gerät unterstützt kein direktes Teilen. Der Link wurde in die Zwischenablage kopiert.')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }
      console.error('Error sharing link:', error)
      alert('Fehler beim Teilen des Links.')
    }
  }

  const speechMessage = recommendationLink
    ? "Super! Teile diesen Empfehlungslink mit deinen Freunden. Wenn sich jemand darüber registriert, wird die Verknüpfung erstellt!" 
    : "Hallo! Melde dich an, um deinen persönlichen Empfehlungslink zu erhalten!"

  if (loading) {
    return (
      <div className="link-page">
        <header className="link-header">
          <BurgerMenu />
        </header>
        <main className="link-main">
          <div className="link-content">
            <p>Lade...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="link-page">
      <header className="link-header">
        <BurgerMenu />
      </header>

      <NavigationButtons />

      <main className="link-main">
        {/* Upper half - Link display */}
        <div className="link-section link-section-top">
          <div className="link-content">
            <h1 className="link-title">Empfehlungslink</h1>
            <p className="link-description">
              Teile diesen Link mit deinen Freunden! Wenn sich jemand über deinen Link registriert, 
              wird automatisch eine Verknüpfung in deinem Empfehlungsprofil erstellt.
            </p>
            
            {recommendationLink ? (
              <>
                <div className="link-display">
                  <input
                    type="text"
                    readOnly
                    value={recommendationLink}
                    className="link-input"
                  />
                  <button
                    className="link-copy-button"
                    onClick={handleShareLink}
                  >
                    {shareSuccess ? '✓ Geteilt!' : 'Empfehlungslink teilen'}
                  </button>
                </div>
                {isRedirect && (
                  <div className="mission-complete">
                    <p>✓ Mission erfüllt! Level 1 freigeschaltet!</p>
                  </div>
                )}
              </>
            ) : (
              <div className="link-error">
                <p>⚠️ Du musst angemeldet sein, um einen Empfehlungslink zu erhalten.</p>
                <p>Bitte melde dich an und kehre dann zu dieser Seite zurück.</p>
              </div>
            )}
          </div>
        </div>

        {/* Guidance area */}
        <div className="link-section link-section-bottom">
          <SpeechBubble message={speechMessage} />
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

export default LinkPage
