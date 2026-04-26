import { useState } from 'react'
import { Link, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import './App.css'

// ── Storage keys ──────────────────────────────────────────────────────────────
const AUTH_KEY         = 'netflix-clone-auth'
const MY_LIST_KEY      = 'netflix-clone-my-list'
const RATINGS_KEY      = 'netflix-clone-ratings'

// ── Movie factory ─────────────────────────────────────────────────────────────
const mkMovie = (id, title, d) => ({ id, title, ...d })

// ── Browse rows (No Images) ───────────────────────────────────────────────────
const BROWSE_ROWS = [
  {
    title: 'Ajith Kumar Top Hits',
    items: [
      mkMovie('mankatha',        'Mankatha',        { rating:'7.6/10', views:'14.8M views', watchlist:'1.1M watchlist saves', year:'2011', duration:'2h 35m', genre:'Action Heist',   description:'Inspector Vinayak Mahadev gets suspended and plunges into a deadly heist involving 500 crores of betting money.' }),
      mkMovie('billa',           'Billa',           { rating:'7.2/10', views:'12.4M views', watchlist:'900K watchlist saves', year:'2007', duration:'2h 29m', genre:'Action Thriller',description:'A notorious don is killed, and a lookalike is trained to infiltrate his gang and bring down the criminal empire.' }),
      mkMovie('viswasam',        'Viswasam',        { rating:'6.6/10', views:'22.4M views', watchlist:'1.7M watchlist saves', year:'2019', duration:'2h 33m', genre:'Action Drama',   description:'A village tough guy tries to reconcile with his wife and protect his daughter from a rival.' }),
      mkMovie('yennai-arindhaal','Yennai Arindhaal',{ rating:'7.5/10', views:'17.2M views', watchlist:'1.4M watchlist saves', year:'2015', duration:'2h 50m', genre:'Cop Thriller',   description:'A sincere police officer\'s life changes when he vows to protect a young woman connected to his past.' }),
      mkMovie('vedalam',         'Vedalam',         { rating:'6.2/10', views:'18.7M views', watchlist:'1.5M watchlist saves', year:'2015', duration:'2h 37m', genre:'Action Masala',  description:'A seemingly mild-mannered man transforms into a ruthless killer when his dark past catches up with him.' }),
      mkMovie('thunivu',         'Thunivu',         { rating:'6.1/10', views:'15.9M views', watchlist:'1.3M watchlist saves', year:'2023', duration:'2h 26m', genre:'Heist Action',   description:'A mysterious mastermind and his team orchestrate a massive bank heist, unraveling a major financial scam.' }),
    ],
  },
  {
    title: 'Avengers Universe',
    items: [
      mkMovie('avengers',        'The Avengers',             { rating:'8.0/10', views:'28.2M views', watchlist:'2.8M watchlist saves', year:'2012', duration:'2h 23m', genre:'Superhero', description:'Earth\'s mightiest heroes must come together and learn to fight as a team to stop the mischievous Loki.' }),
      mkMovie('age-of-ultron',   'Avengers: Age of Ultron',  { rating:'7.3/10', views:'24.4M views', watchlist:'2.6M watchlist saves', year:'2015', duration:'2h 21m', genre:'Superhero', description:'When Tony Stark tries to jumpstart a dormant peacekeeping program, things go horribly wrong.' }),
      mkMovie('infinity-war',    'Avengers: Infinity War',   { rating:'8.4/10', views:'35.1M views', watchlist:'3.2M watchlist saves', year:'2018', duration:'2h 29m', genre:'Superhero', description:'The Avengers face their ultimate threat, Thanos, who seeks to collect all six Infinity Stones.' }),
      mkMovie('endgame',         'Avengers: Endgame',        { rating:'8.4/10', views:'38.2M views', watchlist:'3.6M watchlist saves', year:'2019', duration:'3h 1m',  genre:'Superhero', description:'After the devastating events of Infinity War, the remaining Avengers assemble once more to reverse Thanos\' actions.' }),
      mkMovie('civil-war',       'Captain America: Civil War',{ rating:'7.8/10', views:'22.8M views', watchlist:'2.1M watchlist saves', year:'2016', duration:'2h 27m', genre:'Superhero', description:'Political interference in the Avengers\' activities causes a rift between former allies Captain America and Iron Man.' }),
      mkMovie('ragnarok',        'Thor: Ragnarok',           { rating:'7.9/10', views:'21.5M views', watchlist:'1.9M watchlist saves', year:'2017', duration:'2h 10m', genre:'Superhero', description:'Imprisoned on the planet Sakaar, Thor must race against time to return to Asgard and stop Ragnarök.' }),
    ],
  },
  {
    title: 'DC Extended Universe',
    items: [
      mkMovie('man-of-steel',    'Man of Steel',             { rating:'7.1/10', views:'11.6M views', watchlist:'880K watchlist saves', year:'2013', duration:'2h 23m', genre:'Superhero Epic', description:'Superman\'s origin is retold with scale, emotion, and a battle over what it means to protect Earth.' }),
      mkMovie('bvs',             'Batman v Superman',        { rating:'6.5/10', views:'16.5M views', watchlist:'1.2M watchlist saves', year:'2016', duration:'2h 31m', genre:'Action Drama',   description:'Fearing that the actions of Superman are left unchecked, Batman takes on the Man of Steel.' }),
      mkMovie('wonder-woman',    'Wonder Woman',             { rating:'7.4/10', views:'19.2M views', watchlist:'1.9M watchlist saves', year:'2017', duration:'2h 21m', genre:'Superhero',      description:'When a pilot crashes and tells of conflict in the outside world, Diana leaves her home to stop the threat.' }),
      mkMovie('aquaman',         'Aquaman',                  { rating:'6.8/10', views:'15.3M views', watchlist:'1.1M watchlist saves', year:'2018', duration:'2h 23m', genre:'Action Fantasy', description:'Arthur Curry learns he is the heir to the underwater kingdom of Atlantis and must step forward to lead.' }),
      mkMovie('dark-knight',     'The Dark Knight',          { rating:'9.0/10', views:'34.4M views', watchlist:'2.9M watchlist saves', year:'2008', duration:'2h 32m', genre:'Crime Superhero',description:'Batman faces escalating chaos as Gotham is pushed to its limit by the Joker\'s terrifying unpredictability.' }),
      mkMovie('joker',           'Joker',                    { rating:'8.4/10', views:'26.1M views', watchlist:'2.2M watchlist saves', year:'2019', duration:'2h 2m',  genre:'Crime Drama',    description:'In Gotham City, a mentally troubled comedian embarks on a downward spiral that brings him face-to-face with his alter-ego.' }),
    ],
  },
]

const MOVIE_CATALOG = BROWSE_ROWS.flatMap((r) => r.items)
const MOVIE_BY_ID   = Object.fromEntries(MOVIE_CATALOG.map((m) => [m.id, m]))

// ── Demo credentials shown on login page ─────────────────────────────────────
const DEMO_CREDS = [
  { email: 'viewer@netflixclone.dev', password: 'Stream@2026' },
  { email: 'user@netflix.com',        password: 'netflix123'  },
  { email: 'test@example.com',        password: 'password'    },
]

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function AppFooter() {
  return (
    <footer className="app-footer">
      <p>Week 11 Project by <span>Vignesh S</span></p>
    </footer>
  )
}

function RatingModal({ movie, userRating, onRate, onClose }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="rating-modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="rating-modal" onClick={(e) => e.stopPropagation()}>
        <button className="rating-modal-close" type="button" onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6"  y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className="rating-modal-poster">{movie.title}</div>
        <div className="rating-modal-content">
          <p className="eyebrow">Rate this title</p>
          <h2>{movie.title}</h2>
          <div className="star-rating">
            {[1,2,3,4,5].map((star) => {
              const filled = star <= (hovered || userRating)
              return (
                <button
                  key={star} type="button"
                  className={`star-button ${filled ? 'star-filled' : 'star-empty'}`}
                  onClick={() => { onRate(movie.id, star); onClose() }}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  aria-label={`Rate ${star} of 5`}
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </button>
              )
            })}
          </div>
          {userRating > 0 && <p className="rating-thanks">Thanks for rating!</p>}
        </div>
      </div>
    </div>
  )
}

