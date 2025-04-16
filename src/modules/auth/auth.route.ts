import { Router } from 'express'
import { login, register } from './auth.controller'
import { authenticate } from '@middleware/auth'
import { requireRole } from '@middleware/role'
import { AuthenticatedRequest } from '@middleware/auth'


const router = Router()
 

router.post('/register', register) //the frontend will send SignUp: POST request to '/register' (POST http://localhost:5000/api/auth/register), the route will pass it to 'register' function

router.post('/login', login)

router.get('/me', authenticate, requireRole('BUYER', 'SELLER', 'ADMIN'), (req: AuthenticatedRequest, res) => {
    res.status(200).json({ user: req.user })
})
export default router