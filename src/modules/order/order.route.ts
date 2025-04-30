import { Router } from 'express';
import { createBuyerOrder,
         getBuyerOrders,
         getSellerOrders,
         updateOrderStatus,
         handleBkashCallback
 } from "./order.controller";
 import { authenticate } from "@middleware/auth";
 import { requireRole } from '@middleware/role';

const router = Router()

// Route for creating orders buyer-only
router.post('/', authenticate, requireRole('buyer'), createBuyerOrder)
router.get('/buyer-orders', authenticate, requireRole('buyer'), getBuyerOrders)

// Seller-only routes
router.get('/seller-orders', authenticate, requireRole('seller'), getSellerOrders)
router.patch('/:id/status', authenticate, requireRole('seller'), updateOrderStatus)

// Bkash callback route ( public route - bkash will call this, not any user)
router.get('/bkash/callback', handleBkashCallback)