import { NextFunction, Request, Response } from "express";
import { ReviewService } from "./review.service";
import { AuthenticatedRequest } from "@middleware/auth";
import { AddReviewSchema } from "./review.validation";

export const ReviewController = {
    addReview: async (req:AuthenticatedRequest, res: Response, next: NextFunction) => {
        
        const validatedData = AddReviewSchema.parse(req.body)  //extra fields provided in the request body will be removed by Zod
        const { rating, comment } = validatedData
        const { productId } = req.params


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