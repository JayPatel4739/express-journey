import { getDb } from "./db.js";

export async function getHeroes() {
    const db = await getDb()
    const heroes = await db.all("SELECT * FROM heroes")
    await db.close()
    return heroes
}
