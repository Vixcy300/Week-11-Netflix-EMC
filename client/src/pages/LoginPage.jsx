import NetflixLogo from '../components/NetflixLogo'
import LoginForm from '../components/LoginForm'

/* ── Poster colour tiles (mimics Netflix background) ─────────── */
const TILES = [
  '#1a1a2e','#16213e','#0f3460','#533483','#2d132c','#ee4540',
  '#c72c41','#801336','#510a32','#1b1b2f','#2e4057','#048a81',
  '#54c6eb','#8ef9f3','#cbf3f0','#2ec4b6','#ff9f1c','#ffbf69',
  '#ffffff','#cbf3f0','#2ec4b6','#e71d36','#ff9f1c','#011627',
  '#41ead4','#fdfffc','#ff3366','#2b2d42','#8d99ae','#edf2f4',
  '#ef233c','#d90429','#1d3557','#457b9d','#a8dadc','#f1faee',
]

export default function LoginPage() {
  return (
    <div className="login-page">
      {/* Mosaic background */}
      <div className="login-bg" aria-hidden="true">
        {TILES.map((color, i) => (
          <div
            key={i}
            className="login-bg-tile"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Dark overlay */}
      <div className="login-overlay" aria-hidden="true" />

      {/* Header */}
      <header className="login-header">
        <NetflixLogo />
      </header>

      {/* Main card */}
      <main className="login-body">
        <div className="login-card">
          <h1>Sign In</h1>
          <LoginForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="login-footer">
        <p>Questions? Call 000-800-919-1694</p>
        <nav className="footer-links" aria-label="Footer navigation">
          <a href="#" id="footer-faq">FAQ</a>
          <a href="#" id="footer-help">Help Center</a>
          <a href="#" id="footer-terms">Terms of Use</a>
          <a href="#" id="footer-privacy">Privacy</a>
          <a href="#" id="footer-cookies">Cookie Preferences</a>
          <a href="#" id="footer-corp-info">Corporate Information</a>
        </nav>
      </footer>
    </div>
  )
}
