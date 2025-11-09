import { useEffect, useRef } from 'react'
import logoImage from '../assets/logo.png'
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
          src={logoImage}
          alt="Optimizer Logo"
          className="logo-image"
        />
      </div>

      {/* ENERGIEQUEST text with copyright - positioned lower, less prominent */}
      <div className="optimizer-container">
        <div className="logo-text-wrapper-optimizer">
          {Array.from('ENERGIEQUEST').map((char, index) => (
            <span
              key={char + index}
              className={`letter${index === 8 ? ' letter-r' : ''}`}
              style={{ animationDelay: `${1.3 + index * 0.1}s` }}
            >
              {char}
            </span>
          ))}
          <span className="copyright">©</span>
        </div>
      </div>
    </div>
  )
}

export default AnimatedLogo
