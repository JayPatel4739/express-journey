import express from 'express'
import { router } from './routes/diceGameRoutes.js'
import { authRouter } from './routes/auth.js'
import { meRouter } from './routes/me.js'
import session from 'express-session'

const PORT = 3000
const SECRET = process.env.SECRET

if (!SECRET) {
  console.error('Missing SECRET. Copy .env.example to .env and set SECRET.')
  process.exit(1)
}

const app = express()

app.use(express.json())

app.use(session({
  secret: SECRET,
  resave: false, 
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  }
}))

app.use(express.static('public'))

app.use('/api', router)

app.use('/api/auth', authRouter)

app.use('/api/auth/me', meRouter)

app.listen(PORT, () => {
	console.log('Server is up and running!!!')
})