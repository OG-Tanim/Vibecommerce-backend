//Role Checker
import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from './auth'

export const requireRole = (...roles: string[])=> {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        if (!req.user || !roles.includes(req.user.role)) { //checks if user is not logged in or authenticated. also check req.user.role is allowed (included in the parameter '...roles.')
            res.status(403).json({ message: 'Forbidden: Insufficient permissions'})
            return
        }
    next()
    }
    
}