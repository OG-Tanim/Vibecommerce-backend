import { Router } from 'express'
import { login, register } from './auth.controller'

const router = Router()

router.post('/register', register) //the frontend will send SignUp: POST request to '/register' (POST http://localhost:5000/api/auth/register), the route will pass it to 'register' function

router.post('/login', login)

export default router