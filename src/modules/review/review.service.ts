import prisma from '@config/db'

export const ReviewService = {
    addReview: async ({
      productId,
      buyerId,
      rating,
      comment,
    }: {
      productId: string;
      buyerId: string;
      rating: number;
      comment: string;
    }) => {
      return prisma.review.create({
        data: {
          productId,
          buyerId,
          rating, 
          comment
        }
      })
    },

    getProductReveiw: async (productId: string) =>{
      return prisma.review.findMany({
        where: { productId },
        orderBy: { createdAt: 'desc'}, 
        include: { buyer: {
          select: {
            name: true
          }
        }}

      })
    }
}