import prisma from '@config/db'
import { deleteCloudinaryAssets } from '@utils/cloudinary-delete';

export const ProductService = {
    create : async (
        userId: string,
        data: {
            title: string;
            description: string;
            price: number;
            category: string;
            images: string[];
            imageIds: string[];
            video?:string;
            videoId?: string
        }
    ) => {
        return await prisma.product.create({
            data: {
                ...data,
                sellerId: userId
            } //'...data' is a ts/js spread syntax which just shortens the data param also allows merging of values (sellerId)
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

        //Delete old images and videos if new ones are porvided
        if (data.imageIds && product.imageIds.length > 0) {
            await deleteCloudinaryAssets(product.imageIds, 'image')
        }

        if (data.videoId && product.videoId) {
            await deleteCloudinaryAssets([product.videoId], 'video')
        }

        //now we update
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

        await deleteCloudinaryAssets(product.imageIds, 'image')
        if (product.videoId) await deleteCloudinaryAssets([product.videoId], 'video')
        return await prisma.product.delete({ where: { id }})
    }
}

