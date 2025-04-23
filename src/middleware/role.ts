//Role Checker
import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from './auth'

export const requireRole = (...roles: string[])=> {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        
        const userRole = req.user?.role.toUpperCase()
        const normalizedRoles = roles.map(r => r.toUpperCase())

        if (!userRole) {
            res.status(401).json({ message: 'Unauthorized: User role not found' })
            return
        }
        
        if (!normalizedRoles.includes(userRole)) {
            res.status(403).json({ message: 'Forbidden: Insufficient permissions' })
            return
        }
        //checks if user is not logged in or authenticated. also check req.user.role is allowed (the same as the value passed in the parameter '...roles.', cases are haldled) also '...role.' allows us to pass values without them being in array format
    next()
    }
    
}