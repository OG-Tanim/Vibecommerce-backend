import { Request, Response } from "express";
import { ReviewService } from "./review.service";
import { AuthenticatedRequest } from "@middleware/auth";

export const ReviewController = {
    addReview: async (req:AuthenticatedRequest, res: Response) => {
        
        const { productId, rating, comment } = req.body

        const review = await ReviewService.addReview({
            buyerId: req.user!.id,
            productId, 
            rating,
            comment,
        })

        res.status(201).json(review)
    },

    getProductReviews: async (req: Request, res: Response) => {

        const { productId } = req.params

        const reviews = await ReviewService.getProductReveiw(productId)

        res.json(reviews)
    }
}