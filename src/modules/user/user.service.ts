import prisma from '@config/db'
import bcrypt from 'bcryptjs'

export const userService = {
    
    getProfile: async (userId: string) => { 
        return await prisma.user.findUnique({ where: {id: userId}}) //returns the record that matches the userId
    },
    
    //'updateProfile: async' defines the type of the function  
    updateProfile: async (userId: string, data: any) => {
        const { name, email, password } = data // 'data' can have any number of these params
        const updateData: any = {}

        if (name) updateData.name = name 
        if (email) updateData.email = email
        if (password) updateData.password = await bcrypt.hash(password, 10) //if name, email or password exists, it will added to updateData {name, email or password}

        return await prisma.user.update({ 
            where: {id: userId}, 
            data: updateData
        })
    },

    getAll: async () => {
        return await prisma.user.findMany({
            where: { role: { in: ['BUYER', 'SELLER']}}, //in: [] for matching against multiple possible values
            orderBy: { createdAt: 'desc'}
        })
    },

    toggleBan: async (userId: string) => {
        const user = await prisma.user.findUnique({ where: {id: userId}})
        if (!user) throw new Error('User not found')

        return await prisma.user.update({
            where: { id: userId},
            data: { isBanned: !user.isBanned}
        })
    }
}