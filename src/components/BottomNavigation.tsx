import { useLocation, useNavigate } from 'react-router-dom'
import './BottomNavigation.css'

const navItems = [
  {
    label: 'Start',
    path: '/home',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-5h-6v5H4a1 1 0 01-1-1v-9z" />
      </svg>
    ),
  },
  {
    label: 'Empfehlungen',
    path: '/recommendations',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M12 6a3 3 0 110 6 3 3 0 010-6zm0 6v7m-5-3a7 7 0 0110 0" />
      </svg>
    ),
  },
  {
    label: 'Upload',
    path: '/upload',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M12 16V4m0 0l-4 4m4-4l4 4M5 20h14" />
      </svg>
    ),
  },
  {
    label: 'Spiel',
    path: '/game',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M6 8h4l1-2h2l1 2h4a2 2 0 012 2v6a2 2 0 01-2 2h-2l-2-2H8l-2 2H4a2 2 0 01-2-2v-6a2 2 0 012-2zm0 4h2m8 0h2" />
      </svg>
    ),
  },
]

const BottomNavigation = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavigate = (path: string) => {
    if (location.pathname !== path) {
      navigate(path)
    }
  }

  return (
    <nav className="bottom-navigation">
      {navItems.map((item) => {
        const isActive =
          location.pathname === item.path ||
          (item.path !== '/' && location.pathname.startsWith(item.path))
        return (
          <button
            key={item.path}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => handleNavigate(item.path)}
            aria-label={item.label}
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            <span className="bottom-nav-label">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

export default BottomNavigation

