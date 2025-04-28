import { Request, Response } from 'express'
import { AuthenticatedRequest } from '@middleware/auth'
import { userService, adminService } from './user.service'

export const getMyProfile = async (req: AuthenticatedRequest, res: Response) => {
    const user = await userService.getProfile(req.user!.id)
    res.json(user)
}

export const updateMyProfile= async (req: AuthenticatedRequest, res: Response) => {
    const updatedUser = await userService.updateProfile(req.user!.id, req.body)
    res.json(updatedUser)
}

export const getAllUsers = async (_req: Request, res: Response) => {
    const users = await userService.getAll()
    res.json(users)
}

export const toggleUserBan = async (req: Request, res: Response) => {
    const updatedUserStaus = await userService.toggleBan(req.params.id) //'/:id' in the url of the request is passed
    res.json(updatedUserStaus)
}

export const getDashboard = async (_req: Request, res: Response) => {
    const stats = await adminService.getDashboard()
    res.json(stats)
}