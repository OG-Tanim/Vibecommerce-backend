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

export const adminService = {
    getDashboard: async () => {
        const [buyerCount, sellerCount, productCount, orderCount, totalRevenue] = await Promise.all([
            prisma.user.count({ where: { role: 'BUYER' }}),
            prisma.user.count({ where: { role: 'SELLER' }}),
            prisma.product.count(),
            prisma.order.count(),
            prisma.order.aggregate({                          //aggregate({ _sum: {}}) is used to get the sum of all the totalAmounts of all oders 
                _sum: {
                    totalAmount: true
                }
            })
        ])               //using Promise.all to run all the queries in parallel and wait for all of them to finish and returns an array with results in the same order as the in input array
                         //meaning buyerCount will be assigned to the first element of the return array, sellerCount to the second and so on
                        
        return {
            buyers: buyerCount,
            sellers: sellerCount,
            product: productCount,
            orders: orderCount,
            totalRevenue: totalRevenue._sum.totalAmount || 0
        }
    }
}                     //adminService is a separate service for admin related operations. It is not used in the user module but can be used in the admin module if needed. 