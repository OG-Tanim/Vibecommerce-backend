import Router from 'express'
import { ReviewController } from './review.controller'
import { authenticate } from '@middleware/auth'
import { requireRole } from '@middleware/role'

const router = Router()

router.post('/', authenticate, requireRole('buyer'), ReviewController.addReview)
router.get('/:produtcId', authenticate, ReviewController.getProductReviews)

export default router 