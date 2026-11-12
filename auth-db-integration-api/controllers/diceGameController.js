import { createDiceGameEngine } from '../domain/diceGameEngine.js'
import { getHeroes } from '../db/heroes.js'
import { createRun, updateRunStats } from '../db/runs.js'

const heroes = await getHeroes()
const engine = createDiceGameEngine(heroes)

export async function getAllHeroes(req, res) {
	const heroes = await engine.getHeroes()
	res.status(200).json({'heroes': heroes})
}

export async function battleStart(req, res) {
	const { heroId } = req.body

	if(!heroId) {
		res.status(400).json({'message': 'Hero ID is required'})
	}

	const battleState = engine.startBattle(heroId)

	if(battleState.error) {
		res.status(400).json({'message':battleState.error})
	}

	if(!req.session.runId) {
		req.session.runId = await createRun(req.session.userId)
	}

	return res.status(200).json({
		'playerHero': battleState.playerHero,
		'computerHero': battleState.computerHero,
		'playerHp': battleState.playerHp,
		'computerHp': battleState.computerHp,
		'message': 'Battle started. Roll to attack!'
	})
}

export async function roundState(req, res) {
	const roundState = engine.playRound()

	if(roundState.error) {
		res.status(400).json({'message': roundState.error})
	}

	if(!req.session.runId) {
		req.session.runId = await createRun(req.session.userId)
	}

	if(roundState.outcome != 'ongoing' && req.session.runId) {
		await updateRunStats(req.session.runId, roundState.outcome)
	}

	res.status(200).json(roundState)
}

export function battleReset(req, res) {
	engine.resetBattle()

	res.status(200).json({'message': 'Battle reset.'})
}



