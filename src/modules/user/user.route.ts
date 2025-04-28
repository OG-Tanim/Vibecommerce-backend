import { Router } from 'express'
import { authenticate } from '@middleware/auth'
import { requireRole } from '@middleware/role'
import {
    getMyProfile,
    updateMyProfile,
    getAllUsers,
    toggleUserBan, 
    getAdminDashboard,
    getSellerDashboard
} from './user.controller'

const router = Router()

//Authenticated users
router.get('/me', authenticate, getMyProfile)
router.patch('/update', authenticate, updateMyProfile)

//Seller only
router.get('/seller/dashboard', authenticate, requireRole('SELLER'), getSellerDashboard)

//Admin only
router.get('/users', authenticate, requireRole('ADMIN'), getAllUsers)
router.patch('/ban/:id', authenticate, requireRole('ADMIN'), toggleUserBan)
router.get('/admin/dashboard', authenticate, requireRole('ADMIN'), getAdminDashboard) 
export default router