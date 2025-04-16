//Authenticate Access

import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const accessSecret = process.env.JWT_SECRET

export interface AuthenticatedRequest extends Request { 
    user?: { id: string; role: string } //user may or may not be there
}

interface jwtPayloadWithUser extends jwt.JwtPayload {
    id: string;
    role: string
} //jwtPayloadWithUser object will have id and role 

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction ):void => {
    const authHeader = req.headers.authorization
 
    if (!authHeader?.startsWith('Bearer ')) { 
        res.status(401).json({ message: 'Access Token Missing' }) //first makes sure  authHeader is not null or undefined with '? only then calls method. Sample Authorization Header: 'Bearer token123'
        return //return early
    } 
    const token = authHeader?.split(' ')[1]


    try {
        const decoded = jwt.verify(token, accessSecret as string) as jwtPayloadWithUser //typecasting decoded token as jwtPayloadWithUser
        
        req.user = decoded //ts does not know req.user. so defined in AuthenticatedRequest here decoded and req.user have custom interface to accomodate user id and role

        next() //passes the control to next middleware or router in the express pipeline

    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' })
        return //returns early so that it does not accidentally run next()
    }


}