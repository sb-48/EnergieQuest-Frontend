import { useState, useEffect } from 'react'
import BottomNavigation from '../components/BottomNavigation'
import { LevelService } from '../utils/levelService'
import SpeechBubble from '../components/SpeechBubble'
import { supabase } from '../utils/supabase'
import './HomePage.css'

const HomePage = () => {
  const [userRefCode, setUserRefCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [shareSuccess, setShareSuccess] = useState(false)

  const urlParams = new URLSearchParams(window.location.search)
  const isRedirect = urlParams.get('ref') !== null

  const recommendationLink = userRefCode
    ? `${window.location.origin}/register?ref=${userRefCode}`
    : null

  useEffect(() => {
    const loadUserRef = async () => {
      try {
        const userStr = sessionStorage.getItem('user')
        if (userStr) {
          const user = JSON.parse(userStr)

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

    if (isRedirect) {
      const progress = LevelService.loadProgress()
      if (progress.currentLevel === 0) {
        const newProgress = LevelService.completeLevel(0, 100, progress)
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

  const speechMessage =
    '✨Hey! Teile deinen Empfehlungslink mit Freunden und Familie, um Level 1 zu erreichen! Nach Abschluss kannst du dein Geschenk freischalten. 🎁'

  const content = (
    <div className="home-single-section">
      <div className="link-content">
        <img
          src="./assets/Schatztruhe.png"
          alt="Schatztruhe"
          className="chest-image"
        />
        {recommendationLink ? (
          <>
            <button
              className="link-copy-button"
              onClick={handleShareLink}
            >
              {shareSuccess ? '✓ Geteilt!' : 'Empfehlungslink teilen'}
            </button>
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

      <div className="home-bottom">
        <SpeechBubble message={speechMessage} />
        <div className="andre-image-container">
          <img
            src="./assets/eule.png"
            alt="Eule"
            className="andre-image"
          />
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="link-page page-with-bottom-nav">
        <main className="link-main">
          <div className="link-content">
            <p>Lade...</p>
          </div>
        </main>
        <BottomNavigation />
      </div>
    )
  }

  return (
    <div className="link-page page-with-bottom-nav">
      <main className="link-main">{content}</main>

      <div className="optimizer-footer">
        <span className="optimizer-text">OPTIMIZER</span>
        <span className="copyright-footer">©</span>
      </div>
      <BottomNavigation />
    </div>
  )
}

export default HomePage
import { useState, useEffect } from 'react'
import BurgerMenu from '../components/BurgerMenu'
import NavigationButtons from '../components/NavigationButtons'
import BottomNavigation from '../components/BottomNavigation'
import { LevelService } from '../utils/levelService'
import SpeechBubble from '../components/SpeechBubble'
import { supabase } from '../utils/supabase'
import './HomePage.css'

const HomePage = () => {
  const [userRefCode, setUserRefCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [shareSuccess, setShareSuccess] = useState(false)

  const urlParams = new URLSearchParams(window.location.search)
  const isRedirect = urlParams.get('ref') !== null

  const recommendationLink = userRefCode
    ? `${window.location.origin}/register?ref=${userRefCode}`
    : null

  useEffect(() => {
    const loadUserRef = async () => {
      try {
        const userStr = sessionStorage.getItem('user')
        if (userStr) {
          const user = JSON.parse(userStr)

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

    if (isRedirect) {
      const progress = LevelService.loadProgress()
      if (progress.currentLevel === 0) {
        const newProgress = LevelService.completeLevel(0, 100, progress)
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

  const speechMessage =
    '✨Hey! Teile deinen Empfehlungslink mit Freunden und Familie, um Level 1 zu erreichen! Nach Abschluss kannst du dein Geschenk freischalten. 🎁'

  const content = (
    <div className="home-single-section">
      

      <div className="link-content">
        <img
          src="./assets/Schatztruhe.png"
          alt="Schatztruhe"
          className="chest-image"
        />
        {recommendationLink ? (
          <>
            <button
              className="link-copy-button"
              onClick={handleShareLink}
            >
              {shareSuccess ? '✓ Geteilt!' : 'Empfehlungslink teilen'}
            </button>
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

      <div className="home-bottom">
        <SpeechBubble message={speechMessage} />
        <div className="andre-image-container">
          <img
            src="./assets/eule.png"
            alt="Eule"
            className="andre-image"
          />
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="link-page page-with-bottom-nav">
        <main className="link-main">
          <div className="link-content">
            <p>Lade...</p>
          </div>
        </main>
        <BottomNavigation />
      </div>
    )
  }

  return (
    <div className="link-page page-with-bottom-nav">
      <main className="link-main">{content}</main>

      <div className="optimizer-footer">
        <span className="optimizer-text">OPTIMIZER</span>
        <span className="copyright-footer">©</span>
      </div>
      <BottomNavigation />
    </div>
  )
}

export default HomePage