function LoginPage({ isAuthenticated, onLogin }) {
  const navigate = useNavigate()
  const [form,         setForm]         = useState({ email: '', password: '' })
  const [fieldErrors,  setFieldErrors]  = useState({})
  const [statusMsg,    setStatusMsg]    = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  const handleChange = ({ target: { name, value } }) => {
    setForm((f) => ({ ...f, [name]: value }))
    setFieldErrors((e) => ({ ...e, [name]: '' }))
    setStatusMsg('')
  }

  const validate = () => {
    const errs = {}
    if (!form.email.trim())    errs.email    = 'Email is required.'
    if (!form.password.trim()) errs.password = 'Password is required.'
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    setStatusMsg('')
    try {
      const res  = await fetch('/api/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.trim(), password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) { setStatusMsg(data.message || 'Unable to sign in right now.'); setIsSubmitting(false); return }
      onLogin(data.user)
      navigate('/dashboard', { replace: true })
    } catch {
      setStatusMsg('Network error. Please try again in a moment.')
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page-shell">
      <section className="hero-overlay">
        <header className="brand-bar"><span className="brand-mark">NETFLIX</span></header>
        <div className="login-card">
          <h1>Sign In</h1>
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <label className="field-group" htmlFor="email">
              <span className="sr-only">Email</span>
              <input id="email" name="email" type="email" autoComplete="email"
                placeholder="Email or phone number" value={form.email}
                onChange={handleChange} aria-invalid={Boolean(fieldErrors.email)} />
              {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
            </label>
            <label className="field-group" htmlFor="password">
              <span className="sr-only">Password</span>
              <input id="password" name="password" type="password" autoComplete="current-password"
                placeholder="Password" value={form.password}
                onChange={handleChange} aria-invalid={Boolean(fieldErrors.password)} />
              {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
            </label>
            {statusMsg && <p className="status-banner" role="alert">{statusMsg}</p>}
            <button className="sign-in-button" type="submit" disabled={isSubmitting} id="signin-btn">
              {isSubmitting ? 'Signing In…' : 'Sign In'}
            </button>
          </form>
          <div className="helper-row">
            <label className="remember-me">
              <input type="checkbox" defaultChecked /><span>Remember me</span>
            </label>
            <span className="text-button-help" role="button" tabIndex={0} onClick={() => alert('Help is not available in this demo.')}>Need help?</span>
          </div>
          <div className="login-copy">
            <p><span className="muted-text">Demo credentials:</span></p>
            {DEMO_CREDS.map((c) => (
              <p key={c.email}>
                <span className="muted-text">Email:</span> <span className="credential-text">{c.email}</span>{'  '}
                <span className="muted-text">Pass:</span> <span className="credential-text">{c.password}</span>
              </p>
            ))}
            <p className="signup-line">
              New to Netflix? <span className="text-button-signup" role="button" tabIndex={0} onClick={() => alert('Sign up is not available in this demo.')}>Sign up now</span>
            </p>
          </div>
        </div>
      </section>
      <AppFooter />
    </main>
  )
}

function BrowseHeader({ onLogout, onOpenMyList }) {
  return (
    <header className="browse-header">
      <div className="browse-brand-row">
        <Link to="/dashboard" className="brand-mark brand-mark-small">NETFLIX</Link>
        <nav className="browse-nav">
          <Link to="/dashboard">Home</Link>
          <Link to="/dashboard">TV Shows</Link>
          <Link to="/dashboard">Movies</Link>
          <button className="nav-link-button" type="button" onClick={onOpenMyList}>Watchlist</button>
        </nav>
      </div>
      <div className="browse-tools">
        <button className="text-button" type="button" onClick={onLogout}>Sign out</button>
      </div>
    </header>
  )
}

function BrowsePage({ currentUser, onLogout, onOpenMovie, onOpenMyList }) {
  return (
    <main className="browse-shell">
      <BrowseHeader onLogout={onLogout} onOpenMyList={onOpenMyList} />
      <section className="hero-banner">
        <div className="hero-banner-content">
          <p className="eyebrow">Now Streaming</p>
          <h1>Welcome, {currentUser?.name || 'Viewer'}</h1>
          <p className="dashboard-copy">Explore your favorite Ajith Kumar, Avengers, and DC movies below.</p>
        </div>
      </section>
      <section className="browse-rows">
        {BROWSE_ROWS.map((row) => (
          <div key={row.title} className="browse-row">
            <h2>{row.title}</h2>
            <div className="content-strip">
              {row.items.map((item, idx) => (
                <article key={item.id} className={`content-card content-card-${(idx%6)+1}`}
                  role="button" tabIndex={0} onClick={() => onOpenMovie(item)}
                  onKeyDown={(e) => { if (e.key==='Enter'||e.key===' '){e.preventDefault();onOpenMovie(item)} }}>
                  <div className="content-card-image">{item.title}</div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>
      <AppFooter />
    </main>
  )
}

function MovieDetailPage({ currentUser, myList, userRatings, ratingMovieId, onToggleMyList, onRateMovie, onOpenRatingModal, onCloseRatingModal, onBackToBrowse, onLogout, onOpenMyList }) {
  const { movieId } = useParams()
  const movie = MOVIE_BY_ID[movieId]

  if (!movie) return <Navigate to="/dashboard" replace />

  const isInMyList = myList.some((m) => m.id === movie.id)
  const userRating = userRatings[movie.id] || 0
  const showRating = ratingMovieId === movie.id

  const btnLabel = isInMyList ? 'Remove from Watchlist' : 'Add to Watchlist'
  const STATS = [['Rating', movie.rating], ['Views', movie.views], ['Watchlist', movie.watchlist]]

  return (
    <main className="browse-shell">
      <BrowseHeader onLogout={onLogout} onOpenMyList={onOpenMyList} />
      <section className="movie-detail-hero">
        <div className="movie-detail-poster-wrap">
          <div className="movie-detail-poster">{movie.title}</div>
        </div>
        <div className="movie-detail-copy">
          <p className="eyebrow">Now Watching</p>
          <h1>{movie.title}</h1>
          <p className="movie-meta-line">{movie.year} | {movie.duration} | {movie.genre}</p>
          <p className="movie-detail-description">{movie.description}</p>
          <div className="movie-stats-grid">
            {STATS.map(([l,v])=>(
              <article key={l} className="movie-stat-card"><span className="movie-stat-label">{l}</span><strong>{v}</strong></article>
            ))}
          </div>
          <div className="movie-detail-actions">
            <button type="button" onClick={() => onToggleMyList(movie)}
              className={`usage-modal-button download-button${isInMyList?' saved':''}`}>{btnLabel}</button>
            <button type="button" className="usage-modal-button rate-button" onClick={() => onOpenRatingModal(movie.id)}>
              {userRating > 0 ? `Your Rating: ${'★'.repeat(userRating)}` : 'Rate Movie'}
            </button>
            <button type="button" className="usage-modal-button" onClick={onBackToBrowse}>Back to Browse</button>
          </div>
        </div>
      </section>
      <section className="browse-rows"><div className="browse-row"><h2>Movie Info</h2>
        <div className="movie-info-panel">
          <p><span className="movie-info-label">Viewer:</span> {currentUser?.name||'Viewer'}</p>
          <p><span className="movie-info-label">Streaming Status:</span> Ready to play</p>
        </div>
      </div></section>
      {showRating && <RatingModal movie={movie} userRating={userRating} onRate={onRateMovie} onClose={onCloseRatingModal} />}
      <AppFooter />
    </main>
  )
}

function MyListPage({ currentUser, myList, selectedMovieIds, onSelectAll, onDeselectAll, onClearSelected, onClearAll, onLogout, onOpenMovie, onOpenMyList, onBackToBrowse }) {
  const allSelected = myList.length > 0 && myList.every((m) => selectedMovieIds.includes(m.id))
  return (
    <main className="browse-shell">
      <BrowseHeader onLogout={onLogout} onOpenMyList={onOpenMyList} />
      <section className="browse-rows"><div className="browse-row">
        <div className="my-list-header">
          <div><p className="eyebrow">Watchlist</p><h2>Saved movies</h2></div>
          <div className="my-list-controls">
            {myList.length > 0 && (<>
              <button className="text-button select-all-button" type="button" onClick={() => allSelected ? onDeselectAll() : onSelectAll()}>{allSelected ? 'Deselect All' : 'Select All'}</button>
              <button className="text-button clear-all-button" type="button" onClick={() => { onClearAll(); onBackToBrowse() }}>Clear All</button>
              {selectedMovieIds.length > 0 && <button className="text-button clear-button" type="button" onClick={() => { onClearSelected(); if (myList.length - selectedMovieIds.length === 0) onBackToBrowse() }}>Clear Selected ({selectedMovieIds.length})</button>}
            </>)}
            <button className="text-button" type="button" onClick={onBackToBrowse}>Back to Browse</button>
          </div>
        </div>
        {myList.length === 0 ? <div className="movie-info-panel empty-state"><p>Your watchlist is empty. Add movies from their detail pages.</p></div>
          : <div className="content-strip">{myList.map((movie, idx) => (
              <article key={movie.id} className={`content-card content-card-${(idx%6)+1}${selectedMovieIds.includes(movie.id)?' content-card-selected':''}`}
                role="button" tabIndex={0} onClick={() => onOpenMovie(movie)} onKeyDown={(e) => { if (e.key==='Enter'||e.key===' '){e.preventDefault();onOpenMovie(movie)} }}>
                <div className="content-card-image">{movie.title}</div>
              </article>
            ))}</div>}
      </div></section>
      <AppFooter />
    </main>
  )
}

function ProtectedRoute({ isAuthenticated, children }) { return isAuthenticated ? children : <Navigate to="/" replace /> }

function DashboardAdapter(props) { const navigate = useNavigate(); return <BrowsePage {...props} onOpenMovie={(m) => props.onOpenMovie(m, navigate)} onOpenMyList={() => navigate('/my-list')} /> }
function MovieDetailAdapter(props) { const navigate = useNavigate(); return <MovieDetailPage {...props} onBackToBrowse={() => navigate('/dashboard')} onOpenMyList={() => navigate('/my-list')} /> }
function MyListAdapter(props) { const navigate = useNavigate(); return <MyListPage {...props} onOpenMyList={() => navigate('/my-list')} onBackToBrowse={() => navigate('/dashboard')} onOpenMovie={(m) => props.onOpenMovie(m, navigate)} /> }

function App() {
  const [currentUser,setCurrentUser] = useState(()=>{try{return JSON.parse(window.sessionStorage.getItem(AUTH_KEY))}catch{return null}})
  const [myList,setMyList]           = useState(()=>{try{return JSON.parse(window.sessionStorage.getItem(MY_LIST_KEY))||[]}catch{return[]}})
  const [selIds,setSelIds]           = useState([])
  const [ratings,setRatings]         = useState(()=>{try{return JSON.parse(window.sessionStorage.getItem(RATINGS_KEY))||{}}catch{return{}}})
  const [ratingId,setRatingId]       = useState(null)

  const handleLogin  = (user) => {
    window.sessionStorage.setItem(AUTH_KEY, JSON.stringify(user))
    setCurrentUser(user)
  }

  const handleLogout = () => {
    window.sessionStorage.removeItem(AUTH_KEY)
    setCurrentUser(null)
  }

  const handleOpenMovie = (movie, navigate) => { navigate(`/movie/${movie.id}`) }

  const handleToggleMyList = (movie) => setMyList((list) => {
    const isSaved = list.some((m) => m.id === movie.id)
    const next = isSaved ? list.filter(m => m.id !== movie.id) : [...list, movie]
    window.sessionStorage.setItem(MY_LIST_KEY, JSON.stringify(next))
    return next
  })

  const handleRate = (movieId, rating) => setRatings((r) => {
    const next = { ...r, [movieId]: rating }; window.sessionStorage.setItem(RATINGS_KEY, JSON.stringify(next)); return next
  })

  const handleClearSelected = () => setMyList((list) => {
    const next = list.filter((m) => !selIds.includes(m.id))
    window.sessionStorage.setItem(MY_LIST_KEY, JSON.stringify(next)); setSelIds([]); return next
  })

  const handleClearAll = () => { setMyList([]); setSelIds([]); window.sessionStorage.setItem(MY_LIST_KEY, '[]') }

  const shared = {
    currentUser, myList, userRatings: ratings, ratingMovieId: ratingId,
    onLogout: handleLogout, onOpenMovie: handleOpenMovie,
    onToggleMyList: handleToggleMyList, onRateMovie: handleRate,
    onOpenRatingModal: (id) => setRatingId(id), onCloseRatingModal: () => setRatingId(null),
    selectedMovieIds: selIds,
    onToggleSelect: (id) => setSelIds((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]),
    onSelectAll: () => setSelIds(myList.map((m) => m.id)),
    onDeselectAll: () => setSelIds([]),
    onClearSelected: handleClearSelected,
    onClearAll: handleClearAll,
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage isAuthenticated={Boolean(currentUser)} onLogin={handleLogin} />} />
        <Route path="/dashboard" element={<ProtectedRoute isAuthenticated={Boolean(currentUser)}><DashboardAdapter {...shared} /></ProtectedRoute>} />
        <Route path="/movie/:movieId" element={<ProtectedRoute isAuthenticated={Boolean(currentUser)}><MovieDetailAdapter {...shared} /></ProtectedRoute>} />
        <Route path="/my-list" element={<ProtectedRoute isAuthenticated={Boolean(currentUser)}><MyListAdapter {...shared} /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
