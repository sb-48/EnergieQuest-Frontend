import { useEffect, useRef } from 'react'
import './AnimatedLogo.css'

const AnimatedLogo = () => {
  const logoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Trigger animation when component mounts
    const timer = setTimeout(() => {
      if (logoRef.current) {
        logoRef.current.classList.add('animated')
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="animated-logo-container">
      {/* Logo image - falls from top */}
      <div ref={logoRef} className="logo-wrapper">
        <img
          src="/logo.jpeg"
          alt="Optimizer Logo"
          className="logo-image"
        />
      </div>

      {/* OPTIMIZER text with copyright - positioned lower, less prominent */}
      <div className="optimizer-container">
        <div className="logo-text-wrapper-optimizer">
          <span className="letter">O</span>
          <span className="letter">P</span>
          <span className="letter">T</span>
          <span className="letter">I</span>
          <span className="letter">M</span>
          <span className="letter">I</span>
          <span className="letter">Z</span>
          <span className="letter">E</span>
          <span className="letter letter-r">
            R
            <span className="copyright">©</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default AnimatedLogo
