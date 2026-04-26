const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 5000

app.use(cors({ origin: ['http://localhost:5173', 'https://week-11-netflix-emc.vercel.app', 'https://week-11-netflix-emc.netlify.app'], methods: ['GET', 'POST', 'OPTIONS'], credentials: true }))
app.use(express.json())

// â”€â”€ Mock credentials â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const MOCK_USERS = [
  { email: 'viewer@netflixclone.dev', password: 'Stream@2026',  name: 'Demo Viewer'  },
  { email: 'user@netflix.com',        password: 'netflix123',   name: 'Netflix User' },
  { email: 'test@example.com',        password: 'password',     name: 'Test User'    },
  { email: 'admin@netflix.com',       password: 'admin123',     name: 'Admin User'   },
]

app.get('/api/health', (_req, res) => {
  res.status(200).json({ ok: true })
})

app.post('/api/login', (req, res) => {
  const { email = '', password = '' } = req.body ?? {}

  if (!email.trim() || !password.trim()) {
    return res.status(400).json({ message: 'Email and password are required.' })
  }

  setTimeout(() => {
    const user = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    )

    if (user) {
      return res.status(200).json({
        message: 'Login successful.',
        user: { email: user.email, name: user.name },
      })
    }

    return res.status(401).json({ message: 'Invalid email or password. Please try again.' })
  }, 600)
})

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
  console.log(`\nðŸŽ¬ Netflix Login Server â†’ http://localhost:${PORT}`)
  console.log('\n   Demo credentials:')
  MOCK_USERS.forEach((u) => console.log(`   â€¢ ${u.email} / ${u.password}`))
  console.log('')
})

