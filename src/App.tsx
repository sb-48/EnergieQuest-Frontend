import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import LinkPage from './pages/LinkPage'
import RecommendationsPage from './pages/RecommendationsPage'
import Login from './pages/Login'
import Register from './pages/Register'
import GamePage from './pages/GamePage'
import './serviceWorker'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/link" element={<LinkPage />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </Router>
  )
}

export default App
