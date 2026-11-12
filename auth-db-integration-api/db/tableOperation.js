import { getDb } from './db.js'
import { heroes } from '../data/heroes.js'

async function createTable() {
    const db = await getDb()

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `)
    console.log('Table "users" created successfully.')

    await db.close()
}

async function heroesRecordInsert(data) {
    const db = await getDb()

    for (const hero of data) {
        await db.run(`
            INSERT INTO heroes (id, name, attackPower, defensePower, maxHp, imageUrl) 
            VALUES (?, ?, ?, ?, ?, ?)
        `, [hero.id, hero.name, hero.attackPower, hero.defensePower, hero.maxHp, hero.imageUrl])
    }

    db.close()
}

async function dropTable() {
    const db = await getDb()

    await db.exec(`
        DROP TABLE IF EXISTS users
    `)
    console.log('Table "users" dropped successfully.')

    await db.close()
}

// function running area

createTable()
// heroesRecordInsert(heroes)
// dropTable()
