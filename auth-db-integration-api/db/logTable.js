import { getDb } from './db.js'

async function logTable() {
    const db = await getDb()

    const tableName = 'users'

    try {
        const result = await db.all(`SELECT * FROM ${tableName}`)
        console.table(result)
    } catch (error) {
        console.error('Error logging table:', error)
    } finally {
        await db.close()
    }
}
logTable()