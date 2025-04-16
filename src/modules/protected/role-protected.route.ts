import { Router } from 'express'
import { authenticate, AuthenticatedRequest } from '@middleware/auth'
import { requireRole } from '@middleware/role'

const router = Router()

//Admin Only
router.get('/admin-only', authenticate, requireRole('ADMIN'), (req: AuthenticatedRequest, res) => {
    res.json({ message: 'Hello Admin', user: req.user })
})

//Seller Only
router.get( '/seller-only', authenticate, requireRole('SELLER'), (req: AuthenticatedRequest, res) => {
    res.json({ message:'Hello Seller', user: req.user})
} )

//Buyer only
router.get('/buyer-only', authenticate, requireRole('BUYER'), (req:AuthenticatedRequest, res) => {
    res.json({ message: 'Hello Buyer', user: req.user})
})

export default router