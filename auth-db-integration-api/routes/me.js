import express from 'express'
import { meController } from '../controllers/authControllers.js'

export const meRouter = express.Router()

meRouter.get('/', meController)