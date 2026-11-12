import { getDb } from '../db/db.js'
import bcrypt from 'bcryptjs'

export async function registerUser(req, res) {
    let { name, username, password } = req.body

    if (!name || !username || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    
    // making db ready
    name = name.trim()
    username = username.trim()
    
    if(username.length > 20 || username.length < 1) {
        return res.status(400).json({'Error': 'Username must be between 1 and 20 characters'})
    }
    if(password.length > 20 || password.length < 4) {
        return res.status(400).json({'Error': 'Password must be between 4 and 20 characters'})
    }
    
    try {
        const db = await getDb()

        // username check
        const existing = await db.get(`
            SELECT * FROM users
            WHERE username = ?    
        `, [username])

        if(existing) {
            return res.status(400).json({'Error': 'Username already exists'})
        }

        password = await bcrypt.hash(password, 10)
        // db store request

        await db.run(`
        INSERT INTO users (name, username, password)
        VALUES (?, ?, ?)
        `, [name, username, password])
        
        return res.status(201).json({'message': 'User is registered'})

    } catch(err) {
        console.error(err)
        return res.status(500).json({'Error': 'Registration failed. Please try again.'})
    }
}

export async function loginUser(req, res) {
    
    let { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    
    username = username.trim()
    
    try {
        const db = await getDb()

        // getting info from db
        const userDetails = await db.get(`
            SELECT * FROM users
            WHERE username = ?    
        `, [username])

        if(!userDetails) {
            return res.status(401).json({'message': 'Invalid credentials'})
        }

        const passwordCompare = bcrypt.compare(password, userDetails.password)

        if(!passwordCompare) {
            return res.status(401).json({'message': 'Invalid credentials'})
        }

        req.session.userId = userDetails.id
        return res.json({'message': 'User logged in'})

    } catch(err) {
        console.error(err)
    }
}

export async function logOutUser(req, res) {
    req.session.destroy(() => {
        res.status(200).json({'message': 'Logged out'})
    })
}

export async function meController(req, res) {

    try {
        const db = await getDb()

        const userId = req.session.userId

        if(!userId) {
            return res.status(200).json({'isLoggedIn': false})
        }

        const user = await db.get(`
            SELECT name FROM users
            WHERE id = ?    
        `, [userId])

        if(!user) {
            return res.status(200).json({'isLoggedIn': false})
        }

        return res.status(200).json({
            'isLoggedIn': true,
            'name': user.name
        })
    } catch(err) {
        console.error(err)
        return res.status(500).json({'error': 'Internal server error'})
    }
    
}