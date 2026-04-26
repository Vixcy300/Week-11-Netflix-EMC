import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, clearUser } from '../App'
import NetflixLogo from '../components/NetflixLogo'

/* ── Profile data ─────────────────────────────────────────────── */
const PROFILES = [
  { name: 'Me',       emoji: '😎', bg: '#E50914' },
  { name: 'Partner',  emoji: '🌟', bg: '#2196F3' },
  { name: 'Kids',     emoji: '🦄', bg: '#4CAF50' },
  { name: '+ Add',    emoji: '＋', bg: '#333333' },
]

/* ── Movie rows mock data ─────────────────────────────────────── */
const ROWS = [
  {
    title: '🔥 Trending Now',
    cards: [
      { label: 'Stranger Things',  bg: 'linear-gradient(135deg,#1a1a2e,#16213e)' },
      { label: 'The Crown',        bg: 'linear-gradient(135deg,#2d132c,#ee4540)' },
      { label: 'Money Heist',      bg: 'linear-gradient(135deg,#c40812,#800000)' },
      { label: 'Squid Game',       bg: 'linear-gradient(135deg,#0d4f4f,#00a86b)' },
      { label: 'Dark',             bg: 'linear-gradient(135deg,#0f0c29,#302b63)' },
      { label: 'Wednesday',        bg: 'linear-gradient(135deg,#1c1c1c,#4a4a4a)' },
      { label: 'Peaky Blinders',   bg: 'linear-gradient(135deg,#2c1654,#1565c0)' },
    ],
  },
  {
    title: '🎬 Popular on Netflix',
    cards: [
      { label: 'Ozark',            bg: 'linear-gradient(135deg,#004d61,#00b4d8)' },
      { label: 'The Witcher',      bg: 'linear-gradient(135deg,#1b1b2f,#4b0082)' },
      { label: 'Narcos',           bg: 'linear-gradient(135deg,#533483,#00897b)' },
      { label: 'Breaking Bad',     bg: 'linear-gradient(135deg,#212121,#37474f)' },
      { label: 'Mindhunter',       bg: 'linear-gradient(135deg,#263238,#546e7a)' },
      { label: 'Lupin',            bg: 'linear-gradient(135deg,#1a237e,#0d47a1)' },
    ],
  },
  {
    title: '⭐ Continue Watching',
    cards: [
      { label: 'Black Mirror',     bg: 'linear-gradient(135deg,#37474f,#607d8b)' },
      { label: 'You',              bg: 'linear-gradient(135deg,#880e4f,#e91e63)' },
      { label: 'Bridgerton',       bg: 'linear-gradient(135deg,#4a148c,#7b1fa2)' },
      { label: 'Emily in Paris',   bg: 'linear-gradient(135deg,#880e4f,#c2185b)' },
      { label: 'Cobra Kai',        bg: 'linear-gradient(135deg,#bf360c,#e64a19)' },
    ],
  },
]

export default function DashboardPage() {
  const navigate  = useNavigate()
  const user      = getUser()
  const [showToast, setShowToast] = useState(true)

  // If no user session, redirect back
  useEffect(() => {
    if (!user) navigate('/', { replace: true })
    // Hide toast after 3.5 s
    const t = setTimeout(() => setShowToast(false), 3500)
    return () => clearTimeout(t)
  }, [])

  const handleLogout = () => {
    clearUser()
    navigate('/', { replace: true })
  }

  const initials = user?.name?.charAt(0)?.toUpperCase() || 'U'

  return (
    <div className="dashboard-page">
      {/* Success toast */}
      {showToast && (
        <div className="success-toast" role="status" id="login-success-toast">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Welcome back, {user?.name}!
        </div>
      )}

      {/* Navigation */}
      <nav className="dashboard-nav">
        <NetflixLogo />
        <div className="nav-right">
          <div className="nav-user" id="nav-user-info">
            <div className="nav-avatar" aria-hidden="true">{initials}</div>
            <span className="nav-user-email">{user?.email}</span>
          </div>
          <button
            className="btn-logout"
            onClick={handleLogout}
            id="logout-btn"
            aria-label="Sign out"
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Body */}
      <div className="dashboard-body">

        {/* Welcome */}
        <section className="welcome-banner" aria-label="Welcome message">
          <h1>Good evening, <span>{user?.name || 'User'}</span> 🎬</h1>
          <p>Continue watching where you left off, or discover something new.</p>
        </section>

        {/* Profiles */}
        <section className="profiles-section" aria-label="Profile selection">
          <p className="section-title">Who's watching?</p>
          <div className="profiles-grid" id="profiles-grid">
            {PROFILES.map((p) => (
              <div key={p.name} className="profile-card" tabIndex={0} role="button" aria-label={`Switch to ${p.name} profile`}>
                <div
                  className="profile-avatar"
                  style={{ background: p.bg }}
                >
                  {p.emoji}
                </div>
                <span className="profile-name">{p.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Content rows */}
        {ROWS.map((row) => (
          <section key={row.title} className="content-row" aria-label={row.title}>
            <h2 className="row-title">{row.title}</h2>
            <div className="movie-row" role="list">
              {row.cards.map((card) => (
                <div
                  key={card.label}
                  className="movie-card"
                  role="listitem"
                  tabIndex={0}
                  style={{ background: card.bg }}
                  aria-label={card.label}
                >
                  {card.label}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
