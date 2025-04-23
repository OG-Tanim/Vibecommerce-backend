import { Router } from 'express';
import { createBuyerOrder,
         getBuyerOrders,
         getSellerOrders,
         updateOrderStatus
 } from "./order.controller";
 import { authenticate } from "@middleware/auth";
 import { requireRole } from '@middleware/role';

const router = Router()

router.post('/', authenticate, requireRole('buyer'), createBuyerOrder)
router.get('/buyer-orders', authenticate, requireRole('buyer'), getBuyerOrders)

router.get('/seller-orders', authenticate, requireRole('seller'), getSellerOrders)
router.patch('/:id/status', authenticate, requireRole('seller'), updateOrderStatus)
