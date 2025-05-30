import { NextFunction, Request, Response } from 'express'
import { AuthenticatedRequest } from '@middleware/auth'
import { userService, adminService, SellerService } from './user.service'

export const getMyProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = await userService.getProfile(req.user!.id)
    res.json(user)
}

export const updateMyProfile= async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const updatedUser = await userService.updateProfile(req.user!.id, req.body)
    res.json(updatedUser)
}

export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
    const users = await userService.getAll()
    res.json(users)
}

export const toggleUserBan = async (req: Request, res: Response, next: NextFunction) => {
    const updatedUserStaus = await userService.toggleBan(req.params.id) //'/:id' in the url of the request is passed
    res.json(updatedUserStaus)
}

export const getAdminDashboard = async (_req: Request, res: Response, next: NextFunction) => {
    const stats = await adminService.getDashboard()
    res.json(stats)
}

export const getSellerDashboard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const sellerId = req.user!.id
    const stats = await SellerService.getDashboardStats(sellerId)
    res.json(stats)
}
