import jwt from 'jsonwebtoken'
import { User } from '@prisma/client'

const accessSecret = process.env.JWT_SECRET!
const refreshSecret = process.env.JWT_REFRESH_SECRET!

export const generateTokens = (user: User) => {
    const payload = { id: user.id, role: user.role }
    
    const accessToken = jwt.sign(payload, accessSecret, {expiresIn: '15m'})
    const refreshToken = jwt.sign(payload, refreshSecret, {expiresIn: '7d'})

    return { accessToken, refreshToken }
}

//Token Varifier Funciton
export const verifyToken = (token: string, type: 'access' | 'refresh') => {
    const secret = type === 'access' ? accessSecret: refreshSecret

    return jwt.verify(token, secret)
    
}

