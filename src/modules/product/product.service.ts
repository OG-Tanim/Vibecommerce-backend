import prisma from '@config/db'
import { Prisma } from '@prisma/client';
import { deleteCloudinaryAssets } from 'services/cloudinary-delete';
import { applyDiscountLogic } from '@utils/product.discount';

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
            videoId?: string;
            discountPrice?: number;
            discountValidTill?: Date
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
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc'}, 
            include: {
                seller: {
                    select: {id: true, name: true, email:true }
                }
            }
        })

        return products.map((applyDiscountLogic)); // Apply discount logic to each product

      },
      

    getById: async (id: string) => {
       const product = await prisma.product.findUnique({
          where: { id: id },
          include: {
              seller: { 
                  select: {id: true, name: true, email: true}
              }
          }
      });

      if (!product) throw new Error('Product not found');

      return applyDiscountLogic(product); // Apply discount logic to the product before returning it
    },

    searchProducts: async ({
        name,
        category,
        minPrice,
        maxPrice,
      }: {
        name?: string;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
      }) => {
        // Remove manual discount logic here, it will be applied after fetching

        const where: any = {
          ...(name && {
            title: {
              contains: name,
              mode: "insensitive",
            },
          }),
          ...(category && {
            category: {
              equals: category,
              mode: "insensitive",
            },
          }),
        };

        // Keep price filtering in the database query for efficiency
        if (minPrice !== undefined || maxPrice !== undefined) {
             where.price = { // Filter by the base price in the database
                 gte: minPrice,
                 lte: maxPrice
             }
             // Note: This simple price filter doesn't account for discountedPrice in the DB query.
             // For accurate filtering by *active* price in the DB, a more complex query
             // involving checking discountValidTill would be needed here.
             // For now, we'll filter by base price in DB and apply discount logic after.
        }

        const products = await prisma.product.findMany({
          where,
          orderBy: {
            createdAt: "desc",
          },
          include: { // Include seller info if needed for applyDiscountLogic or frontend
              seller: {
                  select: {id: true, name: true, email:true }
              }
          }
        });

        // Apply discount logic to each product after fetching
        return products.map(applyDiscountLogic);
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
