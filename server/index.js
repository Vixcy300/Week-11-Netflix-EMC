const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 5000

app.use(cors({ origin: 'http://localhost:5173', methods: ['GET', 'POST'], credentials: true }))
app.use(express.json())

// ── Mock credentials ────────────────────────────────────────────────────────
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

app.listen(PORT, () => {
  console.log(`\n🎬 Netflix Login Server → http://localhost:${PORT}`)
  console.log('\n   Demo credentials:')
  MOCK_USERS.forEach((u) => console.log(`   • ${u.email} / ${u.password}`))
  console.log('')
})
