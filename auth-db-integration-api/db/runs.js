import { getDb } from "./db.js"

export async function createRun(userId) {
    const db = await getDb()

    const result = await db.run(`
        INSERT INTO runs (user_id) 
        VALUES (?)
    `, [userId])

    return result.lastID
}

export async function updateRunStats(runId, outcome) {
    const db = await getDb()

    let winIncrement = outcome === 'player_win' ? 1 : 0
    let lossIncrement = outcome === 'player_loss' ? 1 : 0

    const result = await db.run(`
        UPDATE runs
        SET total_battles = total_battles + 1,
        wins = wins + ?,
        losses = losses + ?
        WHERE id = ?   
    `, [winIncrement, lossIncrement, runId])

    return result.changes
}