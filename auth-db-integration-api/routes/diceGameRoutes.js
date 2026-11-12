import express from 'express'
import { getAllHeroes, battleStart, roundState, battleReset } from '../controllers/diceGameController.js'

export const router = express.Router()

// routes
router.get('/heroes', getAllHeroes)
router.post('/battle/start', battleStart)
router.post('/battle/round', roundState)
router.post('/battle/reset', battleReset)

