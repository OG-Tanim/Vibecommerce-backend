import prisma from '@config/db'

export const ProductService = {
    create : async (
        userId: string,
        data: {
            title: string;
            description: string;
            price: number;
            category: string;
            images: string[];
            video?:string;
        }
    ) => {
        return await prisma.product.create({
            data: {
                ...data,
                sellerId: userId
            }
        })
    },

    getAll: async () => {
        return await prisma.product.findMany({
            orderBy: { createdAt: 'desc'}, 
            include: {
                seller: {
                    select: {id: true, name: true, email:true }
                }
            }
        })
    },

    getById: async (id: string) => {
         return await prisma.product.findUnique({
            where: { id: id },
            include: {
                seller: { 
                    select: {id: true, name: true, email: true}
            }
        }
      })
    },

    update: async (id: string, userId: string, data: any) => {
        const product = await prisma.product.findUnique({
            where: { id }
        })

        if (!product) throw new Error('Product not found')
        if (product.sellerId !== userId) throw new Error('Unauthorized')

        return await prisma.product.update({
            where: { id },
            data
        })
    },

    delete: async (id: string, userId: string) => {
        const product = await prisma.product.findUnique({
            where: { id }
        })

        if (!product) throw new Error('product not found')
        if (product.sellerId !== userId) throw new Error('Unauthorized')
        
        return await prisma.product.delete({ where: { id }})
    }
}

