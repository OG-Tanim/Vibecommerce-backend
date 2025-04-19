import { Router } from 'express'
import { authenticate } from '@middleware/auth'
import { requireRole } from '@middleware/role'
import {
    getMyProfile,
    updateMyProfile,
    getAllUsers,
    toggleUserBan
} from './user.controller'

const router = Router()

//Authenticated users
router.get('/me', authenticate, getMyProfile)
router.patch('/update', authenticate, updateMyProfile)

//Admin only
router.get('/all', authenticate, requireRole('ADMIN'), getAllUsers)
router.patch('/ban/:id', authenticate, requireRole('ADMIN'), toggleUserBan)

export default router